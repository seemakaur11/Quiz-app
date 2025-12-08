'use client';

import QuizTaker from '@/components/QuizTaker';
import { notFound } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QuizPage({ params }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [quiz, setQuiz] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`/api/quizzes/${params.id}`);
                if (!res.ok) {
                    setError(true);
                } else {
                    const quizData = await res.json();
                    setQuiz(quizData);
                }
            } catch (err) {
                setError(true);
            }
        };

        fetchQuiz();
    }, [params.id]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (error || !quiz) {
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
