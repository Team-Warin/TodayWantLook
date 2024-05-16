'use client';

import type { Rate } from '@/types/media';

import style from '@/styles/MediaPage.module.css';

import { Rate as RateEdit } from '@/action/rate';

import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Rating({
  rate,
  mediaId,
  genre,
}: {
  rate?: Rate;
  mediaId: string;
  genre: string[];
}) {
  return <div></div>;
}
