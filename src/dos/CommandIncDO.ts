import { z } from 'zod';
import { Command, CommandSchema } from '../models/Command';
import { fetchFakeCommandData } from '../services/fetchFakeCommandData';
import { User } from '../models/User';
import { SessionEvent } from '../models/Session';
import { createSessionEvent } from '../services/createSessionEvent';
import { parseCommandFromWebSocketData } from '../common/commandParser';

export class CommandIncDO {
  state: DurableObjectState;
  env: any;
  commands: SessionEvent[];
  clients: Set<WebSocket>;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;
    this.commands = [];
    this.clients = new Set();
  }

  async sendEvent(command: Command, currentUser: User): Promise<void> {
    const event: SessionEvent = createSessionEvent(command);

    this.commands.push(event);
    currentUser.addEvent(this.env, this.state.id, event);
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Expected WebSocket', { status: 400 });
    }

    const currentUserHeader = request.headers.get('X-Current-User');
    let currentUser = {} as User;

    if (currentUserHeader) {
      try {
        const userData = JSON.parse(currentUserHeader);
        currentUser = User.fromJSON(userData);
      } catch (err) {
        return new Response('Invalid user data', { status: 400 });
      }
    }

    const [client, server] = Object.values(new WebSocketPair());
    server.accept();
    this.clients.add(server);

    server.addEventListener('message', async (event) => {
      try {
        const command = parseCommandFromWebSocketData(event.data);
        this.sendEvent(command, currentUser);

        for (const ws of this.clients) {
          try {
            const fakeResponse = await fetchFakeCommandData(command);
            ws.send(
              JSON.stringify({
                type: 'result',
                data: fakeResponse,
                from: currentUser.id,
                session_id: this.state.id,
              }),
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
              ws.send(JSON.stringify(error));
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
