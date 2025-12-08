'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    QuizMaster
                </Link>
                <div className={styles.links}>
                    {user ? (
                        <>
                            <span className={styles.welcome}>Hi, {user.username}</span>
                            {user.role === 'ADMIN' && (
                                <Link href="/admin" className={styles.link}>
                                    Dashboard
                                </Link>
                            )}
                            <button onClick={logout} className={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={styles.link}>
                                Login
                            </Link>
                            <Link href="/register" className={`btn btn-primary ${styles.registerBtn}`}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
