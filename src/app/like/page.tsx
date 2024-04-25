'use client';

import type { MediaData, FilterType } from '@/types/media';

import dynamic from 'next/dynamic';
import { useState, Suspense, useEffect } from 'react';

import { Code } from '@nextui-org/code';
import Media from '@/components/Media';
import { useSession } from 'next-auth/react';

const ShowModal = dynamic(() => import('@/components/Modal'));

/**
 * /like 페이지
 */
export default function Like() {
  const max = 10;

  const session = useSession();

  let [like, setLike] = useState<MediaData[]>([]);

  return (
    <>
      <ShowModal
        defaultOpen={true}
        modal={{
          title: '좋아하는 작품을 골라주세요~!',
          body: (
            <p>
              좋아하거나 즐겨본 작품을 골라주세요. <br />
              작품을 추천하거나 소개할 알고리즘을 위해 이 데이터가 사용됩니다.
              <br />
              <br />
              <Code color='danger'>
                최소 <span className='font-bold'>1</span>개 최대{' '}
                <span className='font-bold'>{max}</span>개 선택 가능합니다.
              </Code>
            </p>
          ),
          btn: [{ text: '알겠어요', color: 'primary' }],
        }}
      />
      <Media max={max} like={like} setLike={setLike} />
    </>
  );
}
