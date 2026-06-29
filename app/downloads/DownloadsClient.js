'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DownloadsClient() {
    const [activeTab, setActiveTab] = useState('downloading');

    return (
        <main className="main-content" style={{ padding: '1rem', paddingBottom: '80px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Downloads</h1>
            
            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <div 
                    onClick={() => setActiveTab('downloading')}
                    style={{ 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        color: activeTab === 'downloading' ? '#fff' : '#888',
                        position: 'relative'
                    }}
                >
                    Downloading
                    {activeTab === 'downloading' && (
                        <div style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%', height: '3px', background: '#e50914', borderRadius: '2px' }} />
                    )}
                </div>
                <div 
                    onClick={() => setActiveTab('downloaded')}
                    style={{ 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        color: activeTab === 'downloaded' ? '#fff' : '#888',
                        position: 'relative'
                    }}
                >
                    Downloaded
                    {activeTab === 'downloaded' && (
                        <div style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%', height: '3px', background: '#e50914', borderRadius: '2px' }} />
                    )}
                </div>
            </div>

            {activeTab === 'downloading' && (
                <div>
                    {/* Simulated Downloading Item */}
                    <div style={{ display: 'flex', gap: '1rem', background: '#111', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                        <div style={{ width: '80px', height: '120px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src="https://via.placeholder.com/80x120?text=Avatar" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Avatar: The Way of Water</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                                <span>14.5MB / 1.2GB</span>
                                <span>2.5MB/s</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '15%', height: '100%', background: '#e50914' }}></div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button style={{ background: '#333', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer' }}>Pause</button>
                            </div>
                        </div>
                    </div>
                    
                    <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
                        Note: Native background downloading requires an app wrapper. 
                        Web browser downloads are managed by the browser's download manager.
                    </p>
                </div>
            )}

            {activeTab === 'downloaded' && (
                <div>
                    <div style={{ display: 'flex', gap: '1rem', background: '#111', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                        <div style={{ width: '80px', height: '120px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src="https://via.placeholder.com/80x120?text=Matrix" alt="Matrix" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>The Matrix Resurrections</h3>
                            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>1.8GB • MP4 • 1080p</p>
                            <button style={{ background: '#e50914', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', width: 'fit-content' }}>▶ Play</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
