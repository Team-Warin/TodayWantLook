'use client';

import type { MediaData } from '@/types/media';

import style from '@/styles/Rating.module.css';

import { useRef, useState } from 'react';
import useDidMountEffect from './hooks/useDidMountEffect';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as isStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as dontStar } from '@fortawesome/free-regular-svg-icons';

import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { Database } from '@/types/supabase-next_auth';
import { Rate } from '@/action/rate';

export default function Rating({
  media,
  rate,
}: {
  media: MediaData;
  rate: Database['next_auth']['Tables']['users_ratings']['Row'] | null;
}) {
  let [star, setStar] = useState<number>(rate ? rate.rate : 0);
  let [alert, setAlert] = useState<string>();

  let comment = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div className={style.ratingContainer}>
      <div className={style.ratingStar}>
        {[...Array(5).keys()].map((i) => {
          return (
            <FontAwesomeIcon
              key={i}
              className={i + 1 <= star ? style.on : ''}
              icon={i + 1 <= star ? isStar : dontStar}
              onClick={() => {
                setStar(i + 1);
              }}
            ></FontAwesomeIcon>
          );
        })}
      </div>
      <Textarea
        ref={comment}
        isInvalid={alert ? true : false}
        defaultValue={rate?.comment ?? ''}
        placeholder='이 작품의 평가를 입력해 주세요. (스포일러 또는 과도한 욕설 작성시 계정이 정지 될 수 있습니다.)'
        errorMessage={alert}
        className='max-w-full'
      />
      <Button
        className='max-w-xs'
        color='primary'
        onPress={async () => {
          if (star < 1) {
            return setAlert('작품의 점수를 매겨주세요.');
          } else if (!comment.current?.value.length) {
            return setAlert('작품의 평가를 작성해주세요.');
          } else if (comment.current?.value.length > 255) {
            return setAlert('255글자 이하로 장석해 주세요.');
          }

          setAlert(undefined);
          await Rate(media.mediaId, media.genre, {
            rate: star,
            comment: comment.current?.value,
          });
        }}
      >
        {rate?.checks.rating ? '수정하기' : '제출하기'}
      </Button>
    </div>
  );
}
