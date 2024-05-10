import type { NextApiRequest, NextApiResponse } from 'next';

interface YouTubeApiRequest extends NextApiRequest {
  body: { title: string; service: string };
}

interface SearchResult {
  id: string;
  type: string;
  title: string;
}

/**
 * /api/youtube api get요청을 받는 코드
 */
export default async function Youtube(
  req: YouTubeApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
  }
}
