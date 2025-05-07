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
import { toast } from "sonner"

interface DeleteTartarDialogProps {
    tartar: Tartar | null
    onOpenChange: () => void
    refetch: () => void
}

export function DeleteTartarDialog({ tartar, onOpenChange, refetch }: DeleteTartarDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (!tartar) return

        setIsLoading(true)
        try {
            const response = await fetch(`/api/tartar/${tartar.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete tartar")
            }

            toast.success("Tartar supprimé", {
                description: "Le tartar a été supprimé avec succès.",
            })
            refetch()
        } catch (error) {
            toast.error("Erreur", {
                description: "Une erreur est survenue lors de la suppression du tartar.",
            })
        } finally {
            setIsLoading(false)
            // Don't call onOpenChange() here, let the AlertDialog handle it
        }
    }

    return (
        <AlertDialog open={!!tartar} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce tartar ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Cela supprimera définitivement le tartar de{" "}
                        <span className="font-medium">{tartar?.restaurant.name}</span> et toutes les données associées.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? "Suppression..." : "Supprimer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
