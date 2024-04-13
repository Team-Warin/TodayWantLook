'use client';

import type { MediaData } from '@/types/media';

import style from '@/styles/Main.module.css';

import Card from '@/components/ui/Card';

import { ScrollShadow } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export default function Scroll({ data }: { data: MediaData[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState<number>(0);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scroll = scrollRef.current.scrollLeft;
      if (scroll <= 0 || scroll >= width * 2) {
        scrollRef.current.scrollLeft = width;
      }
    }
  }, [width]);

  useLayoutEffect(() => {
    if (contentRef.current && scrollRef.current) {
      setWidth(contentRef.current.offsetWidth);
      scrollRef.current.scrollLeft = width;
    }
  });

  return (
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
          {data.map((item, i) => {
            return <Card key={i} isLoading={false} data={item}></Card>;
          })}
        </div>
        <div ref={contentRef}>
          {data.map((item, i) => {
            return <Card key={i} isLoading={false} data={item}></Card>;
          })}
        </div>
        <div>
          {data.map((item, i) => {
            return <Card key={i} isLoading={false} data={item}></Card>;
          })}
        </div>
      </ScrollShadow>
    </div>
  );
}
