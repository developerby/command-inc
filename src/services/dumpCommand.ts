import { Command } from '../models/Command';

export async function dumpCommand(
  env: { COMMAND_INC_HISTORY: KVNamespace },
  stateId: DurableObjectId,
  command: Command,
): Promise<void> {
  const key = `chat::${stateId}::${command.timestamp}`;
  const latest_key = `chat::${stateId}::latest`;

  try {
    await Promise.all([
      env.COMMAND_INC_HISTORY.put(key, JSON.stringify(command)),
      env.COMMAND_INC_HISTORY.put(latest_key, JSON.stringify(command)),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to dump command: ${error.message}`);
    }
    throw new Error('Failed to dump command: Unknown error');
  }
}
