'use client';

import QuizTaker from '@/components/QuizTaker';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function QuizPage({ params }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [quiz, setQuiz] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                console.log('Fetching quiz with ID:', params.id);
                const res = await fetch(`/api/quizzes/${params.id}`);
                console.log('Response status:', res.status);
                
                if (!res.ok) {
                    setError(`Quiz not found (${res.status})`);
                } else {
                    const quizData = await res.json();
                    console.log('Quiz data received:', quizData);
                    setQuiz(quizData);
                }
            } catch (err) {
                console.error('Error fetching quiz:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuiz();
    }, [params.id]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || isLoading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>{error}</p>
                <Link href="/" className="btn btn-primary">
                    Back to Home
                </Link>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Quiz Not Found</h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>The quiz you're looking for doesn't exist.</p>
                <Link href="/" className="btn btn-primary">
                    Back to Home
                </Link>
            </div>
        );
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
