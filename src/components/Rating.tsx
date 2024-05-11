'use client';

import type { Rate } from '@/types/media';
import type { CardCSS } from '@/types/react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import cardStyle from '@/styles/Card.module.css';
import style from '@/styles/MediaPage.module.css';

import { Rate as RateEdit } from '@/action/rate';

import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as dontLike } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faHeart as isLike } from '@fortawesome/free-solid-svg-icons/faHeart';
import { useState } from 'react';

export default function Rating({
  rate,
  count,
  mediaId,
}: {
  rate?: Rate;
  count: number;
  mediaId: string;
}) {
  let [like, setlike] = useState(rate?.checks.like);

  return (
    <div
      className={`${cardStyle.cardWidth} ${style.ratingContainer}`}
      style={{ '--size': '0%' } as CardCSS}
    >
      <p>{count} 명</p>
      <Tooltip showArrow content='좋아요' color='danger'>
        <Button
          className='text-xl'
          isIconOnly
          variant='light'
          color='danger'
          size='lg'
          onPress={async () => {
            setlike(!like);
            await RateEdit(mediaId, 'like');
          }}
        >
          <FontAwesomeIcon icon={like === true ? isLike : dontLike} />
        </Button>
      </Tooltip>
    </div>
  );
}
