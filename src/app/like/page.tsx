'use client';

import type { MediaData } from '@/types/media';
import type { Dispatch, SetStateAction } from 'react';

import style from '@/styles/Like.module.css';

import useSWR from 'swr';

import Card from '@/components/ui/Card';
import { useState, useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Like() {
  const { data, error, isLoading } = useSWR('/api/media', fetcher);

  let [likes, setLikes] = useState<MediaData[]>([]);
  let [items, setItmes] = useState(27);

  function Observer() {
    setItmes((items += 18));
  }

  useEffect(() => {
    const observer = new IntersectionObserver(Observer, {
      threshold: 0,
    });

    const observerTarget = document.getElementById('observer');

    if (observerTarget) {
      observer.observe(observerTarget);
    }
  }, []);

  return (
    <div className='w-full mt-5 p-3'>
      <div className='flex flex-wrap justify-center gap-4'>
        {(data ?? [...Array(27).keys()])
          .slice(0, items)
          .map((data: MediaData | number, i: number) => {
            return (
              <LikeMedia
                key={i}
                isLoading={isLoading}
                data={data}
                likes={likes}
                setLikes={setLikes}
              ></LikeMedia>
            );
          })}
        <div id='observer' className='w-full h-3'></div>
      </div>
    </div>
  );
}

function LikeMedia(props: {
  isLoading: boolean;
  data: MediaData | number;
  likes: MediaData[];
  setLikes: Dispatch<SetStateAction<MediaData[]>>;
}) {
  let [checked, setChecked] = useState(false);

  if (props.isLoading) {
    return <Card isLoading={props.isLoading} data={props.data}></Card>;
  }
  return (
    <div
      className={`${style.checkbox} ${checked ? style.checked : ''}`}
      onClick={() => {
        let temp = [...props.likes];

        if (typeof props.data !== 'number') {
          const data: MediaData = props.data;
          if (checked) {
            temp.filter((e: MediaData) => e.title !== data.title);
          } else if (props.data) {
            temp.push(props.data);
          }
        }

        props.setLikes(temp);
        setChecked(!checked);
        console.log(temp);
      }}
    >
      <Card isLoading={props.isLoading} data={props.data}></Card>
    </div>
  );
}
