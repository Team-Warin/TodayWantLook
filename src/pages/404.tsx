import style from '@/styles/Error_404.module.css';

import Link from 'next/link';
import Image from 'next/image';

export default function Error_404() {
  return (
    <div className={style.container}>
      <div className={style.ErrorMessage}>
        <Image src={'/Logo.webp'} width={100} height={100} alt='logo'></Image>
        <h1>404</h1>
        <p>
          잘 못된 페이지 접속입니다. <Link href={'/'}>Home</Link>으로 돌아가기
        </p>
      </div>
    </div>
  );
}
