'use client';

import style from '@/styles/Scroll.module.css';

import Card from '@/components/Card';

import useSWR from 'swr';
import axios from 'axios';

import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { MediaData } from '@/types/media';
import Link from 'next/link';
import { MediaLink } from './Media';

export default function Scroll({
  title,
  userId,
}: {
  title: React.ReactNode;
  userId: string;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState<number>(0);

  const fetcher = (url: string) =>
    axios.post(url, { type: 'cf', userId: userId }).then((res) => res.data);

  const { data, isLoading } = useSWR('/api/media', fetcher);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scroll = scrollRef.current.scrollLeft;
      if (scroll <= 0 || scroll >= width * 2) {
        scrollRef.current.scrollTo({
          left: width,
          behavior: 'instant',
        });
      }
    }
  }, [width]);

  useLayoutEffect(() => {
    if (contentRef.current && scrollRef.current) {
      setWidth(contentRef.current.offsetWidth);
      scrollRef.current.scrollTo({
        left: width,
        behavior: 'instant',
      });
    }
  });

  return (
    <>
      {title}
      <div className={style.container}>
        <div
          className={style.arrow}
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({
                left: scrollRef.current.scrollLeft - 500,
                behavior: 'smooth',
              });
            }
          }}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className='text-white opacity-80'
          />
        </div>
        <div
          className={style.arrow}
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({
                left: scrollRef.current.scrollLeft + 500,
                behavior: 'smooth',
              });
            }
          }}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className='text-white opacity-80'
          />
        </div>
        <ScrollShadow
          hideScrollBar
          orientation='horizontal'
          offset={-10}
          ref={scrollRef}
          onScroll={handleScroll}
          className={style.scrollContainer}
        >
          <div>
            {(data ? data : [...new Array(20).keys()]).map(
              (item: MediaData | number, i: number) => {
                return (
                  <MediaLink key={i} media={item}>
                    <Card isLoading={isLoading} data={item} info={false}></Card>
                  </MediaLink>
                );
              }
            )}
          </div>
          <div>
            {(data ? data : [...new Array(20).keys()]).map(
              (item: MediaData | number, i: number) => {
                return (
                  <MediaLink key={i} media={item}>
                    <Card isLoading={isLoading} data={item} info={false}></Card>
                  </MediaLink>
                );
              }
            )}
          </div>
          <div ref={contentRef}>
            {(data ? data : [...new Array(20).keys()]).map(
              (item: MediaData | number, i: number) => {
                return (
                  <MediaLink key={i} media={item}>
                    <Card isLoading={isLoading} data={item} info={false}></Card>
                  </MediaLink>
                );
              }
            )}
          </div>
          <div>
            {(data ? data : [...new Array(20).keys()]).map(
              (item: MediaData | number, i: number) => {
                return (
                  <MediaLink key={i} media={item}>
                    <Card isLoading={isLoading} data={item} info={false}></Card>
                  </MediaLink>
                );
              }
            )}
          </div>
          <div>
            {(data ? data : [...new Array(20).keys()]).map(
              (item: MediaData | number, i: number) => {
                return (
                  <MediaLink key={i} media={item}>
                    <Card isLoading={isLoading} data={item} info={false}></Card>
                  </MediaLink>
                );
              }
            )}
          </div>
        </ScrollShadow>
      </div>
    </>
  );
}
