import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
            <div style={{ padding: '2rem' }}>
                <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem', background: 'linear-gradient(to right, #e50914, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    404
                </h1>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Lost in Space?</h2>
                <p style={{ color: '#aaa', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
                    The movie or page you are looking for has been abducted by aliens, or simply doesn't exist anymore.
                </p>
                <Link href="/" className="primary-btn" style={{ padding: '0.85rem 2rem', fontSize: '1.1rem' }}>
                    Return to Base
                </Link>
            </div>
        </main>
    );
}
