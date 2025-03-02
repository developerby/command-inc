import { Command } from '../models/Command';

export async function deactivatedCharacter(
  env: { COMMAND_INC_CHARACTERS: KVNamespace },
  durableId: DurableObjectId,
  command: Command,
): Promise<void> {
  const key = `chat::${durableId}::${command.character}`;

  try {
    await env.COMMAND_INC_CHARACTERS.delete(key);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete activated characters: ${error.message}`);
    }
    throw new Error('Failed to delete activated character: Unknown error');
  }
}
