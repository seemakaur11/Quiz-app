import { NextResponse } from 'next/server';
import { getQuizById, getQuizzes, createQuiz } from '@/lib/data';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'quizzes.json');

async function writeData(quizzes) {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(quizzes, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error writing quiz data:', error);
    }
}

export async function GET(request, { params }) {
    const quiz = await getQuizById(params.id);

    if (!quiz) {
        return new NextResponse('Quiz not found', { status: 404 });
    }

    return NextResponse.json(quiz);
}

export async function DELETE(request, { params }) {
    try {
        const quizzes = await getQuizzes();
        const newQuizzes = quizzes.filter(q => q.id !== params.id);

        if (quizzes.length === newQuizzes.length) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        await writeData(newQuizzes);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const body = await request.json();
        const quizzes = await getQuizzes();
        const index = quizzes.findIndex(q => q.id === params.id);

        if (index === -1) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        // Update fields
        quizzes[index] = { ...quizzes[index], ...body };
        await writeData(quizzes);

        return NextResponse.json({ success: true, quiz: quizzes[index] });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

