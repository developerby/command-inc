import { Command } from '../models/Command';

export async function fetchFakeCommandData(command: Command): Promise<{ result: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ result: `Response for: ${command.action}` });
    }, 500);
  });
}
