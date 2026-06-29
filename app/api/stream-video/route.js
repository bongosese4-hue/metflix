export const runtime = 'edge';

const CDN_HEADERS = {
    "Referer": "https://videodownloader.site/",
    "Origin": "https://videodownloader.site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
};

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    if (!url) return new Response('url is required', { status: 400 });

    const headers = { ...CDN_HEADERS };
    const range = request.headers.get('range');
    if (range) headers['Range'] = range;

    try {
        const cdnRes = await fetch(url, { 
            headers, 
            redirect: 'follow',
            cache: 'no-store'
        });
        
        const resHeaders = new Headers();
        resHeaders.set('Content-Type', cdnRes.headers.get('content-type') || 'video/mp4');
        resHeaders.set('Accept-Ranges', 'bytes');
        resHeaders.set('Access-Control-Allow-Origin', '*');
        resHeaders.set('Cache-Control', 'no-store');

        if (cdnRes.headers.get('content-length')) resHeaders.set('Content-Length', cdnRes.headers.get('content-length'));
        if (cdnRes.headers.get('content-range')) resHeaders.set('Content-Range', cdnRes.headers.get('content-range'));

        return new Response(cdnRes.body, {
            status: cdnRes.status,
            headers: resHeaders
        });
    } catch (e) {
        return new Response(`Stream error: ${e.message}`, { status: 500 });
    }
}

