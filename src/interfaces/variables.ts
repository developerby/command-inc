import { User } from '../models/User';

export default interface Variables {
  // logger: Logger; // DI for Logger inside endpoints or services via c.get
  currentUser?: User;
}
