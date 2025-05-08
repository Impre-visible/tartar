"use client"

import { useState } from "react"
import type { Tartar } from "@/types/tartar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDelete } from "@/hooks/use-delete"
import { toast } from "sonner"
import { OtpVerification } from "@/components/otp-verification"

interface DeleteTartarDialogProps {
    tartar: Tartar | null
    onOpenChange: () => void
    refetch: () => void
}

export function DeleteTartarDialog({ tartar, onOpenChange, refetch }: DeleteTartarDialogProps) {
    const [showOtpDialog, setShowOtpDialog] = useState(false)
    const { execute: deleteTartar, isLoading } = useDelete<Tartar, { id: string }>(`/tartar`)

    const handleConfirmDelete = () => {
        setShowOtpDialog(true)
    }

    const handleOtpSuccess = async () => {
        if (!tartar) return

        toast.promise(
            deleteTartar({
                id: tartar.id,
            }),
            {
                loading: "Suppression du tartare...",
                success: () => {
                    return "Tartare supprimé avec succès !"
                },
                error: (error) => {
                    return "Erreur lors de la suppression du tartare : " + error.message
                },
                finally: () => {
                    if (refetch) {
                        refetch()
                    }
                    setShowOtpDialog(false)
                    onOpenChange()
                },
            },
        )
    }

    const handleOtpError = (error: string) => {
        toast.error(error)
    }

    const handleOtpDialogClose = (open: boolean) => {
        setShowOtpDialog(open)
        if (!open && !isLoading) {
            setShowOtpDialog(false)
            onOpenChange()
        }
    }

    return (
        <>
            <AlertDialog open={!!tartar} onOpenChange={onOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce tartare ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Cela supprimera définitivement le tartare de{" "}
                            <span className="font-medium">{tartar?.restaurant.name}</span> et toutes les données associées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleConfirmDelete()
                            }}
                            disabled={isLoading}
                            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
                        >
                            {isLoading ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <OtpVerification
                isOpen={showOtpDialog}
                onOpenChange={handleOtpDialogClose}
                onSuccess={handleOtpSuccess}
                onError={handleOtpError}
                title="Vérification de sécurité"
                description="Veuillez entrer le code OTP pour confirmer la suppression."
            />
        </>
    )
}
