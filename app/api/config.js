// Shared API config - mirrors the Python backend exactly
const API_BASE = "https://h5-api.aoneroom.com/wefeed-h5api-bff";

const JWT_TOKEN = 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
    ".eyJ1aWQiOjg0MzIyMDE2NDQ3ODgxNDE0ODgsImF0cCI6MywiZXh0IjoiMTc4MjY3MDAyNCIsImV4cCI6MTc5MDQ0NjAyNCwiaWF0IjoxNzgyNjY5NzI0fQ" +
    ".ZLwbnbpFhhM217P_LG-L_hvaTV-AQagTYBvpVr03UJI";

export function getHeaders(lang = "en") {
    return {
        "authorization": `Bearer ${JWT_TOKEN}`,
        "content-type": "application/json",
        "accept": "application/json",
        "origin": "https://videodownloader.site",
        "referer": "https://videodownloader.site/",
        "x-client-info": JSON.stringify({ timezone: "Africa/Kampala" }),
        "x-request-lang": lang,
        "x-source": "downloader",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    };
}

export { API_BASE };
