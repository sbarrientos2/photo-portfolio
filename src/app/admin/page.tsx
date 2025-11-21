import { getData } from '@/lib/data';
import AdminDashboard from '@/components/AdminDashboard';
import Link from 'next/link';

export const metadata = {
    title: 'Admin | Sebastian Barrientos',
};

export default async function AdminPage() {
    const data = await getData();

    return (
        <main className="min-h-screen bg-white text-black p-8">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Portfolio Admin</h1>
                <Link href="/" className="text-sm underline hover:text-gray-600">
                    Back to Site
                </Link>
            </header>

            <AdminDashboard initialData={data} />
        </main>
    );
}
