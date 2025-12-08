import QuizCard from '@/components/QuizCard';
import { getQuizzes } from '@/lib/data';

export default async function QuizzesPage() {
    const quizzes = await getQuizzes();

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Available Quizzes</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {quizzes.map((quiz) => (
                    <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                    />
                ))}
            </div>
        </div>
    );
}
