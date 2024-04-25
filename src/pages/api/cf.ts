import type { MediaData, Rate } from '@/types/media';
import type { NextApiRequest, NextApiResponse } from 'next';

import { connectDB } from '@/modules/database';

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const { CF } = require('nodeml');

/**
 * cf 알고리즘 api
 */
export default async function CFMedia(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === 'POST') {
    const session = req.body.session;

    const cf = new CF();
    const db = (await connectDB).db(process.env.DB_NAME);
    const data = await db.collection('user_rates').find({}).toArray();

    cf.maxRelatedItem = 30;
    cf.maxRelatedUser = 30;

    cf.train(data, 'userId', 'mediaId', 'rate');

    let recommendResult = cf.recommendToUser(session.user.email, 15);
    let mediaList: string[] = [];

    recommendResult.forEach((item: { itemId: string; play: number }) => {
      mediaList.push(item.itemId);
    });

    if (mediaList) {
      res.status(200).json(mediaList);
    }
  }
}
