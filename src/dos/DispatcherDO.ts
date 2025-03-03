import { User } from '../models/User';

export default function dispatcherDO(context: any) {
  const currentUser = context.get('currentUser') as User;
  const sessionId = context.req.param('sessionId');

  const durableId = context.env.COMMAND_INC_DO.idFromName(`${currentUser.id}_${sessionId}`);
  const sessionDO = context.env.COMMAND_INC_DO.get(durableId);

  const requestWithCurrentUser = new Request(context.req.raw, {
    headers: {
      ...Object.fromEntries(context.req.raw.headers),
      'X-Current-User': JSON.stringify(currentUser),
    },
  });

  return sessionDO.fetch(requestWithCurrentUser);
}
