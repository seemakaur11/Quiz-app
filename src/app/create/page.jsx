'use client';

import { useState, useEffect } from 'react';
import styles from './create.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CreateQuizPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);

    // Protect Route - Admin only
    useEffect(() => {
        if (!loading && (!user || user.role !== 'ADMIN')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'ADMIN') {
        return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;
    }

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        if (field === 'text') {
            newQuestions[index].text = value;
        }
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = oIndex;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { text: '', options: ['', '', '', ''], correctAnswer: 0 }
        ]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    questions
                }),
            });

            if (res.ok) {
                router.push('/');
                router.refresh(); // Refresh server components
            } else {
                alert('Failed to create quiz');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Create a New Quiz</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.section}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Quiz Title</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Advanced CSS"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this quiz about?"
                            required
                        />
                    </div>
                </div>

                <div className={styles.questionsList}>
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className={styles.questionCard}>
                            <div className={styles.questionHeader}>
                                <h3>Question {qIndex + 1}</h3>
                                {questions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className={styles.deleteBtn}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={q.text}
                                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                    placeholder="Enter question text"
                                    required
                                />
                            </div>

                            <div className={styles.optionsGrid}>
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className={styles.optionRow}>
                                        <input
                                            type="radio"
                                            name={`correct-${qIndex}`}
                                            checked={q.correctAnswer === oIndex}
                                            onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                            className={styles.radio}
                                        />
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button type="button" onClick={addQuestion} className="btn btn-secondary">
                        + Add Question
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Create Quiz
                    </button>
                </div>
            </form>
        </div>
    );
}
