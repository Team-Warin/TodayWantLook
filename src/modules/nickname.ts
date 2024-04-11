function nameCreate(): string {
  const prefix = ['웹툰을', '발톱을', '영화를', '드라마를', '학교를'];
  const adjective = [
    '좋아하는',
    '싫어하는',
    '혐오하는',
    '무서워하는',
    '재밌어하는',
  ];
  const names = ['하마', '말', '당나귀', '고양이', '물범'];

  return `${prefix[Math.floor(Math.random() * prefix.length)]} ${
    adjective[Math.floor(Math.random() * adjective.length)]
  } ${names[Math.floor(Math.random() * names.length)]}`;
}

export { nameCreate };
