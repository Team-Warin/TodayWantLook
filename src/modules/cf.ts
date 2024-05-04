import type { WithId } from 'mongodb';
import type { MediaData } from '@/types/media';

import { connectDB } from './database';

const { CF } = require('nodeml');

export default async function CF_Media(
  maxRelatedItem: number,
  maxRelatedUser: number,
  userId: string,
  medias: number
): Promise<MediaData[] | null> {
  const cf = new CF();
  const db = (await connectDB).db(process.env.DB_NAME);
  const data = await db.collection('user_rates').find({}).toArray();

  cf.maxRelatedItem = maxRelatedItem;
  cf.maxRelatedUser = maxRelatedUser;

  cf.train(data, 'userId', 'mediaId', 'rate');

  const recommendResult = cf.recommendToUser(userId, medias);
  let mediaList: MediaData[] = [];

  recommendResult.forEach(async (item: { itemId: string; play: number }) => {
    const media = await db
      .collection<MediaData>('media')
      .findOne({ mediaId: item.itemId });

    if (media) mediaList.push(media);
  });

  return mediaList ?? null;
}
