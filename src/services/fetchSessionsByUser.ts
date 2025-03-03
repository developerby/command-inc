import { Context } from 'hono';
import { User } from '../models/User';
import { Session, SessionSchema } from '../models/Session';

export default async function fetchSessionsByUser(
  context: Context
): Promise<Session[]> {
  const currentUser: User = context.get('currentUser');
  const prefix = `chats::${currentUser.id}::`;
  
  try {
    const sessionKeys = await context.env.COMMAND_INC_HISTORY.list({ prefix });    

    const sessionIds = Array.from(new Set(sessionKeys.keys.map(extractSessionId)));
    
    return sessionIds.map((id) => (SessionSchema.parse({
      id,
      events: [],
    })));
  } catch (error) {
    throw new Error('Error fetching from KV: Unknown error');
  }
}

function extractSessionId(key: any): string {
  const parts = key.name.split('::');

  return parts[2]; 
}

