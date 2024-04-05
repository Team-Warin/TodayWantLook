'use client';

import type { FilterType } from '@/types/media';
import { useState, type Dispatch, type SetStateAction } from 'react';

import style from '@/styles/ui/Filter.module.css';

import { Button, Accordion, AccordionItem, Input } from '@nextui-org/react';

interface FilterProps {
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
}

/**
 * Filter UI Component
 */
export default function Filter({ filter, setFilter }: FilterProps) {
  let [value, setValue] = useState('');

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
      { name: '무협', type: '무협' },
      { name: '드라마', type: '드라마' },
      { name: '일상', type: '일상' },
      { name: '코믹', type: '코믹' },
      { name: '공포', type: '공포' },
      { name: '스릴러', type: '스릴러' },
    ],
    updateDays: [
      { name: 'All', type: 'all' },
      { name: '월', type: 'mon' },
      { name: '화', type: 'tue' },
      { name: '수', type: 'wed' },
      { name: '목', type: 'thu' },
      { name: '금', type: 'fri' },
      { name: '토', type: 'sat' },
      { name: '일', type: 'sun' },
      { name: '완결', type: 'finished' },
      { name: '매일+', type: 'naverDaily' },
    ],
  };

  return (
    <div className='mb-5'>
      <Accordion selectionMode='multiple' defaultExpandedKeys={['1', '2']}>
        <AccordionItem key='1' aria-label='search' title='검색'>
          <Input
            placeholder='제목을 입력해주세요.'
            value={value}
            onValueChange={setValue}
            onKeyDown={(e) => {
              if (e.code == 'Enter') {
                let temp = { ...filter };
                temp.title = value;

                setFilter(temp);
              }
            }}
          ></Input>
        </AccordionItem>
        <AccordionItem key='2' aria-label='genre' title='장르'>
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
        <AccordionItem key='3' aria-label='type' title='요일'>
          <div className={style.container}>
            {filterList.updateDays.map(
              (data: { name: string; type: string }, i) => {
                return (
                  <Button
                    className={`${style.btn} ${
                      filter.updateDays.indexOf(data.type) !== -1 ||
                      (filter.updateDays.length < 1 && data.type === 'all')
                        ? style.check
                        : null
                    }`}
                    size='sm'
                    key={i}
                    onClick={() => {
                      let temp: FilterType = { ...filter };

                      if (data.type === 'all') {
                        temp.updateDays = [];
                      } else if (temp.updateDays.indexOf(data.type) === -1) {
                        temp.updateDays.push(data.type);
                      } else if (temp.updateDays.indexOf(data.type) !== -1) {
                        temp.updateDays = temp.updateDays.filter(
                          (e) => e !== data.type
                        );
                      }

                      setFilter(temp);
                    }}
                  >
                    {data.name}
                  </Button>
                );
              }
            )}
          </div>
        </AccordionItem>
        <AccordionItem key='4' aria-label='content' title='콘텐츠'>
          <div className={style.container}>
            {filterList.type.map((data: { name: string; type: string }, i) => {
              return (
                <Button
                  className={`${style.btn} ${
                    filter.type.indexOf(data.type) !== -1 ||
                    (filter.type.length < 1 && data.type === 'all')
                      ? style.check
                      : null
                  }`}
                  size='sm'
                  key={i}
                  onClick={() => {
                    let temp: FilterType = { ...filter };

                    if (data.type === 'all') {
                      temp.type = [];
                    } else if (temp.type.indexOf(data.type) === -1) {
                      temp.type.push(data.type);
                    } else if (temp.type.indexOf(data.type) !== -1) {
                      temp.type = temp.type.filter((e) => e !== data.type);
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
      </Accordion>
    </div>
  );
}
