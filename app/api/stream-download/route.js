const CDN_HEADERS = {
    "Referer": "https://videodownloader.site/",
    "Origin": "https://videodownloader.site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
};

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const filename = searchParams.get('filename') || 'video.mp4';
    if (!url) return new Response('url is required', { status: 400 });

    try {
        const cdnRes = await fetch(url, { 
            headers: CDN_HEADERS,
            redirect: 'follow',
            cache: 'no-store'
        });
        
        const resHeaders = new Headers();
        resHeaders.set('Content-Type', 'application/octet-stream');
        resHeaders.set('Content-Disposition', `attachment; filename="${filename}"`);
        resHeaders.set('Cache-Control', 'no-store');

        if (cdnRes.headers.get('content-length')) resHeaders.set('Content-Length', cdnRes.headers.get('content-length'));

        return new Response(cdnRes.body, {
            status: cdnRes.status,
            headers: resHeaders
        });
    } catch (e) {
        return new Response(`Download error: ${e.message}`, { status: 500 });
    }
}

