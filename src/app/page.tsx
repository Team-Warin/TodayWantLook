import type { MediaData } from '@/types/media';

import axios from 'axios';
import style from '@/styles/Main.module.css';

import { Sokcho } from '@/modules/font';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { headers } from 'next/headers';
import { Session } from 'next-auth';
import { connectDB } from '@/modules/database';

import Scroll from '@/components/ui/Scroll';

async function getRecommend(session: Session) {
  const baseUrl = `${
    process?.env.NODE_ENV === 'production' ? 'https' : 'http'
  }://${headers().get('host')}/api/cf`;
  const res = await axios.post(baseUrl, { session: session });

  if (res.status == 200) {
    return res.data;
  }
}

/**
 * / 페이지
 */
export default async function Home() {
  let data: MediaData[] = [];
  const db = (await connectDB).db(process.env.DB_NAME);
  const session = await getServerSession(authOptions);

  if (typeof session?.user.likes === 'boolean') {
    if (!session.user.likes) {
      redirect('/like');
    }
  }

  if (session) {
    let result = await getRecommend(session);

    data = await db
      .collection<MediaData>('media')
      .find({ mediaId: { $in: result } })
      .toArray();
    data.map((item) => {
      item._id = item._id.toString();
      return item;
    });
  }

  return (
    <main>
      <div>
        {data.length > 0 ? (
          <>
            <p className={style.sectionTitle}>
              <span
                className={Sokcho.className}
              >{`"${session?.user.nickname}"`}</span>
              님을 위한 추천!!
            </p>
            <Scroll data={data} />
          </>
        ) : null}
      </div>
    </main>
  );
}
