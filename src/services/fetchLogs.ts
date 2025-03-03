import { Context } from 'hono';
import { LogEntry } from '../models/Log';

export default async function fetchLogs(context: Context): Promise<LogEntry[]> {
  try {
    const logKeys = await context.env.COMMAND_INC_LOGS.list();

    const logs: LogEntry[] = [];

    for (const key of logKeys.keys) {
      const logData: LogEntry = await context.env.COMMAND_INC_LOGS.get(key.name, 'json');
      logs.push(logData);
    }

    return logs;
  } catch (error) {
    throw new Error('Error fetching Logs from KV: Unknown error');
  }
}
