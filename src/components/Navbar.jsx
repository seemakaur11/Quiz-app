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
                    <span className={styles.logoIcon} aria-hidden="true"> 
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L3 7v6c0 5 3.8 9.74 9 11 5.2-1.26 9-6 9-11V7l-9-5z" fill="currentColor"/>
                            <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" fill="white" opacity="0.9"/>
                        </svg>
                    </span>
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
