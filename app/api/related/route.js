// Route: /api/related
import { NextResponse } from 'next/server';
import { API_BASE, getHeaders } from '../config';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre') || '';
    const excludeId = searchParams.get('exclude_id') || '';

    try {
        const keyword = genre.split(',')[0].trim();
        const res = await fetch(`${API_BASE}/subject/search`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ keyword, page: 1, perPage: 12, subjectType: 0 })
        });
        const data = await res.json();
        if (data.data?.items && excludeId) {
            data.data.items = data.data.items.filter(i => String(i.subjectId) !== String(excludeId)).slice(0, 8);
        }
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
