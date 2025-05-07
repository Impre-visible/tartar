import { useTheme } from '@/components/theme-provider';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router'

export default function RootLayout() {
    const { theme } = useTheme();
    return (
        <>
            <Toaster richColors theme={theme} />
            <section className="flex flex-col items-center justify-start min-h-screen max-h-screen h-screen min-w-screen max-w-screen w-screen bg-background py-4 px-1 md:px-4 gap-4">
                <header className="w-full flex items-center justify-between h-fit bg-background px-2 md:px-8">
                    <div className="size-9"></div>
                    <h1 className="text-3xl font-bold text-foreground">Tartares</h1>
                    <ModeToggle />
                </header>
                <main className="flex flex-col items-center justify-center h-full w-full">
                    <Outlet />
                </main>
            </section>
        </>
    );
}
