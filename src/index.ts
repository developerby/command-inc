import { Hono } from 'hono';

import { prettyJSON } from 'hono/pretty-json';

import { currentUserMiddleware } from './middlewares/currentUserMiddleware';

import { requestLogger } from './common/requestLogger';

import dispatcherDO from './dos/DispatcherDO';
import fetchChatHistory from './services/fetchChatHistory';

import Bindings from './interfaces/bindings';
import Variables from './interfaces/variables';
import { User } from './models/User';
import fetchChatLatest from './services/fetchChatLatest';
import fetchActiveCharacters from './services/fetchActiveCharacters';

const app = new Hono<{ Variables: Variables; Bindings: Bindings }>();

app.use(prettyJSON());
app.use('*', requestLogger);
app.use('*', currentUserMiddleware);

app.get('/ws/:sessionId', (c) => {
  return dispatcherDO(c);
});

app.get('/history/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  const currentUser = c.get('currentUser') as User;

  const durableId = c.env.COMMAND_INC_DO.idFromName(`${currentUser.id}_${sessionId}`);

  const commandsHistory = await fetchChatHistory(c.env, durableId);

  return c.json(commandsHistory);
});

app.get('/state/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId');
  const currentUser = c.get('currentUser') as User;

  const durableId = c.env.COMMAND_INC_DO.idFromName(`${currentUser.id}_${sessionId}`);

  const latestCommandFromChat = await fetchChatLatest(c.env, durableId);
  // or fetch from DO or KV (if DO deatached)

  return c.json(latestCommandFromChat);
});

app.get('/characters/active', async (c) => {
  const currentUser = c.get('currentUser') as User;

  const durableId = c.env.COMMAND_INC_DO.idFromName(`${currentUser.id}`);

  const activeCharacters = await fetchActiveCharacters(c.env, durableId);

  return c.json(activeCharacters);
});

export default app;

export { CommandIncDO } from './dos/CommandIncDO';
