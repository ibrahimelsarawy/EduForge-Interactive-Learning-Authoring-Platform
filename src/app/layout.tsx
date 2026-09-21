import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
    title: 'EduForge Module Builder',
    description: 'Interactive financial education module builder',
};
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) {
    return <html lang="en"><body>{children}</body></html>;
}

