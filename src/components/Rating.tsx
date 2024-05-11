'use client';

import type { Rate } from '@/types/media';

import style from '@/styles/MediaPage.module.css';

import { Rate as RateEdit } from '@/action/rate';

import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as dontLike } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faHeart as isLike } from '@fortawesome/free-solid-svg-icons/faHeart';

export default function Rating({
  rate,
  mediaId,
  genre,
}: {
  rate?: Rate;
  mediaId: string;
  genre: string[];
}) {
  return (
    <Tooltip showArrow content='좋아요' color='danger'>
      <Button
        className='text-2xl'
        isIconOnly
        variant='light'
        color='danger'
        size='lg'
        onPress={async () => {
          await RateEdit(mediaId, genre, {
            type: 'like',
            check: rate?.checks.like ?? false,
          });
        }}
      >
        <FontAwesomeIcon
          icon={rate?.checks.like === true ? isLike : dontLike}
        />
      </Button>
    </Tooltip>
  );
}
