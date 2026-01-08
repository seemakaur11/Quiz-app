import Link from 'next/link';
import styles from './QuizCard.module.css';

export default function QuizCard({ quiz }) {
    const { id, title, description, durationMinutes } = quiz;

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <div className={styles.footer}>
                <span className={styles.duration}>⏱ {durationMinutes} mins</span>
                <Link href={`/quizzes/${id}`} className="btn btn-primary">
                    Start Quiz
                </Link>
            </div>
        </div>
    );
}
