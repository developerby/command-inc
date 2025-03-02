import { Command } from '../models/Command';

export default async function fetchActiveCharacters(
  env: { COMMAND_INC_CHARACTERS: KVNamespace },
  durableId: DurableObjectId,
): Promise<Command[]> {
  const prefix = `chat::${durableId}::`;

  try {
    const keysActiveCharacters = await env.COMMAND_INC_CHARACTERS.list({ prefix });

    const activeCharacters = [] as Command[];

    for (const { name } of keysActiveCharacters.keys) {
      const data = (await env.COMMAND_INC_CHARACTERS.get(name, { type: 'json' })) as Command;

      if (data) {
        activeCharacters.push(data);
      }
    }

    return activeCharacters;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching active characters from KV: ${error.message}`);
    }
    throw new Error('Error fetching active characters from KV: Unknown error');
  }
}
