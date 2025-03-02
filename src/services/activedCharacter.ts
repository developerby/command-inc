import { Command } from '../models/Command';

const ACTIVE_CHARACTER_TTL = 60 * 60; // TTL 1h

export async function activatedCharacter(
  env: { COMMAND_INC_CHARACTERS: KVNamespace },
  durableId: DurableObjectId,
  command: Command,
): Promise<void> {
  const key = `chat::${durableId}::${command.character}`;

  try {
    await env.COMMAND_INC_CHARACTERS.put(key, JSON.stringify(command), {
      expirationTtl: ACTIVE_CHARACTER_TTL,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to store activated character: ${error.message}`);
    }
    throw new Error('Failed to store activated character: Unknown error');
  }
}
