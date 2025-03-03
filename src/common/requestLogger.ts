import { Context, Next } from 'hono';

interface Bindings {
  COMMAND_INC_LOGS: KVNamespace;
}

export async function requestLogger(c: Context<{ Bindings: Bindings }>, next: Next) {
  const { method, url } = c.req;
  const body = await c.req.text();

  const logEntry = {
    method,
    url,
    body,
    timestamp: new Date().toISOString(),
  };

  const logKey = `log:${Date.now()}`;

  await c.env.COMMAND_INC_LOGS.put(logKey, JSON.stringify(logEntry));

  await next();
}
