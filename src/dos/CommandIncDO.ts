import { z } from 'zod';
import { Command, createCommand } from '../models/Command';
import { dumpCommand } from '../services/dumpCommand';
import { fetchFakeCommandData } from '../services/fetchFakeCommandData';
import { User } from '../models/User';
import { activatedCharacter } from '../services/activedCharacter';
import { deactivatedCharacter } from '../services/deactivedCharacter';

export class CommandIncDO {
  state: DurableObjectState;
  env: any;
  commands: Command[];
  clients: Set<WebSocket>;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;
    this.commands = [];
    this.clients = new Set();
  }

  async sendCommand(command: Command, currentUser: User): Promise<void> {
    this.commands.push(command);

    dumpCommand(this.env, this.state.id, command);

    const durableId = this.env.COMMAND_INC_DO.idFromName(`${currentUser.id}`);

    if (command.activatedCharacter) {
      activatedCharacter(this.env, durableId, command);
    } else {
      deactivatedCharacter(this.env, durableId, command);
    }
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket', { status: 400 });
    }

    const currentUserHeader = request.headers.get('X-Current-User');
    let currentUser = {} as User;

    if (currentUserHeader) {
      try {
        currentUser = JSON.parse(currentUserHeader) as User;
      } catch (err) {
        return new Response('Invalid user data', { status: 400 });
      }
    }

    const [client, server] = Object.values(new WebSocketPair());
    server.accept();
    this.clients.add(server);

    server.addEventListener('message', async (event) => {
      try {
        const command = createCommand(event.data);
        await this.sendCommand(command, currentUser);

        for (const ws of this.clients) {
          try {
            const fakeResponse = await fetchFakeCommandData(command);
            ws.send(
              JSON.stringify({ type: 'result', data: fakeResponse, from: currentUser.email }),
            );
          } catch (err) {
            ws.close();
            this.clients.delete(ws);
          }
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          for (const ws of this.clients) {
            try {
              ws.send(JSON.stringify(error.errors));
            } catch (err) {
              ws.close();
              this.clients.delete(ws);
            }
          }
        }
      }
    });

    server.addEventListener('close', () => {
      this.clients.delete(server);
    });

    return new Response(null, { status: 101, webSocket: client });
  }
}
