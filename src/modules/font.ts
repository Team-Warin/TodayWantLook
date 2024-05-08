import localFont from 'next/font/local';

const BMJUA = localFont({
  src: [
    {
      path: '../font/BMJUA.woff',
      weight: '500',
    },
  ],
});

const WAGURI = localFont({
  src: [
    {
      path: '../font/WAGURITTF.woff2',
      weight: '500',
    },
  ],
});

export { BMJUA, WAGURI };
