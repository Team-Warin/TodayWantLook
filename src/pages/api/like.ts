import type { MediaData, Rate } from '@/types/media';
import type { NextApiRequest, NextApiResponse } from 'next';

import { connectDB } from '@/modules/database';

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

/**
 * 첫 로그인시 /like 페이지에서 사용자가 좋아하는 작품을 받아 DB에 업로드하는 api
 */
export default async function Media(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res
      .status(401)
      .redirect(302, `/signin?callbackUrl=${process.env.NEXTAUTH_URL}`);
  } else if (session && !session.user.likes && req.method === 'POST') {
    const reqData: { likes: MediaData[] } = req.body;
    const db = (await connectDB).db(process.env.DB_NAME);

    let dbData = await db.collection<Rate>('user_rates').find({}).toArray();

    let findData: Rate | undefined;
    let newData: Rate[] = [];
    let editData: Rate[] = [];

    for (let media of reqData.likes) {
      findData = dbData.find(
        (item) =>
          item.mediaId === media.mediaId && item.userId === session.user.email
      );
      if (findData) {
        if (!findData.check.like) {
          findData.check.like = true;
          findData.rate += 5;
          editData.push(findData);
        }
      } else {
        newData.push({
          userId: session.user.email,
          mediaId: media.mediaId,
          rate: 5,
          check: {
            like: true,
            rating: false,
            view: false,
          },
        });
      }
    }

    if (newData.length > 0) {
      await db.collection<Rate>('user_rates').insertMany(newData);
    }

    if (editData.length > 0) {
      for (let data of editData) {
        await db.collection<Rate>('user_rates').updateOne(
          { mediaId: data.mediaId },
          {
            $set: {
              rate: data.rate,
              check: data.check,
            },
          }
        );
      }
    }

    if (!session.user.likes) {
      db.collection('users').updateOne(
        { email: session.user.email },
        {
          $set: {
            likes: true,
          },
        }
      );
    }

    res.status(200).send('success');
  }
}
