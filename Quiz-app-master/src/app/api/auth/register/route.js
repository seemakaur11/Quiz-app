import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        try {
            const user = await registerUser(username, password);

            // Set cookie immediately after register
            cookies().set('user_session', JSON.stringify(user), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ success: true, user }, { status: 201 });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
