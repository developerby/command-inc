import { User } from '../../models/User';
import Variables from '../variables';

describe('Variables Interface', () => {
  it('should allow an object with a currentUser of type User', () => {
    const user: User = { id: 1, email: 'test@example.com' };
    const variables: Variables = { currentUser: user };

    expect(variables.currentUser).toBe(user);
  });

  it('should allow an object without a currentUser', () => {
    const variables: Variables = {};

    expect(variables.currentUser).toBeUndefined();
  });
});
