import type { Config } from 'tailwindcss';

import { nextui } from '@nextui-org/theme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/components/(button|code|input|modal|skeleton|accordion|popover|listbox|scroll-shadow|avatar).js',
  ],
  theme: {
    extend: {
      colors: {
        google: '#f1f4f9',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#74e174',
            },
          },
        },
      },
    }),
  ],
};
export default config;
