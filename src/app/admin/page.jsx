'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [userCount, setUserCount] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'ADMIN') {
                router.push('/login');
            } else {
                fetchQuizzes();
                fetchUsers();
            }
        }
    }, [user, loading, router]);

    const fetchQuizzes = async () => {
        const res = await fetch('/api/quizzes');
        const data = await res.json();
        setQuizzes(data);
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setAllUsers(data);
                setUserCount(data.length);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
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

            {/* Stats Components */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}>Total Quizzes</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6' }}>{quizzes.length}</span>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}>Total Users</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#6366f1' }}>{userCount}</span>
                </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Manage Quizzes</h2>
            <div className="glass-panel" style={{ marginBottom: '4rem' }}>
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

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Registered Users</h2>
            <div className="glass-panel">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Username</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{u.username}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.875rem',
                                        backgroundColor: u.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                                        color: u.role === 'ADMIN' ? '#c4b5fd' : '#cbd5e1'
                                    }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem', color: '#94a3b8' }}>
                                    {u.id}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
