interface MediaData {
  _id?: ObjectId;
  type: 'webtoon' | 'movie' | 'drama';
  mediaId: string;
  title: string;
  author?: string;
  summary: string;
  genre: string[];
  url?: string;
  img: string;
  backdropImg?: string;
  service?: string;
  updateDays?: string[];
  rate: numObjectId;
  additional?: {
    new: boolean;
    adult: boolean;
    rest: boolean;
    up: boolean;
    singularityList: string[];
  };
}

interface FilterType {
  [key: string]: string | string[];
  title: string;
  genre: RegExp[];
  type: RegExp[];
  updateDays: RegExp[];
}

interface Rate {
  userId: string | null | undefined;
  mediaId: string;
  genre: string[];
  rate: number;
  comment?: { date: Date; text: string };
  check: {
    view: boolean;
    like: boolean;
    rating: boolean;
  };
}

export type { MediaData, FilterType, Rate };
