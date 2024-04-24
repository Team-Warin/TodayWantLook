import type { NextApiRequest, NextApiResponse } from 'next';

import { connectDB } from '@/modules/database';

interface UserApiRequest extends NextApiRequest {
  body: {
    email: string;
    key: string;
  };
}

/**
 * /api/media api get요청을 받는 코드
 */
export default async function Media(req: UserApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (req.body.key !== process.env.API_KEY) {
      return res.status(403).send('API KEY ERROR');
    }

    const db = (await connectDB).db(process.env.DB_NAME);
    const user = await db
      .collection('users')
      .findOne({ email: req.body.email });

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send('user data not founded');
    }
  }
}
