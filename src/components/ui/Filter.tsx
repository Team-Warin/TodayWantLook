'use client';

import type { FilterType } from '@/types/media';
import type { Dispatch, SetStateAction } from 'react';
import type { TriggerWithoutArgs } from 'swr/mutation';

import style from '@/styles/ui/Filter.module.css';

import { Button, Accordion, AccordionItem } from '@nextui-org/react';

interface FilterProps {
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
}

export default function Filter({ filter, setFilter }: FilterProps) {
  const filterList = {
    type: [
      { name: 'All', type: 'all' },
      { name: '웹툰', type: 'webtoon' },
      { name: '영화', type: 'movie' },
      { name: '드라마', type: 'drama' },
    ],
    genre: [
      { name: 'All', type: 'all' },
      { name: '판타지', type: '판타지' },
      { name: '액션', type: '액션' },
      { name: '로맨스', type: '로맨스' },
    ],
  };

  return (
    <div>
      <Accordion selectionMode='multiple'>
        <AccordionItem key='1' aria-label='genre' title='장르'>
          <div className={style.container}>
            {filterList.genre.map((data: { name: string; type: string }, i) => {
              return (
                <Button
                  className={`${style.btn} ${
                    filter.genre.indexOf(data.type) !== -1 ||
                    (filter.genre.length < 1 && data.type === 'all')
                      ? style.check
                      : null
                  }`}
                  size='sm'
                  key={i}
                  onClick={() => {
                    let temp: FilterType = { ...filter };

                    if (data.type === 'all') {
                      temp.genre = [];
                    } else if (temp.genre.indexOf(data.type) === -1) {
                      temp.genre.push(data.type);
                    } else if (temp.genre.indexOf(data.type) !== -1) {
                      temp.genre = temp.genre.filter((e) => e !== data.type);
                    }

                    setFilter(temp);
                  }}
                >
                  {data.name}
                </Button>
              );
            })}
          </div>
        </AccordionItem>
        <AccordionItem key='2' aria-label='type' title='콘텐츠'>
          <div className={style.container}>
            {filterList.type.map((data: { name: string; type: string }, i) => {
              return (
                <Button
                  className={`${style.btn}`}
                  size='sm'
                  key={i}
                  onClick={() => {}}
                >
                  {data.name}
                </Button>
              );
            })}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
