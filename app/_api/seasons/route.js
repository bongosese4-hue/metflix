// Route: /api/seasons
import { NextResponse } from 'next/server';
import { API_BASE, getHeaders } from '../config';

// Discovers how many seasons & episodes a series has
// by probing the download endpoint with hasResource flag
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const detailPath = searchParams.get('detailPath') || '';

    if (!subjectId) return NextResponse.json({ error: 'subjectId required' }, { status: 400 });

    try {
        const seasons = [];

        // Probe up to 20 seasons
        for (let se = 1; se <= 20; se++) {
            const res = await fetch(
                `${API_BASE}/subject/download?subjectId=${subjectId}&se=${se}&ep=1&detailPath=${encodeURIComponent(detailPath)}`,
                { headers: getHeaders() }
            );
            const data = await res.json();
            if (!data.data?.hasResource) break;

            // Found a valid season — now probe episode count (binary-ish scan)
            let maxEp = 1;
            // Check in steps of 5 to find rough upper bound
            let upperBound = 1;
            for (let ep = 5; ep <= 100; ep += 5) {
                const epRes = await fetch(
                    `${API_BASE}/subject/download?subjectId=${subjectId}&se=${se}&ep=${ep}&detailPath=${encodeURIComponent(detailPath)}`,
                    { headers: getHeaders() }
                );
                const epData = await epRes.json();
                if (!epData.data?.hasResource) { upperBound = ep; break; }
                maxEp = ep;
                if (ep >= 100) { upperBound = 105; break; }
            }
            // Fine-scan from (upperBound - 5) to upperBound
            for (let ep = Math.max(1, upperBound - 5); ep < upperBound; ep++) {
                const epRes = await fetch(
                    `${API_BASE}/subject/download?subjectId=${subjectId}&se=${se}&ep=${ep}&detailPath=${encodeURIComponent(detailPath)}`,
                    { headers: getHeaders() }
                );
                const epData = await epRes.json();
                if (!epData.data?.hasResource) break;
                maxEp = ep;
            }

            seasons.push({ se, maxEp });
        }

        return NextResponse.json({ seasons });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
