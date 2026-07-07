// Route: /api/download
import { NextResponse } from 'next/server';
import { API_BASE, getHeaders } from '../config';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const se = parseInt(searchParams.get('se') || '0');
    const ep = parseInt(searchParams.get('ep') || '0');
    const detailPath = searchParams.get('detailPath') || '';

    if (!subjectId) return NextResponse.json({ error: 'subjectId is required' }, { status: 400 });

    try {
        const res = await fetch(`${API_BASE}/subject/download?subjectId=${subjectId}&se=${se}&ep=${ep}&detailPath=${encodeURIComponent(detailPath)}`, {
            headers: getHeaders()
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
