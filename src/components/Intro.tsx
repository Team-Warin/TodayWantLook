'use client';

import type { CardCSS } from '@/types/react';
import type { MediaData } from '@/types/media';

import { WAGURI } from '@/modules/font';

import style from '@/styles/Intro.module.css';

import Image from 'next/image';
import cardStyle from '@/styles/Card.module.css';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import useDidMountEffect from './hooks/useDidMountEffect';

import Card from './Card';
import { typing } from '@/modules/hangul';
import Link from 'next/link';

export default function Intro({ medias }: { medias: MediaData[] }) {
  let [media, setMedia] = useState<MediaData[]>([medias[0], medias[1]]);
  let [selector, setSelector] = useState<number>();
  let [letter, setLetter] = useState<string>('');

  const { ref: Bg1, inView: Bg1View } = useInView({
    threshold: 0.1,
  });

  const { ref: Bg2, inView: Bg2View } = useInView({
    threshold: 0.1,
  });

  useDidMountEffect(() => {
    let temp = [...media];

    if (selector === undefined) return;

    if (!Bg1View && selector % 2 !== 0) {
      temp[0] = medias[selector + 1 >= medias.length ? 0 : selector + 1];
      setMedia(temp);
    }

    if (!Bg2View && selector % 2 === 0) {
      temp[1] = medias[selector + 1 >= medias.length ? 1 : selector + 1];
      setMedia(temp);
    }
  }, [Bg1View, Bg2View]);

  useEffect(() => {
    if (selector === undefined) return;

    const Animation = () => {
      if (selector === undefined) return;

      setSelector(selector + 1 >= 10 ? (selector = 0) : (selector += 1));
      typing(medias[selector].title, setLetter).then(() => {
        setTimeout(() => {
          Animation();
        }, 6_000);
      });
    };

    typing(medias[selector].title, setLetter).then(() => {
      setTimeout(() => {
        Animation();
      }, 6_000);
    });
  }, [selector]);

  useEffect(() => {
    setSelector(0);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.overlay}>
        <div>
          <div className={style.rankContainer}>
            <h1 className={`${style.rank} ${WAGURI.className}`}>
              <span>#</span>
              {(selector ?? 0) + 1}
            </h1>
            <h1 className={`${WAGURI.className} ${style.title}`}>{letter}</h1>
          </div>
          <div
            className={`${style.cardContainer} ${cardStyle.container}`}
            style={{ '--size': '10vw' } as CardCSS}
          >
            {media.map((data, i) => (
              <div
                key={i}
                className={i == (selector ?? -1) % 2 ? style.show : ''}
              >
                <Link href={`/media/${data.mediaId}`}>
                  <Card data={data} info={false} size={10}></Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={style.backdropImgContainer}>
        {media.map((img, i) => (
          <Image
            key={i}
            ref={i === 0 ? Bg1 : Bg2}
            className={i == (selector ?? -1) % 2 ? style.show : ''}
            src={img.img ?? img.backdropImg!}
            width={500}
            height={300}
            alt={'poster'}
          />
        ))}
      </div>
    </div>
  );
}
