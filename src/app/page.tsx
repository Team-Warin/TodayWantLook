import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

/**
 * / 페이지
 */
export default async function Home() {
  const session = await getServerSession(authOptions);

  if (typeof session?.user.likes === 'boolean') {
    if (!session.user.likes) {
      redirect('/like');
    }
  }

  return <main></main>;
}
