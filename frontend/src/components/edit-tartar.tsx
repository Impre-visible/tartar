import { use, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Slider } from "@/components/ui/slider";
import { PriceInput } from "./ui/price-input";
import { ResponsiveDrawerDialog, ResponsiveDrawerDialogContent } from "./ui/responsive-dialog";
import { Tartar } from "@/types/tartar";
import { usePut } from "@/hooks/use-put";
import { toast } from "sonner";

const tartarSchema = z.object({
    currency: z.string().min(1, "Veuillez sélectionner une devise"),
    price: z.number().min(0, "Le prix doit être positif"),
    texture: z.number().min(0).max(5, "La note doit être entre 0 et 5"),
    taste: z.number().min(0).max(5, "La note doit être entre 0 et 5"),
    presentation: z.number().min(0).max(5, "La note doit être entre 0 et 5"),
    totalScore: z.number().min(0).max(5, "La note doit être entre 0 et 5"),
});

export function EditTartar({ tartar, refetch, onOpenChange }: { tartar: Tartar | null; refetch?: () => void; onOpenChange: () => void }) {
    const [isOpen, setIsOpen] = useState(tartar !== null);


    const {
        execute: updateTartar,
        isLoading: isLoading,
        error: error,
    } = usePut<Tartar, z.infer<typeof tartarSchema>>(`/tartar`);

    const form = useForm({
        resolver: zodResolver(tartarSchema),
        defaultValues: {
            currency: tartar?.currency || "usd",
            price: tartar?.price || 0,
            texture: tartar?.texture_rating || 0,
            taste: tartar?.taste_rating || 0,
            presentation: tartar?.presentation_rating || 0,
            totalScore: tartar?.total_rating || 0,
        },
    });

    useEffect(() => {
        if (tartar) {
            setIsOpen(true);
            form.reset({
                currency: tartar.currency,
                price: tartar.price,
                texture: tartar.texture_rating,
                taste: tartar.taste_rating,
                presentation: tartar.presentation_rating,
                totalScore: tartar.total_rating,
            });
        } else {
            setIsOpen(false);
        }
    }, [tartar]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
            onOpenChange();
        }
    };

    const handleAverageNote = () => {
        const texture = form.getValues("texture");
        const taste = form.getValues("taste");
        const presentation = form.getValues("presentation");
        const totalScore = (texture + taste + presentation) / 3;
        form.setValue("totalScore", totalScore);
    };

    const onSubmit = async (data: z.infer<typeof tartarSchema>) => {
        toast.promise(
            updateTartar(data),
            {
                loading: "Mise à jour en cours...",
                success: () => {
                    toast.success("Tartare mis à jour avec succès");
                    return "Tartare mis à jour avec succès";
                },
                error: (error) => {
                    toast.error("Erreur lors de la mise à jour du tartare");
                    return error.message;
                },
                finally: () => {
                    if (refetch) {
                        refetch();
                    }
                    setIsOpen(false);
                    form.reset();
                    onOpenChange();
                }
            }
        );
    };

    return (
        <ResponsiveDrawerDialog onOpenChange={handleOpenChange} open={isOpen} title="Modifier le tartare">
            <ResponsiveDrawerDialogContent>
                <section className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-bold">Modifier le tartare</h2>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Modifiez les informations ci-dessous pour mettre à jour le tartare.
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 md:gap-4 w-full mt-6">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prix</FormLabel>
                                        <FormControl>
                                            <PriceInput
                                                onAmountChange={field.onChange}
                                                onCurrencyChange={(value) => {
                                                    form.setValue("currency", value);
                                                }}
                                                initialAmount={field.value}
                                                initialCurrency={form.getValues("currency")}
                                                searchCurrencyEmptyText="Aucune devise trouvée"
                                                searchCurrencyText="Rechercher une devise..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="texture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note pour la texture</FormLabel>
                                        <FormControl>
                                            <section className="flex items-center gap-4">
                                                <Slider
                                                    min={0}
                                                    max={5}
                                                    step={0.25}
                                                    value={[field.value]}
                                                    onValueChange={(value) => {
                                                        field.onChange(value[0]);
                                                        handleAverageNote();
                                                    }}
                                                />
                                                <span>
                                                    {field.value.toFixed(2)}/5
                                                </span>
                                            </section>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="taste"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note pour le goût</FormLabel>
                                        <FormControl>
                                            <section className="flex items-center gap-4">
                                                <Slider
                                                    min={0}
                                                    max={5}
                                                    step={0.25}
                                                    value={[field.value]}
                                                    onValueChange={(value) => {
                                                        field.onChange(value[0]);
                                                        handleAverageNote();
                                                    }}
                                                />
                                                <span>
                                                    {field.value.toFixed(2)}/5
                                                </span>
                                            </section>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="presentation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note pour la présentation</FormLabel>
                                        <FormControl>
                                            <section className="flex items-center gap-4">
                                                <Slider
                                                    min={0}
                                                    max={5}
                                                    step={0.25}
                                                    value={[field.value]}
                                                    onValueChange={(value) => {
                                                        field.onChange(value[0]);
                                                        handleAverageNote();
                                                    }}
                                                />
                                                <span>
                                                    {field.value.toFixed(2)}/5
                                                </span>
                                            </section>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="totalScore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note totale</FormLabel>
                                        <FormControl>
                                            <section className="flex items-center gap-4">
                                                <Slider
                                                    min={0}
                                                    max={5}
                                                    step={0.25}
                                                    value={[field.value]}
                                                    disabled
                                                />
                                                <span>
                                                    {field.value.toFixed(2)}/5
                                                </span>
                                            </section>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full md:w-auto md:float-right">Mettre à jour</Button>
                        </form>
                    </Form>
                </section>
            </ResponsiveDrawerDialogContent>
        </ResponsiveDrawerDialog>
    );
}

export default EditTartar;
