'use client';

import type { ObjectId } from 'mongodb';
import type { MediaData } from '@/types/media';

import useSWR from 'swr';

import Card from '@/components/ui/Card';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Like() {
  const { data, error, isLoading } = useSWR('/api/media', fetcher);

  return (
    <div className='w-full mt-5 p-3'>
      <div className='flex flex-wrap justify-center gap-4'>
        {(data ?? [...Array(27).keys()]).map(
          (data: MediaData | number, i: number) => {
            return <Card key={i} isLoading={isLoading} data={data}></Card>;
          }
        )}
      </div>
    </div>
  );
}
