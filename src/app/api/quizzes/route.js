import { NextResponse } from 'next/server';
import { getQuizzes, createQuiz } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const quizzes = await getQuizzes();
    // Return only the list of quizzes without questions to save bandwidth/hide answers
    const quizList = quizzes.map(({ id, title, description, durationMinutes, questions }) => ({
        id,
        title,
        description,
        durationMinutes,
        questionCount: questions ? questions.length : 0
    }));

    return NextResponse.json(quizList);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { title, description, questions } = body;

        if (!title || !description || !questions || !Array.isArray(questions)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const newQuiz = {
            id: uuidv4(),
            title,
            description,
            questions: questions.map((q, index) => ({
                id: `q${index + 1}`,
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer
            })),
            durationMinutes: 10 // Default duration
        };

        await createQuiz(newQuiz);

        return NextResponse.json({ success: true, quiz: newQuiz }, { status: 201 });
    } catch (error) {
        console.error('Error creating quiz:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
