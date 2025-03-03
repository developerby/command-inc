import { SessionEvent } from '../models/Session';

export async function dumpEvent(
  id: String,
  env: { COMMAND_INC_HISTORY: KVNamespace },
  stateId: DurableObjectId,
  event: SessionEvent,
): Promise<void> {
  const key = `chats::${id}::${stateId}::${event.timestamp}`;

  try {
    await env.COMMAND_INC_HISTORY.put(key, JSON.stringify(event));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to dump event to KV: ${error.message}`);
    }
    throw new Error('Failed to dump event to KV: Unknown error');
  }
}
