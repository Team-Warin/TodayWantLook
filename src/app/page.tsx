import type { MediaData } from '@/types/media';

import Scroll from '@/components/Scroll';
import { SignIn } from '@/components/test';
import { auth } from '@/auth';

/**
 * / 페이지
 */
export default async function Home() {
  let data: MediaData[] = [];

  const session = await auth();

  console.log(session);

  // if (session) {
  //   let result = await getRecommend(session);

  //   data = await db
  //     .collection<MediaData>('media')
  //     .find({ mediaId: { $in: result } })
  //     .toArray();
  //   data.map((item) => {
  //     item._id = item._id.toString();
  //     return item;
  //   });
  // }

  return (
    <main>
      <div>
        {data.length > 0 ? (
          <>
            {/* <p className={style.sectionTitle}>
              <span
                className={Sokcho.className}
              >{`"${session?.user.nickname}"`}</span>
              님을 위한 추천!!
            </p> */}
            <Scroll data={data} />
          </>
        ) : null}
        <SignIn></SignIn>
      </div>
    </main>
  );
}
