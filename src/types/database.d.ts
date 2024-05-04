import { ObjectId } from 'mongodb';

interface DBUser {
  _id: ObjectId;
  name: string;
  email: string;
  image: string;
  roles: string[];
}

export type { DBUser };
