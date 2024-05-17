'use server';

import { auth } from '@/auth';

import { CreateServerClient } from '@/modules/supabase';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export async function Rate(
  mediaId: string,
  genre: string[],
  data: { rate: number; comment: string }
) {
  const user = await auth();

  if (!user) throw new Error('Use Not Permissions');

  const supabase = CreateServerClient();

  let { data: rate } = await supabase
    .schema('next_auth')
    .from('users_ratings')
    .select('*')
    .match({ mediaId: mediaId, userId: user.user.id })
    .single();

  let { data: media } = await supabase
    .schema('todaywantlook')
    .from('medias')
    .select('*')
    .match({ mediaId: mediaId })
    .single();

  if (rate === null) {
    return await supabase
      .schema('next_auth')
      .from('users_ratings')
      .insert({
        userId: user.user.id,
        mediaId: mediaId,
        genre: genre,
        rate: data.rate,
        checks: { like: false, view: false, rating: true },
        comment: data.comment,
      });
  }

  rate.rate = data.rate;
  rate.checks.rating = true;
  rate.comment = data.comment;
  await supabase.schema('next_auth').from('users_ratings').upsert(rate);

  revalidateTag('/media');
  redirect(`/media/${mediaId}`);
}
