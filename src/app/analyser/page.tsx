import DreamAnalyser from '../components/dreamAnalyser';
import { DreamRecorder } from '../components/dreamRecorder';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <DreamAnalyser />
        {/* <DreamRecorder /> */}
      </div>
    </main>
  );
}
