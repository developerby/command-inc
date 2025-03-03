import { z } from 'zod';
import { Session, SessionEvent, SessionSchema } from './Session';
import { Context } from 'hono';
import fetchSessionsByUser from '../services/fetchSessionsByUser';
import { dumpEvent } from '../services/dumpEvent';
import fetchSessionByKvId from '../services/fetchSessionByKvId';

export const UserSchema = z.object({
  id: z.string(),
  sessions: z.array(SessionSchema).default([]),
});

export type UserData = z.infer<typeof UserSchema>;

export class User {
  id: string;
  sessions: Session[];

  constructor(id: string, sessions: Session[] = []) {
    this.id = id;
    this.sessions = sessions;
  }

  addEvent(
    env: { COMMAND_INC_HISTORY: KVNamespace },
    stateId: DurableObjectId,
    event: SessionEvent,
  ) {
    dumpEvent(this.id, env, stateId, event);
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.find((s) => s.id === sessionId);
  }

  async loadSessionsFromKV(context: Context): Promise<void> {
    const sessions = await fetchSessionsByUser(context);
    this.sessions = sessions;
  }

  async loadSessionFromKV(context: Context, sessionId: string): Promise<void> {
    const session = await fetchSessionByKvId(context, sessionId);

    this.sessions = this.sessions.some((s) => s.id === session.id)
      ? this.sessions.map((s) => (s.id === session.id ? session : s))
      : [...this.sessions, session];
  }

  static fromJSON(json: unknown): User {
    const parsedData = UserSchema.parse(json);

    return new User(parsedData.id);
  }

  toJSON(): UserData {
    return {
      id: this.id,
      sessions: this.sessions,
    };
  }
}
