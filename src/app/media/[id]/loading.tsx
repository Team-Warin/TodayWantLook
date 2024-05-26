import style from '@/styles/MediaPage.module.css';

import Card from '@/components/Card';
import { Skeleton } from '@nextui-org/skeleton';

export default function Loading() {
  return (
    <div className={style.container}>
      <div className={style.mediaCardContainer}>
        <div className={style.mediaInfoContainer}>
          <div className={style.mediaCard}>
            <div className={style.mediaMobile}>
              <Card isLoading={true} info={false} />
            </div>
          </div>
        </div>
        <h1 className={style.mediaYouTubeTitle}>관련 영상을 불러오는중...</h1>
        <div className={style.mediaVideoContainer}>
          {[...Array(4).keys()].map((_, i: number) => {
            return <Skeleton key={i} className={style.mediaVideo} />;
          })}
        </div>
      </div>
    </div>
  );
}
