import { ANALYSIS, END_OF_LIST, START_OF_LIST, THEME } from './constants';

export const extractDreamContent = (
  content: string,
  elementType: 'list' | 'analysis' | 'theme'
) => {
  const list = content.substring(
    content.indexOf(START_OF_LIST) + START_OF_LIST.length,
    content.indexOf(END_OF_LIST)
  );
  const theme = content.substring(
    content.indexOf(THEME) + THEME.length,
    content.indexOf(ANALYSIS)
  );
  const newAnalysis = content.substring(
    content.indexOf(ANALYSIS) + ANALYSIS.length
  );

  const listArr = list
    .split(/\r?\n/)
    .filter((element) => element !== '' && element !== ' ');

  let result;
  if (elementType === 'list') {
    result = listArr;
  } else if (elementType === 'analysis') {
    result = newAnalysis;
  } else {
    result = theme;
  }
  return result;
};
