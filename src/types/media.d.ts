interface MediaData {
  type: string;
  mediaId: string;
  title: string;
  author: string | null;
  summary: string;
  genre: string[];
  url: string | null;
  img: string | null;
  backdropImg: string | null;
  service: string | null;
  updateDays: string[] | null;
  rate?: number;
  additional: {
    new: boolean;
    adult: boolean;
    rest: boolean;
    up: boolean;
    singularityList: string[];
  } | null;
}

interface FilterType {
  [key: string]: string[];
  title: string[];
  genre: string[];
  additional: string[];
  type: string[];
  updateDays: string[];
}

interface Rate {
  userId: string | null | undefined;
  mediaId: string;
  genre: string[];
  rate: number;
  comment: string | null;
  checks: {
    view: boolean;
    like: boolean;
    rating: boolean;
  };
}

export type { MediaData, FilterType, Rate };
