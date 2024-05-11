'use client';

import { BMJUA } from '@/modules/font';

import style from '@/styles/MediaPage.module.css';

import { useState } from 'react';
import ShowModal from './Modal';

export default function Summary({ summary }: { summary: string }) {
  let [show, setShow] = useState(false);

  const limit = 186;

  return (
    <>
      <ShowModal
        isOpen={show}
        onClose={() => setShow(false)}
        modal={{
          title: '줄거리',
          body: <p>{summary}</p>,
          btn: [{ text: '닫기', color: 'danger' }],
        }}
      />
      <div className={BMJUA.className}>
        <div className={`${style.summary}`}>
          <p>
            {summary}
            {summary.length >= limit ? (
              <button
                className={`text-genre ${style.summaryMore}`}
                onClick={() => setShow(!show)}
              >
                ... 더보기
              </button>
            ) : null}
          </p>
        </div>
      </div>
    </>
  );
}
