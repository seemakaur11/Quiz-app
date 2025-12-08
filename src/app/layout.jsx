import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar"; // We'll create this next

export const metadata = {
    title: "QuizMaster - Premium Online Quizzes",
    description: "Test your knowledge with our premium online quiz platform.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <AuthProvider>
                    <main className="min-h-screen">
                        <Navbar />
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}

