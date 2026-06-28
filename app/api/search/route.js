import { NextResponse } from 'next/server';
import { API_BASE, getHeaders } from '../config';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('per_page') || 15;

    if (!q) return NextResponse.json({ error: 'Query q is required' }, { status: 400 });

    try {
        const res = await fetch(`${API_BASE}/subject/search`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ keyword: q, page: parseInt(page), perPage: parseInt(perPage), subjectType: 0 })
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
