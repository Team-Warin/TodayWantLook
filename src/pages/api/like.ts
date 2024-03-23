import type { MediaData } from '@/types/media';
import type { NextApiRequest, NextApiResponse } from 'next';

import { connectDB } from '@/modules/database';

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function Media(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res
      .status(401)
      .redirect(302, `/signin?callbackUrl=${process.env.NEXTAUTH_URL}`);
  } else if (session && !session.user.likes && req.method === 'POST') {
    const reqData: { likes: MediaData[] } = req.body;
    const db = (await connectDB).db(process.env.DB_NAME);

    let data: MediaData;
    let userLikes: {
      mediaId: string;
      type: string;
      rate: number;
      check: { like: boolean; rate: boolean };
    }[] = session.user.rates;

    for (data of reqData.likes) {
      let temp: {
        mediaId: string;
        type: string;
        rate: number;
        check: { like: boolean; rate: boolean };
      };

      const inData:
        | {
            mediaId: string;
            type: string;
            rate: number;
            check: { like: boolean; rate: boolean };
          }
        | undefined = userLikes.find((e) => e.mediaId === data.mediaId);

      if (inData) {
        temp = inData;
      } else {
        temp = {
          mediaId: data.mediaId,
          type: data.type,
          rate: 0,
          check: {
            like: false,
            rate: false,
          },
        };
      }

      temp.rate += 5;
      temp.check.like = true;

      userLikes.push(temp);
    }

    db.collection('users').updateOne(
      { email: session.user.email },
      {
        $set: {
          likes: true,
          rates: userLikes,
        },
      }
    );
    res.status(200).redirect(302, '/');
  }
}
