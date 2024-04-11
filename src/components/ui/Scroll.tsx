'use client';

import type { MediaData } from '@/types/media';

import style from '@/styles/Main.module.css';

import Card from '@/components/ui/Card';

import { ScrollShadow } from '@nextui-org/react';

export default function Scroll({ data }: { data: MediaData[] }) {
  return (
    <ScrollShadow
      hideScrollBar
      orientation='horizontal'
      offset={-10}
      className={style.mediaContainer}
    >
      {data.map((media, i) => {
        return <Card key={i} isLoading={false} data={media}></Card>;
      })}
    </ScrollShadow>
  );
}
