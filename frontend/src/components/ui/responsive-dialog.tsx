"use client"

import * as React from "react"

import useMediaQuery from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

type ResponsiveDrawerDialogContextType = {
    open: boolean
    onOpenChange: (open: boolean) => void
    isDesktop: boolean
    title?: string
}

const ResponsiveDrawerDialogContext = React.createContext<ResponsiveDrawerDialogContextType | undefined>(undefined)

function useResponsiveDrawerDialog() {
    const context = React.useContext(ResponsiveDrawerDialogContext)
    if (!context) {
        throw new Error(
            "Les composants ResponsiveDrawerDialog doivent être utilisés à l'intérieur d'un <ResponsiveDrawerDialog />",
        )
    }
    return context
}

export function ResponsiveDrawerDialog({
    children,
    title,
    open = false,
    onOpenChange,
}: Readonly<{
    children: React.ReactNode
    title?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
}>) {
    const [_open, setOpen] = React.useState(open)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const handleOpenChange = React.useCallback(
        (value: boolean) => {
            setOpen(value)
            onOpenChange?.(value)
        },
        [onOpenChange],
    )

    React.useEffect(() => {
        if (open !== _open) {
            setOpen(open)
        }
    }, [open, _open])

    const contextValue = React.useMemo(
        () => ({
            title,
            open,
            onOpenChange: handleOpenChange,
            isDesktop,
        }),
        [open, handleOpenChange, isDesktop, title],
    )

    return (
        <ResponsiveDrawerDialogContext.Provider value={contextValue}>
            {isDesktop ? (
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <section className="hidden">
                        <DialogTitle>{title}</DialogTitle>
                    </section>
                    {children}
                </Dialog>
            ) : (
                <Drawer open={open} onOpenChange={handleOpenChange}>
                    {children}
                </Drawer>
            )}
        </ResponsiveDrawerDialogContext.Provider>
    )
}

export function ResponsiveDrawerDialogTrigger({
    children,
    asChild = false,
    ...props
}: React.ComponentPropsWithoutRef<typeof Button> & {
    asChild?: boolean
}) {
    const { isDesktop } = useResponsiveDrawerDialog()

    if (isDesktop) {
        return (
            <DialogTrigger asChild {...props}>
                {children}
            </DialogTrigger>
        )
    }

    return (
        <DrawerTrigger asChild {...props}>
            {children}
        </DrawerTrigger>
    )
}

export function ResponsiveDrawerDialogContent({
    children,
    title,
    description,
    asChild = false,
    className = "",
    ...props
}: React.ComponentPropsWithoutRef<"div"> & {
    title?: string
    description?: string
    asChild?: boolean
}) {
    const { isDesktop, onOpenChange } = useResponsiveDrawerDialog()

    const handleClose = () => {
        onOpenChange(false)
    }

    const content = asChild ? (
        children
    ) : (
        <>
            <div className={isDesktop ? "" : "px-4 py-2"}>{children}</div>
        </>
    )

    if (isDesktop) {
        return (
            <DialogContent className={`sm:max-w-[800px] ${className}`} {...props}>
                {content}
            </DialogContent>
        )
    }

    return (
        <>
            <DrawerContent className={className} {...props}>
                {content}
                <DrawerFooter className="pt-2">
                    <Button variant="outline" onClick={handleClose}>
                        Retour
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </>
    )
}

export function ResponsiveDrawerDialogFooter({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { isDesktop } = useResponsiveDrawerDialog()

    if (isDesktop) {
        return null
    }

    return <DrawerFooter className="pt-2">{children}</DrawerFooter>
}
