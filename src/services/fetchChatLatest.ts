import { Command } from '../models/Command';

export default async function fetchChatLatest(
  env: { COMMAND_INC_HISTORY: KVNamespace },
  durableId: DurableObjectId,
): Promise<Command | undefined> {
  const key = `chat::${durableId}::latest`;

  try {
    const latestCommand = (await env.COMMAND_INC_HISTORY.get(key, { type: 'json' })) as Command;

    return latestCommand;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching the latest command from KV: ${error.message}`);
    }
    throw new Error('Error fetching the latest command from KV: Unknown error');
  }
}
