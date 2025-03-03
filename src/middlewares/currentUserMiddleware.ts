import { Context } from 'hono';
import { env } from 'hono/adapter';
import { bearerAuth } from 'hono/bearer-auth';
import { User } from '../models/User';

export const currentUserMiddleware = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization');
  const { JWT_TOKEN } = env<{ JWT_TOKEN: string }>(c);
  const bearer = bearerAuth({ token: JWT_TOKEN });

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    if (token == JWT_TOKEN) {
      const user = User.fromJSON({ id: "1" }) as User;

      c.set('currentUser', user);
    }
  }

  return bearer(c, next);
};
