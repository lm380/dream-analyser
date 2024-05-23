'use client';
import React, { ChangeEvent, useState, MouseEvent } from 'react';
import openAI from './utils/openAI';

export const DreamAnalyser = () => {
  const [dream, setDream] = useState('');
  const [dreamAnalysis, setDreamAnalysis] = useState('');

  const changeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDream(event?.target?.value);
  };

  //   const btnHandler = async (event: MouseEvent<HTMLElement>) => {
  //     const completion = await openAI.chat.completions.create({
  //       messages: [
  //         {
  //           role: 'system',
  //           content: `Could you analyse and break down the following dream, giving a list of key
  //       elements in the dream, what they might mean and concluding with what the dream might mean altogether, please: ${dream}`,
  //         },
  //       ],
  //       model: 'gpt-3.5-turbo',
  //     });
  //     try {
  //       setDreamAnalysis(JSON.stringify(completion.choices[0]));
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  return (
    <div>
      <textarea onChange={changeHandler}></textarea>
      {/* <button onClick={btnHandler}>Submit</button> */}
      <div>{dreamAnalysis}</div>
    </div>
  );
};
