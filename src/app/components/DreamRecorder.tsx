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
  const [audio, setAudio] = useState<string[]>();
  const [chunks, setChunks] = useState<Blob[]>([]);
  const recorder = useRef<MediaRecorder>();
  const audioStream = useRef<MediaStream>();

  const onStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      recorder.current = mediaRecorder;

      let localAudioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (typeof event.data === 'undefined') return;
        if (event.data.size === 0) return;
        localAudioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(localAudioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio((prevAudio) =>
          prevAudio ? [...prevAudio, audioUrl] : [audioUrl]
        );
        setChunks([]);
        audioStream.current?.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      speechRecogniser?.start();
      setChunks(localAudioChunks);
      setButtonState('stop recording');
    } catch (err) {
      console.error('Error accessing the microphone', err);
    }
  };

  const onStopRecording = () => {
    speechRecogniser?.stop();
    recorder.current?.stop();
    setButtonState('start recording');
  };

  const onResultHandler = (event: SpeechRecognitionEvent) => {
    for (const res of event.results) {
      if (res.isFinal) {
        updateInput(res[0].transcript);
      }
    }
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
      intialiseRecogniser();
    }
  }, []);

  return (
    <div className="w-fit float-left mr-[1%]">
      <button
        type="button"
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
      {/* {audio
        ? audio.map((track) => (
            <div key={track} className="audio-container inline-block">
              <audio src={track} controls></audio>
              { <a download href={track}>
                Download Recording
              </a> }
            </div>
          ))
        : null} */}
    </div>
  );
};
