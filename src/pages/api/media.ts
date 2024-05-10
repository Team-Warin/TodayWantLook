import type { FilterType, MediaData } from '@/types/media';
import type { NextApiRequest, NextApiResponse } from 'next';

import { CreateClient } from '@/modules/supabase';
import { getKeys } from '@/modules/getKeys';

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
  if (req.method === 'POST') {
    const supabase = CreateClient();

    const additional = convertAdditional(req.body.filter.additional);

    const query = {
      _title: req.body.filter.title.join(''),
      _genre: req.body.filter.genre.join(''),
      _additional: additional,
      _type: req.body.filter.type.join(''),
      _update: req.body.filter.updateDays.join(''),
    };

    const { data: count } = await supabase
      .schema('todaywantlook')
      .rpc('get_count', query);

    let result = (
      await supabase
        .schema('todaywantlook')
        .rpc('get_medias', query)
        .range(req.body.page[0], req.body.page[1] - 1)
    ).data;

    if (result) {
      return res.status(200).send({
        mediaData: result,
        mediaCount: count,
      });
    }
  } else {
    res.status(400).send('Post Request Only');
  }
}

function convertAdditional(additional: string[]): string {
  const conAdditional: {
    [key: string]: boolean | string[] | undefined;
    new?: boolean;
    rest?: boolean;
    adult?: boolean;
    singularityList?: string[];
  } = {};

  additional.map((key) => {
    if (!['over15', 'waitFree'].includes(key)) {
      conAdditional[key] = true;
    } else {
      if (!conAdditional.singularityList) conAdditional.singularityList = [];
      conAdditional.singularityList?.push(key);
    }
  });

  return JSON.stringify(conAdditional);
}
