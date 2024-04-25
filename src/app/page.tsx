import type { MediaData } from '@/types/media';

import Scroll from '@/components/Scroll';
import { auth } from '@/auth';

/**
 * / 페이지
 */
export default async function Home() {
  let data: MediaData[] = [];

  const session = await auth();

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
      <div></div>
    </main>
  );
}
