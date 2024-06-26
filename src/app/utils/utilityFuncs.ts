import { END_OF_LIST, START_OF_LIST } from './constants';

export const extractDreamContent = (
  content: string,
  elementType: 'list' | 'analysis'
) => {
  const list = content.substring(
    content.indexOf(START_OF_LIST) + START_OF_LIST.length,
    content.indexOf('END OF ELEMENTS FOR ANALYSIS')
  );
  const newAnalysis = content.substring(
    content.indexOf('END OF ELEMENTS FOR ANALYSIS') + END_OF_LIST.length
  );
  const listArr = list.split(/\r?\n/).filter((element) => element !== '');
  const result = elementType === 'list' ? listArr : newAnalysis;
  return result;
};
