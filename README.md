<h1 align="center">
  <div>
    <img src="https://raw.githubusercontent.com/TodayWantLook/TWL-NextJS/a32f3cd37794bf49c0c47c7434a861d2fec8a857/public/Logo.svg" width=70/>
  </div>
  <a href="https://todaywantlook.vercel.app">TodayWantLook</a>
  <br>
  <sub><sup><b>(오늘 뭐 봐??)</b></sup></sub>
  <br>
</h1>

<p align="center">
  <b>TodayWantLook</b>은 <b>NextJS</b>로 작성된 <b>유저</b>에게 <b>맞춤형 온라인 미디어</b>를 <b>추천해주는 웹사이트</b>입니다. <b>User Collaborative Filtering 알고리즘</b>을 사용하여 <b>유저의 선호도</b>를 파악하고, 이를 기반으로 <b>맞춤형 미디어</b>를 추천해줍니다. <b>다양한 온라인 미디어</b>를 제공하며, 유저는 자신이 <b>관심 있는 분야의 미디어</b>를 <b>쉽게</b> 찾을 수 있습니다.
</p>

## Usage

```bash
npm i
```

```dosini
//env.local

DB_NAME = Your DB NAME
DB_URL = Your DB Url (MongoDB)

NEXTAUTH_URL = http://localhost:3000
AUTH_SECRET = AuthSecret

AUTH_GOOGLE_ID = Google OAuthId
AUTH_GOOGLE_SECRET = Google OAuth Secret

API_KEY = Auth API Key

ADMIN_PWD = Page Admin Permission Pwd
```

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Features

- **Collaborative Filtering**

  User Collaborative Filtering 알고리즘을 사용하여 자신과 유사한 사용자가 본 온라인 미디어를 추천해 사용자에게 알맞는 온라인 미디어를 제공해줄 수 있습니다.

- **SSR**

  SSR(Server-Side-Rendering)을 사용하여 좀 더 빠른 웹 페이지를 불러옵니다.

- **Movie, Drama, WebToon**

  여러 온라인 미디어 데이터를 저장하고 있어 사용자에게 여러 선택지 및 다양한 콘텐츠를 제공합니다.

## Developer

<b>명지전문대 AI·빅데이터</b>과 <b>캡스톤 디자인 6조</b> 그리고 <b>킹고바이오 대표</b>님의 멘토링 및 도움으로 만들어진 작품입니다.

|    이름    |                                                       역할                                                       |
| :--------: | :--------------------------------------------------------------------------------------------------------------: |
| **INIRU**  | `Leader`, `Main Developer`, `Front-End`, `Back-End`, `DataBase`, `Collaborative Filtering`, `Git Project Leader` |
| **KIMMJ**  |                  `UI/UX Design`, `UI/UX Developer`, `Idea`, `Logo Design`, `DataBase ER Model`                   |
| **HYUNW**  |                           `Server Developer`, `QA Tester`, `Media API`, `Social Login`                           |
| **이준엽** |                                                   `Mentoring`                                                    |

## 라이센스

이 앱은 <a href="https://github.com/INIRU/TodayWantLook/TWL-NextJS/blob/main/LICENSE" target="_blank">MIT 라이센스</a> 조건에 따라 라이센스가 부여됩니다. <br>
자세한 내용은 [LICENSE](LICENSE)를 참고하십시오.

## Credits

- 캡스톤 디자인 6조 - Warin
