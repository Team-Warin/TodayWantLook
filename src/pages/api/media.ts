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

  const keyword: { genre: { [ket: string]: string } } = {
    genre: {
      로맨스: '(로맨스|로맨틱|러브|사랑|설레는)',
      판타지: '(판타지)',
      액션: '(액션|역동적|스릴)',
    },
  };

  if (req.method === 'POST') {
    const filter: { title?: string; genre: string[]; type: [] } = {
      genre: [],
      type: [],
    };
    if (req.body.genre) {
      let genre: string;
      for (genre of req.body.genre) {
        filter.genre.push(`(?=.*${keyword.genre[genre]}.*)`);
      }
    }

    if (filter.genre.length < 1) {
      filter.genre.push('.');
    }

    const result = await db
      .collection('media')
      .find({ genre: { $regex: `${filter.genre.join('')}.*` } })
      .toArray();

    await res.status(200).send(result);
  }
}
