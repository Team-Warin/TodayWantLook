'use client';

import type { FilterType } from '@/types/media';
import type { Dispatch, SetStateAction } from 'react';

import style from '@/styles/Filter.module.css';

import { Button } from '@nextui-org/button';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Input } from '@nextui-org/input';

/**
 * Filter UI Component
 */
export default function Filter({
  filter,
  setFilter,
}: {
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
}) {
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
        { name: '액션', regex: '(?=.*(액션|스릴).*).*' },
        { name: 'SF', regex: '(?=.*(SF|로봇).*).*' },
        { name: '개그', regex: '(?=.*(개그|웃김|코믹).*).*' },
        { name: '공포', regex: '(?=.*(공포|무서움).*).*' },
        { name: '모험', regex: '(?=.*(모험|먼치킨|여행).*).*' },
        { name: '무협', regex: '(?=.*(무협|무림|사극).*).*' },
        { name: '미스터리', regex: '(?=.*(미스터리|추리).*).*' },
        { name: '범죄', regex: '(?=.*(범죄|).*).*' },
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
        { name: '매일+', regex: '(navberDaily)' },
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
                <Input placeholder='제목을 입력해주세요.' />
              ) : (
                filterList[title].filter.map((result, i) => {
                  return (
                    <Button
                      key={i}
                      className={`rounded-full shadow-sm ${
                        filter[title].indexOf(result.regex ?? '') === -1 &&
                        !(filter[title].length < 1 && result.name === 'All')
                          ? style.unCheck
                          : ''
                      }`}
                      color='primary'
                      size='sm'
                      onClick={() => {
                        let temp = { ...filter };

                        if (typeof temp[title] !== 'string') {
                          let _temp: string[] = temp[title] as string[];

                          if (result.name === 'All') {
                            _temp = [];
                          } else if (result.regex) {
                            if (!_temp.includes(result.regex)) {
                              if (title === 'updateDays') _temp = [];
                              _temp.push(result.regex);
                            } else {
                              _temp = _temp.filter(
                                (filter: string) => filter !== result.regex
                              );
                            }
                          }
                          temp[title] = _temp;

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
