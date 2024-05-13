'use client';

import type { FilterType } from '@/types/media';
import type { Dispatch, SetStateAction } from 'react';

import style from '@/styles/Filter.module.css';

import { useState } from 'react';

import { Button } from '@nextui-org/button';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Input } from '@nextui-org/input';

/**
 * Filter UI Component
 */
export default function Filter({
  isMutating,
  filter,
  setFilter,
}: {
  isMutating: boolean;
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
}) {
  let [value, setValue] = useState<string>();

  const filterList: {
    [key: string]: { name: string; filter: { name: string; regex?: string }[] };
  } = {
    title: {
      name: '타이틀',
      filter: [],
    },
    genre: {
      name: '장르',
      filter: [
        { name: 'All' },
        { name: '로맨스', regex: '(?=.*(로맨스|설레는|달달함).*).*' },
        { name: '판타지', regex: '(?=.*(판타지|회귀물|차원이동물).*).*' },
        { name: '액션', regex: '(?=.*(액션|스릴|긴장감).*).*' },
        { name: 'SF', regex: '(?=.*(SF|로봇).*).*' },
        { name: '개그', regex: '(?=.*(개그|웃김|코믹).*).*' },
        { name: '공포', regex: '(?=.*(공포|무서움).*).*' },
        { name: '모험', regex: '(?=.*(모험|먼치킨|여행).*).*' },
        { name: '무협', regex: '(?=.*(무협|무림|사극).*).*' },
        { name: '미스터리', regex: '(?=.*(미스터리|추리).*).*' },
        { name: '범죄', regex: '(?=.*(범죄).*).*' },
        { name: '레벨업', regex: '(?=.*(레벨업|성장).*).*' },
        { name: '일상', regex: '(?=.*(일상).*).*' },
        { name: '드라마', regex: '(?=.*(드라마).*).*' },
        { name: '요리', regex: '(?=.*(음식|요리).*).*' },
        { name: '스포츠', regex: '(?=.*(스포츠).*).*' },
      ],
    },
    additional: {
      name: '부가 검색',
      filter: [
        { name: 'All' },
        { name: '15세', regex: 'over15' },
        { name: '19세', regex: 'adult' },
        { name: '신작', regex: 'new' },
        { name: '휴재', regex: 'rest' },
        { name: '연재무료', regex: 'free' },
        { name: '기다무', regex: 'waitFree' },
      ],
    },
    updateDays: {
      name: '요일',
      filter: [
        { name: 'All' },
        { name: '월', regex: '(mon)' },
        { name: '화', regex: '(tue)' },
        { name: '수', regex: '(wed)' },
        { name: '목', regex: '(thu)' },
        { name: '금', regex: '(fri)' },
        { name: '토', regex: '(sat)' },
        { name: '일', regex: '(sun)' },
        { name: '완결', regex: '(finished)' },
        { name: '매일+', regex: '(naverDaily)' },
      ],
    },
    type: {
      name: '콘텐츠',
      filter: [
        { name: 'All' },
        { name: '웹툰', regex: '(?=.*(webtoon).*).*' },
        { name: '영화', regex: '(?=.*(movie).*).*' },
        { name: '드라마', regex: '(?=.*(drama).*).*' },
      ],
    },
  };

  return (
    <Accordion
      defaultExpandedKeys={[
        ...Array(Object.keys(filterList).length).keys(),
      ].map((i) => `${i}`)}
      selectionMode='multiple'
      variant='shadow'
      className='pt-3 pb-3'
    >
      {Object.keys(filterList).map((title: string, i: number) => {
        return (
          <AccordionItem
            key={i}
            className='mb-2'
            aria-label={title}
            title={filterList[title].name}
          >
            <div className='flex flex-wrap gap-3'>
              {title === 'title' ? (
                <Input
                  placeholder='제목을 입력해주세요.'
                  value={value}
                  onValueChange={setValue}
                  onKeyDown={(e) => {
                    if (
                      !isMutating &&
                      e.code === 'Enter' &&
                      value &&
                      value.length >= 1
                    ) {
                      let temp = { ...filter };
                      temp.title = [
                        `(?=.*(${[...value.replace(' ', '')].join('.*')}).*).*`,
                      ];

                      setFilter(temp);
                    } else if (!isMutating && e.code === 'Enter' && !value) {
                      let temp = { ...filter };
                      temp.title = [];

                      setFilter(temp);
                    }
                  }}
                />
              ) : (
                filterList[title].filter.map((result, i) => {
                  return (
                    <Button
                      key={i}
                      color='primary'
                      className={`rounded-full shadow-sm ${filter[title].includes(result.regex ?? '') || (filter[title].length < 1 && result.name === 'All') ? '' : style.unCheck}`}
                      size='sm'
                      onClick={() => {
                        let temp: FilterType = { ...filter };

                        if (typeof temp[title] !== 'string') {
                          if (result.name === 'All') {
                            temp[title] = [];
                          } else if (result.regex) {
                            if (!temp[title].includes(result.regex)) {
                              if (title === 'updateDays') temp[title] = [];
                              temp[title].push(result.regex);
                            } else {
                              temp[title] = temp[title].filter(
                                (filter: string) => filter !== result.regex
                              );
                            }
                          }

                          setFilter(temp);
                        }
                      }}
                    >
                      {result.name}
                    </Button>
                  );
                })
              )}
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
