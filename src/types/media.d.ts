interface MediaData {
  _id?: ObjectId;
  type: 'webtoon' | 'movie' | 'drama';
  mediaId: string;
  title: string;
  author?: string;
  summary: string;
  genre: string[];
  url?: { [key: string]: string };
  img: string;
  backdrop_img?: string;
  service?: string[];
  updateDays?: string[];
  rate: number;
  rates: { user: string; rate: number; comment: string | null }[];
  additional?: {
    new: boolean;
    adult: boolean;
    rest: boolean;
    up: boolean;
    singularityList: string[];
  };
}

interface FilterType {
  title: string;
  genre: (string | null)[];
  type: (string | null)[];
  updateDays: (string | null)[];
}

export type { MediaData, FilterType };
