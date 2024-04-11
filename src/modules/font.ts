import localFont from 'next/font/local';

const BMJUA = localFont({
  src: [
    {
      path: '../font/BMJUA.woff',
      weight: '500',
    },
  ],
});

const Sokcho = localFont({
  src: [
    {
      path: '../font/SokchoBadaDotum.woff2',
      weight: '500',
    },
  ],
});

export { BMJUA, Sokcho };
