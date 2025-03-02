import { User } from '../models/User';

export default function dispatcherDO(c: any) {
  const currentUser = c.get('currentUser') as User;
  const sessionId = c.req.param('sessionId');

  const durableId = c.env.COMMAND_INC_DO.idFromName(`${currentUser.id}_${sessionId}`);
  const sessionDO = c.env.COMMAND_INC_DO.get(durableId);

  const requestWithCurrentUser = new Request(c.req.raw, {
    headers: {
      ...Object.fromEntries(c.req.raw.headers),
      'X-Current-User': JSON.stringify(currentUser),
    },
  });

  return sessionDO.fetch(requestWithCurrentUser);
}
