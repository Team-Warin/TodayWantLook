import type { FilterType, MediaData } from '@/types/media';
import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateClient } from '@/modules/supabase';
// import CF_Media from '@/modules/cf';

interface MediaApiRequest extends NextApiRequest {
  body: {
    filter: FilterType;
    page: [number, number];
    type?: string;
  };
}

/**
 * /api/media api get요청을 받는 코드
 */
export default async function Media(
  req: MediaApiRequest,
  res: NextApiResponse
) {
  let recMedia: MediaData[] = [];

  if (req.method === 'POST') {
    const supabase = CreateClient();

    const filters: { [key: string]: { $in: RegExp[] } }[] = [];
    let result = (
      await supabase.schema('todaywantlook').from('medias').select('*')
    ).data;

    Object.keys(req.body.filter).forEach((key: string) => {
      if (!req.body.filter[key].length) return;

      if (typeof req.body.filter[key] === 'string' && result) {
        result = result?.filter((data) => data.title === req.body.filter[key]);
      } else if (typeof req.body.filter[key] !== 'string' && result) {
        (req.body.filter[key] as string[]).map((filter: string | RegExp) => {
          if (!result) return;

          filter = new RegExp(filter);
          console.log(filter);
          result = result.filter((data: { [key: string]: any }) =>
            data[key].some((query: string) => filter.test(query))
          );
        });
      }
    });

    if (result) {
      return res.status(200).send({
        mediaData: result.slice(req.body.page[0], req.body.page[1]),
        mediaCount: result.length,
      });
    }
  } else {
    res.status(400).send('Post Request Only');
  }
}
