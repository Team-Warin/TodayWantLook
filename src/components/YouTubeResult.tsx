import type { MediaData } from '@/types/media';

import style from '@/styles/MediaPage.module.css';

import { getYouTube } from '@/modules/getYoutube';

export default async function YouTubeResult({ media }: { media: MediaData }) {
  const youtubes = await getYouTube(media.title, media.service!);

  if (!youtubes) return <></>;

  return (
    <div>
      <h1
        className={style.mediaYouTubeTitle}
      >{`"${media?.title!} 웹툰 리뷰" 유튜브 검색 결과`}</h1>
      {youtubes.length ? (
        <div className={style.mediaVideoContainer}>
          {youtubes.map((video, i) => {
            return (
              <iframe
                key={i}
                src={video}
                width='560'
                height='315'
                title={media?.title!}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              ></iframe>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
