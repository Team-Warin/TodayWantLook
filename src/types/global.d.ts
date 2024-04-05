export {};

import { MongoClient } from 'mongodb';

/**
 * modules/database.ts에 global._mongo 변수 타입 지정
 */
declare global {
  var _mongo: Promise<MongoClient> | undefined;
}
