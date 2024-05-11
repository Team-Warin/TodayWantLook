'use client';

import style from '@/styles/MediaPage.module.css';

export default function YouTubeResult({ urls }: { urls: string[] }) {
  return (
    <div className={style.mediaVideoContainer}>
      {urls.slice(0, 4).map((url: string, i) => {
        return (
          <iframe
            className={style.mediaVideo}
            key={i}
            width='560'
            height='315'
            src={url}
            title='YouTube video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
          ></iframe>
        );
      })}
    </div>
  );
}
