// Route: /api/detail
import { NextResponse } from 'next/server';
import { API_BASE, getHeaders } from '../config';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const detailPath = searchParams.get('detailPath');
    if (!detailPath) return NextResponse.json({ error: 'detailPath is required' }, { status: 400 });

    try {
        const res = await fetch(`${API_BASE}/detail?detailPath=${encodeURIComponent(detailPath)}`, {
            headers: getHeaders()
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
