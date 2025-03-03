import { Hono } from 'hono';

import { prettyJSON } from 'hono/pretty-json';

import { currentUserMiddleware } from './middlewares/currentUserMiddleware';

import { requestLogger } from './common/requestLogger';

import dispatcherDO from './dos/DispatcherDO';

import Bindings from './interfaces/bindings';
import Variables from './interfaces/variables';
import { User } from './models/User';
import { getActiveCharacters } from './services/getActiveCharacters';
import fetchLogs from './services/fetchLogs';

const app = new Hono<{ Variables: Variables; Bindings: Bindings }>();

app.use(prettyJSON());
app.use('*', requestLogger);
app.use('*', currentUserMiddleware);

app.get('/ws/:sessionId', (context) => {
  return dispatcherDO(context);
});

// Sessions for history
app.get('/sessions', async (context) => {
  const currentUser = context.get('currentUser') as User;
  await currentUser.loadSessionsFromKV(context);

  return context.json(currentUser.sessions);
});

// Session State by ID
app.get('/sessions/:sessionId', async (context) => {
  const sessionId = context.req.param('sessionId');
  const currentUser = context.get('currentUser') as User;

  await currentUser.loadSessionFromKV(context, sessionId);

  return context.json(currentUser.getSession(sessionId));
});

// Session State by ID
app.get('/sessions/:sessionId/characters/active', async (context) => {
  const sessionId = context.req.param('sessionId');
  const currentUser = context.get('currentUser') as User;

  await currentUser.loadSessionFromKV(context, sessionId);

  const session = currentUser.getSession(sessionId);

  let activeCharacters: string[] = [];

  if (session) {
    activeCharacters = getActiveCharacters(session);
  }

  return context.json(activeCharacters);
});

// Logs
app.get('/logs', async (context) => {
  const logs = await fetchLogs(context);
  return context.json(logs);
});

export default app;

export { CommandIncDO } from './dos/CommandIncDO';
