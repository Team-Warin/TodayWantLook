import type { NextApiRequest, NextApiResponse } from 'next';
import type { FilterType } from '@/types/media';

import { connectDB } from '@/modules/database';

interface MediaApiRequest extends NextApiRequest {
  body: {
    filter: FilterType;
    page: [number, number];
  };
}

/**
 * /api/media api get요청을 받는 코드
 */
export default async function Media(
  req: MediaApiRequest,
  res: NextApiResponse
) {
  const db = (await connectDB).db(process.env.DB_NAME);
  let result;
  let mediaCount: number = 1;

  if (req.method === 'POST') {
    const filterList: {
      [key: string]: RegExp[] | undefined;
      title?: RegExp[];
      genre?: RegExp[];
      type?: RegExp[];
      updateDays?: RegExp[];
    } = {};
  } else {
    res.status(400).send('Post Request Only');
  }

  if (result && mediaCount) {
  } else {
    await res.status(400).send('Bad Request');
  }
}
