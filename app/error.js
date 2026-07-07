'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error('App Error:', error);
    }, [error]);

    return (
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
            <div style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong!</h2>
                <p style={{ color: '#aaa', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    A cinematic anomaly has occurred. We're experiencing technical difficulties loading this scene.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => reset()} className="primary-btn" style={{ padding: '0.75rem 1.5rem' }}>
                        Try Again
                    </button>
                    <Link href="/" className="primary-btn" style={{ background: '#333', color: '#fff', padding: '0.75rem 1.5rem' }}>
                        Go Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
