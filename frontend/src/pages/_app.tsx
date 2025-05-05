import { Outlet } from 'react-router'

export default function RootLayout() {
    return (
        <section className="flex flex-col items-center justify-start min-h-screen max-h-screen h-screen min-w-screen max-w-screen w-screen bg-background">
            <header className="flex items-center justify-center h-20 bg-background">
                <h1 className="text-3xl font-bold text-foreground">Tartares</h1>
            </header>
            <main className="flex flex-col items-center justify-center h-full w-full">
                <Outlet />
            </main>
        </section>
    );
}
