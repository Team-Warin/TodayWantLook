export {};

import { MongoClient } from 'mongodb';

declare global {
  var _mongo: Promise<MongoClient> | undefined;
}
