'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/create/create.module.css'; // Reuse create styles
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function EditQuizPage({ params }) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'ADMIN') {
                router.push('/login');
            } else {
                fetchQuiz();
            }
        }
    }, [user, loading, params.id]);

    const fetchQuiz = async () => {
        try {
            const res = await fetch(`/api/quizzes/${params.id}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setTitle(data.title);
            setDescription(data.description);
            setQuestions(data.questions);
        } catch (error) {
            alert('Error loading quiz');
            router.push('/admin');
        } finally {
            setIsLoadingData(false);
        }
    };

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
            const res = await fetch(`/api/quizzes/${params.id}`, {
                method: 'PUT',
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
                router.push('/admin');
                router.refresh();
            } else {
                alert('Failed to update quiz');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    if (loading || isLoadingData) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Edit Quiz</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.section}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Quiz Title</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                        Update Quiz
                    </button>
                </div>
            </form>
        </div>
    );
}
