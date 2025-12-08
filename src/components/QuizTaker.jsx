'use client';

import { useState, useEffect } from 'react';
import styles from './QuizTaker.module.css';
import Link from 'next/link';

export default function QuizTaker({ quiz }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);

    // Timer Logic
    useEffect(() => {
        if (isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    const handleOptionSelect = (optionIndex) => {
        if (isSubmitted) return;
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion.id]: optionIndex
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        let calculatedScore = 0;
        quiz.questions.forEach(q => {
            if (selectedAnswers[q.id] === q.correctAnswer) {
                calculatedScore++;
            }
        });
        setScore(calculatedScore);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        const percentage = Math.round((score / quiz.questions.length) * 100);
        return (
            <div className={styles.resultContainer}>
                <h2 className={styles.resultTitle}>Quiz Completed!</h2>
                <div className={styles.scoreCircle}>
                    <span className={styles.scoreNumber}>{percentage}%</span>
                    <span className={styles.scoreTotal}>{score} / {quiz.questions.length} Correct</span>
                </div>
                <p className={styles.resultMessage}>
                    {percentage === 100 ? 'Perfect Score! 🎉' :
                        percentage >= 70 ? 'Great Job! 👍' : 'Keep Practicing! 💪'}
                </p>
                <div className={styles.actionButtons}>
                    <button
                        onClick={() => {
                            setIsSubmitted(false);
                            setSelectedAnswers({});
                            setCurrentQuestionIndex(0);
                            setScore(0);
                            setTimeLeft(quiz.durationMinutes * 60);
                        }}
                        className="btn btn-secondary"
                    >
                        Retake Quiz
                    </button>
                    <Link href="/" className="btn btn-primary">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
                    <span className={styles.progress}>
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </span>
                    <span style={{ fontWeight: 'bold', color: timeLeft < 60 ? '#ef4444' : 'inherit' }}>
                        ⏱ {formatTime(timeLeft)}
                    </span>
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className={styles.questionCard}>
                <h2 className={styles.questionText}>{currentQuestion.text}</h2>

                <div className={styles.optionsGrid}>
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`${styles.optionButton} ${selectedAnswers[currentQuestion.id] === index ? styles.selected : ''
                                }`}
                            onClick={() => handleOptionSelect(index)}
                        >
                            <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.footer}>
                <button
                    className="btn btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </button>

                {isLastQuestion ? (
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={handleNext}
                    >
                        Next Question
                    </button>
                )}
            </div>
        </div>
    );
}
