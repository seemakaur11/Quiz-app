'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'ADMIN') {
                router.push('/login');
            } else {
                fetchQuizzes();
            }
        }
    }, [user, loading, router]);

    const fetchQuizzes = async () => {
        const res = await fetch('/api/quizzes');
        const data = await res.json();
        setQuizzes(data);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this quiz?')) {
            const res = await fetch(`/api/quizzes/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setQuizzes(quizzes.filter(q => q.id !== id));
            } else {
                alert('Failed to delete quiz');
            }
        }
    };

    if (loading || !user || user.role !== 'ADMIN') {
        return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
                <Link href="/create" className="btn btn-primary">
                    + Create New Quiz
                </Link>
            </div>

            <div className="glass-panel">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Questions</th>
                            <th style={{ padding: '1rem' }}>Duration</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map(quiz => (
                            <tr key={quiz.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{quiz.title}</td>
                                <td style={{ padding: '1rem' }}>{quiz.questionCount}</td>
                                <td style={{ padding: '1rem' }}>{quiz.durationMinutes}m</td>
                                <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <Link
                                        href={`/admin/edit/${quiz.id}`}
                                        className="btn btn-secondary"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(quiz.id)}
                                        className="btn btn-secondary"
                                        style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
