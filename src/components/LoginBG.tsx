import { MediaData } from '@/types/media';

import style from '@/styles/Login.module.css';

import Card from '@/components/Card';

export default function LoginBG({
  bgMediaList,
}: {
  bgMediaList: MediaData[][];
}) {
  return (
    <>
      {bgMediaList.map((mediaList: MediaData[], i: number) => {
        return (
          <div key={i} className={style.bgCard}>
            {[...Array(2).keys()].map((i: number) => {
              return (
                <div key={i} className={style.cardSlider}>
                  {mediaList.map((media: MediaData, i: number) => {
                    return (
                      <Card
                        isLoading={false}
                        data={media}
                        info={false}
                        size={7}
                        key={i}
                      ></Card>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
