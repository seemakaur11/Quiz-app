import QuizTaker from '@/components/QuizTaker';
import { getQuizById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function QuizPage({ params }) {
    const quiz = await getQuizById(params.id);

    if (!quiz) {
        notFound();
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{quiz.title}</h1>
                <p style={{ color: '#94a3b8' }}>{quiz.description}</p>
            </header>

            <QuizTaker quiz={quiz} />
        </div>
    );
}
