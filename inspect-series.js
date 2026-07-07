// Find seasons structure in the API
const API_BASE = "https://h5-api.aoneroom.com/wefeed-h5api-bff";
const JWT_TOKEN = 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
    ".eyJ1aWQiOjg0MzIyMDE2NDQ3ODgxNDE0ODgsImF0cCI6MywiZXh0IjoiMTc4MjY3MDAyNCIsImV4cCI6MTc5MDQ0NjAyNCwiaWF0IjoxNzgyNjY5NzI0fQ" +
    ".ZLwbnbpFhhM217P_LG-L_hvaTV-AQagTYBvpVr03UJI";

function getHeaders() {
    return {
        "authorization": `Bearer ${JWT_TOKEN}`,
        "content-type": "application/json",
        "accept": "application/json",
        "origin": "https://videodownloader.site",
        "referer": "https://videodownloader.site/",
        "x-client-info": JSON.stringify({ timezone: "Africa/Kampala" }),
        "x-request-lang": "en",
        "x-source": "downloader",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    };
}

async function run() {
    const subjectId = "6207982430134357800"; // Breaking Bad
    const detailPath = "breaking-bad-ej6Bp0MCAo7";
    
    // Try various se/ep combos to detect season/ep count
    for (let se = 1; se <= 6; se++) {
        const res = await fetch(`${API_BASE}/subject/download?subjectId=${subjectId}&se=${se}&ep=1&detailPath=${encodeURIComponent(detailPath)}`, {
            headers: getHeaders()
        });
        const data = await res.json();
        const hasResource = data.data?.hasResource;
        const dlCount = data.data?.downloads?.length || 0;
        console.log(`se=${se}, ep=1: hasResource=${hasResource}, downloads=${dlCount}`);
        if (!hasResource) break;
    }
    
    // Check ep count for season 1
    console.log('\n--- checking episode count for S1 ---');
    for (let ep = 1; ep <= 65; ep += 5) {
        const res = await fetch(`${API_BASE}/subject/download?subjectId=${subjectId}&se=1&ep=${ep}&detailPath=${encodeURIComponent(detailPath)}`, {
            headers: getHeaders()
        });
        const data = await res.json();
        const hasResource = data.data?.hasResource;
        const dlCount = data.data?.downloads?.length || 0;
        console.log(`se=1, ep=${ep}: hasResource=${hasResource}, downloads=${dlCount}`);
    }
    
    // Check full detail for accessStrategy
    const detailRes = await fetch(`${API_BASE}/detail?detailPath=${encodeURIComponent(detailPath)}`, {
        headers: getHeaders()
    });
    const detailData = await detailRes.json();
    const m = detailData.data?.subject || detailData.data;
    console.log('\naccessStrategy:', JSON.stringify(m?.accessStrategy, null, 2));
    console.log('\nseason field:', m?.season);
}
run();
