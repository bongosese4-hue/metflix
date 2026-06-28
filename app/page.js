import { Suspense } from 'react';
import HomeClient from './HomeClient';

export const metadata = {
  title: "MetFlix | Stream & Download Movies",
  description: "Premium VOD streaming - watch movies and series online or download in 360p to 1080p.",
};

export default function Home() {
  return (
    <Suspense fallback={
      <div className="page-loading">
        <div className="spinner" style={{ width: '60px', height: '60px', borderWidth: '4px' }}></div>
        <p>Loading MetFlix...</p>
      </div>
    }>
      <HomeClient />
    </Suspense>
  );
}
