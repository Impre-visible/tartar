import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ResponsiveDrawerDialog, ResponsiveDrawerDialogContent, ResponsiveDrawerDialogTrigger } from "./ui/responsive-dialog";

function AddTartar() {
    return (
        <ResponsiveDrawerDialog>
            <ResponsiveDrawerDialogTrigger>
                <section className="fixed bottom-6 right-6">
                    <Button variant="default" className="w-12 h-12 rounded-full">
                        <PlusIcon className="!h-6 !w-6" />
                    </Button>
                </section>
            </ResponsiveDrawerDialogTrigger>
            <ResponsiveDrawerDialogContent>
                <section className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-bold">Ajouter un tartare</h2>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Créez votre propre tartare en ajoutant vos ingrédients préférés.
                    </p>
                </section>
            </ResponsiveDrawerDialogContent>
        </ResponsiveDrawerDialog>
    );
}
export default AddTartar;