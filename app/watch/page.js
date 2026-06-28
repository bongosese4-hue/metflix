import { Suspense } from 'react';
import WatchClient from './WatchClient';

export const metadata = {
  title: "MetFlix | Watch",
  description: "Stream and download movies online.",
};

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="page-loading">
        <div className="spinner" style={{ width: '60px', height: '60px', borderWidth: '4px' }}></div>
        <p>Loading...</p>
      </div>
    }>
      <WatchClient />
    </Suspense>
  );
}
