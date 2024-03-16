import type { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { connectDB } from '@/modules/database';

interface MediaData {
  _id?: ObjectId;
  type: 'webtoon' | 'movie' | 'drama';
  mediaId: string;
  title: string;
  author: string;
  summary: string;
  genre: string[];
  url?: { [key: string]: string };
  img: string;
  backdrop_img?: string;
  service: string[];
  updateDays: string[];
  rate: number;
  rates: { user: string; rate: number; comment: string | null }[];
  additional?: {
    new: boolean;
    adult: boolean;
    rest: boolean;
    up: boolean;
    singularityList: string[];
  };
}

export default async function Media(req: NextApiRequest, res: NextApiResponse) {
  const db = (await connectDB).db(process.env.DB_NAME);
  const result = await db.collection('media').find().toArray();

  if (req.method === 'GET') {
    await res.status(200).send(result);
  }
}
