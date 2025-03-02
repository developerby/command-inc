import { Command } from '../models/Command';

export default async function fetchChatHistory(
  env: { COMMAND_INC_HISTORY: KVNamespace },
  durableId: DurableObjectId,
): Promise<Command[]> {
  const prefix = `chat::${durableId}::`;

  try {
    const keyCommands = await env.COMMAND_INC_HISTORY.list({ prefix });

    const commandsHistory = [] as Command[];

    for (const { name } of keyCommands.keys) {
      const data = (await env.COMMAND_INC_HISTORY.get(name, { type: 'json' })) as Command;

      if (data) {
        commandsHistory.push(data);
      }
    }

    return commandsHistory;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching history from KV: ${error.message}`);
    }
    throw new Error('Error fetching history from KV: Unknown error');
  }
}
