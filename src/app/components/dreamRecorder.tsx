'use client';
import { StopCircleIcon } from '@heroicons/react/24/outline';
import MicrophoneIcon from '@heroicons/react/24/outline/MicrophoneIcon';
import React, { useEffect, useRef, useState } from 'react';

export const DreamRecorder = ({
  updateInput,
}: {
  updateInput: (recordedText: string) => void;
}) => {
  const [buttonState, setButtonState] = useState('start recording');
  const [speechRecogniser, setSpeechRecogniser] = useState<SpeechRecognition>();
  const [audio, setAudio] = useState<string>();
  const [chunks, setChunks] = useState<Blob[]>([]);
  const recorder = useRef<MediaRecorder>();

  const onStartRecording = () => {
    console.log('started recording');
    speechRecogniser?.start();
    recorder.current?.start();
    let localAudioChunks: Blob[] = [];
    if (recorder.current)
      recorder.current.ondataavailable = (event) => {
        if (typeof event.data === 'undefined') return;
        if (event.data.size === 0) return;
        localAudioChunks.push(event.data);
      };
    setChunks(localAudioChunks);
    setButtonState('stop recording');
    console.log('out of start recording');
  };

  const onStopRecording = () => {
    speechRecogniser?.stop();
    recorder.current?.stop();
    if (recorder.current)
      recorder.current.onstop = () => {
        //creates a blob file from the audiochunks data
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        //creates a playable URL from the blob file.
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
        setChunks([]);
      };
    setButtonState('start recording');
  };

  const onResultHandler = (event: SpeechRecognitionEvent) => {
    for (const res of event.results) {
      if (res.isFinal) {
        updateInput(res[0].transcript);
      }
    }
  };

  const initialiseRecording = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);
    recorder.current = mediaRecorder;
  };

  const intialiseRecogniser = () => {
    const Recogniser =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const speechRecogniser = new Recogniser();

    speechRecogniser.continuous = true;
    speechRecogniser.interimResults = true;
    speechRecogniser.addEventListener('result', onResultHandler);
    setSpeechRecogniser(speechRecogniser);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(intialiseRecogniser);

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => initialiseRecording(stream));
    }
  }, []);

  return (
    <div className="w-fit float-left mr-[1%]">
      <button
        className="rounded-full bg-white h-10 w-10"
        onClick={() => {
          buttonState === 'start recording'
            ? onStartRecording()
            : onStopRecording();
        }}
      >
        {buttonState === 'start recording' ? (
          <MicrophoneIcon className="mt-[15px] ml-[10px] h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        ) : (
          <StopCircleIcon className="mt-[15px] ml-[10px] h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        )}
      </button>
      {audio ? (
        <div className="audio-container">
          <audio src={audio} controls></audio>
          <a download href={audio}>
            Download Recording
          </a>
        </div>
      ) : null}
    </div>
  );
};
