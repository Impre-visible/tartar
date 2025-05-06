import { ModeToggle } from '@/components/ui/mode-toggle';
import { Outlet } from 'react-router'

export default function RootLayout() {
    return (
        <section className="flex flex-col items-center justify-start min-h-screen max-h-screen h-screen min-w-screen max-w-screen w-screen bg-background p-4 gap-4">
            <header className="w-full flex items-center justify-between h-fit bg-background px-2 md:px-8">
                <div></div>
                <h1 className="text-3xl font-bold text-foreground">Tartares</h1>
                <ModeToggle />
            </header>
            <main className="flex flex-col items-center justify-center h-full w-full">
                <Outlet />
            </main>
        </section>
    );
}
