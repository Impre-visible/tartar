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

interface DeleteTartarDialogProps {
    tartar: Tartar | null
    onOpenChange: () => void
    refetch: () => void
}

export function DeleteTartarDialog({ tartar, onOpenChange, refetch }: DeleteTartarDialogProps) {
    const {
        execute: deleteTartar,
        isLoading,
    } = useDelete<Tartar, { id: string }>(`/tartar`);

    const handleDelete = async () => {
        if (!tartar) return;

        toast.promise(
            deleteTartar({
                id: tartar.id,
            }),
            {
                loading: "Suppression du tartare...",
                success: () => {
                    return "Tartare supprimé avec succès !";
                },
                error: (error) => {
                    return "Erreur lors de la suppression du tartare : " + error.message;
                },
                finally: () => {
                    if (refetch) {
                        refetch();
                    }
                    onOpenChange();
                }
            }
        );
    };

    return (
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
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isLoading}
                        className="bg-destructive hover:bg-destructive/90 cursor-pointer"
                    >
                        {isLoading ? "Suppression..." : "Supprimer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
