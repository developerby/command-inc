import { Context } from 'hono';
import { User } from '../models/User';
import { Session, SessionSchema, SessionEvent, SessionEventSchema } from '../models/Session';

export default async function fetchSessionByKvId(
  context: Context,
  sessionId: string,
): Promise<Session> {
  const currentUser: User = context.get('currentUser');
  const prefix = `chats::${currentUser.id}::${sessionId}::`;

  try {
    const sessionKeys = await context.env.COMMAND_INC_HISTORY.list({ prefix });
    const events: SessionEvent[] = [];

    for (const key of sessionKeys.keys) {
      const eventData = await context.env.COMMAND_INC_HISTORY.get(key.name, 'json');

      if (eventData) {
        try {
          const validEvent = SessionEventSchema.parse(eventData);
          events.push(validEvent);
        } catch (error) {
          console.warn(`Invalid event data for key ${key.name}`, error);
        }
      }
    }

    const session: Session = {
      id: sessionId,
      events: events.sort((a, b) => a.timestamp - b.timestamp),
    };

    return session;
  } catch {
    throw new Error('Error fetching from KV: Unknown error');
  }
}
