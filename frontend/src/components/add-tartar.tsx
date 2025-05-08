"use client"

import { PlusIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Slider } from "@/components/ui/slider"
import { SearchInput } from "./ui/search-input"
import {
    ResponsiveDrawerDialog,
    ResponsiveDrawerDialogContent,
    ResponsiveDrawerDialogTrigger,
} from "./ui/responsive-dialog"
import type { GooglePlaceResult } from "@/types"
import { useCallback, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

import { PriceInput } from "./ui/price-input"
import { DatePicker } from "./ui/date-picker"
import { fr } from "date-fns/locale"

import { usePost } from "@/hooks/use-post"
import type { Tartar } from "@/types/tartar"
import { toast } from "sonner"
import { OtpVerification } from "@/components/otp-verification"
import { env } from "@/environment"

const tartarSchema = z.object({
    restaurant: z.string().min(1, "Veuillez sélectionner un restaurant"),
    createdAt: z.date().min(new Date(0), "Veuillez sélectionner une date"),
    currency: z.string().min(1, "Veuillez sélectionner une devise"),
    price: z.number().min(0, "Le prix doit être positif"),
    texture: z.number().min(0).max(10, "La note doit être entre 0 et 10"),
    taste: z.number().min(0).max(10, "La note doit être entre 0 et 10"),
    presentation: z.number().min(0).max(10, "La note doit être entre 0 et 10"),
    totalScore: z.number().min(0).max(10, "La note doit être entre 0 et 10"),
})

function AddTartar({ refetch }: { refetch?: () => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const [results, setResults] = useState<GooglePlaceResult[]>([])
    const [showOtpDialog, setShowOtpDialog] = useState(false)
    const [formData, setFormData] = useState<z.infer<typeof tartarSchema> | null>(null)

    const { execute: createTartar } = usePost<Tartar, z.infer<typeof tartarSchema>>("/tartar")

    const form = useForm({
        resolver: zodResolver(tartarSchema),
        defaultValues: {
            restaurant: "",
            createdAt: new Date(),
            currency: "eur",
            price: 0,
            texture: 5,
            taste: 5,
            presentation: 5,
            totalScore: 5,
        },
    })

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setResults([])
            form.reset()
            return
        }
    }

    const municipality = (formatted_address: string) => {
        const parts = formatted_address.split(", ")
        if (parts.length > 1) {
            return parts[parts.length - 2]
        }
        return formatted_address
    }

    const submitTartar = async (data: z.infer<typeof tartarSchema>) => {
        toast.promise(createTartar(data), {
            loading: "Création du tartare...",
            success: () => {
                return "Tartare créé avec succès!"
            },
            error: (error) => {
                return "Erreur lors de la création du tartare: " + error
            },
            finally: () => {
                if (refetch) {
                    refetch()
                }
                setIsOpen(false)
                setResults([])
                form.reset()
            },
        })
    }

    const onSubmit = async (data: z.infer<typeof tartarSchema>) => {
        setFormData(data)
        setShowOtpDialog(true)
    }

    const handleAverageNote = () => {
        const texture = form.getValues("texture") || 0
        const taste = form.getValues("taste") || 0
        const presentation = form.getValues("presentation") || 0
        const totalScore = (texture + taste + presentation) / 3
        form.setValue("totalScore", totalScore)
    }

    const handlePriceChange = useCallback(
        (value: number) => {
            form.setValue("price", value)
        },
        [form],
    )

    const handleOtpSuccess = () => {
        if (formData) {
            submitTartar(formData)
        }
        setShowOtpDialog(false)
    }

    const handleOtpError = (error: string) => {
        toast.error(error)
    }

    const handleSearch = async (query: string) => {
        if (!query) {
            setResults([])
            return
        }

        try {
            const apiUrl = env.VITE_API_URL || ""
            const data = await fetch(`${apiUrl}/api/restaurant/search?query=${query}`)
            const json = await data.json()
            const places = Array.isArray(json) ? (json as GooglePlaceResult[]) : []
            setResults(places)
        } catch (error) {
            console.error("Erreur lors de la recherche:", error)
            setResults([])
        }
    }

    return (
        <>
            <ResponsiveDrawerDialog onOpenChange={handleOpenChange} open={isOpen} title="Ajouter un tartare">
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
                            Remplissez le formulaire ci-dessous pour ajouter un tartare à votre liste.
                        </p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 md:gap-4 w-full mt-6">
                                <FormField
                                    control={form.control}
                                    name="restaurant"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rechercher un restaurant</FormLabel>
                                            <FormControl>
                                                <SearchInput
                                                    {...field}
                                                    placeholder="Nom du restaurant..."
                                                    onSearch={handleSearch}
                                                    results={results.map((place) => ({
                                                        id: place.place_id,
                                                        text: `${place.name} (${municipality(place.formatted_address || "")})`,
                                                    }))}
                                                    onItemSelect={(item) => {
                                                        const place = results.find((place) => place.place_id === item.id)
                                                        if (!place) {
                                                            return
                                                        }
                                                        field.onChange(JSON.stringify(place))
                                                        setResults([])
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="createdAt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date de dégustation</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    defaultValue={new Date()}
                                                    locale={fr}
                                                    value={field.value}
                                                    onChange={(date) => {
                                                        field.onChange(date)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prix</FormLabel>
                                            <FormControl>
                                                <PriceInput
                                                    onAmountChange={handlePriceChange}
                                                    onCurrencyChange={(value) => {
                                                        form.setValue("currency", value)
                                                    }}
                                                    initialAmount={field.value}
                                                    initialCurrency="eur"
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
                                                        defaultValue={[5]}
                                                        min={0}
                                                        max={10}
                                                        step={0.25}
                                                        value={[field.value]}
                                                        onValueChange={(value) => {
                                                            field.onChange(value[0])
                                                            handleAverageNote()
                                                        }}
                                                    />
                                                    <span>{field.value.toFixed(2)}/10</span>
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
                                                        defaultValue={[5]}
                                                        min={0}
                                                        max={10}
                                                        step={0.25}
                                                        value={[field.value]}
                                                        onValueChange={(value) => {
                                                            field.onChange(value[0])
                                                            handleAverageNote()
                                                        }}
                                                    />
                                                    <span>{field.value.toFixed(2)}/10</span>
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
                                                        defaultValue={[5]}
                                                        min={0}
                                                        max={10}
                                                        step={0.25}
                                                        value={[field.value]}
                                                        onValueChange={(value) => {
                                                            field.onChange(value[0])
                                                            handleAverageNote()
                                                        }}
                                                    />
                                                    <span>{field.value.toFixed(2)}/10</span>
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
                                                    <Slider defaultValue={[5]} min={0} max={10} step={0.25} value={[field.value]} disabled />
                                                    <span>{field.value.toFixed(2)}/10</span>
                                                </section>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full md:w-auto md:float-right">
                                    Soumettre
                                </Button>
                            </form>
                        </Form>
                    </section>
                </ResponsiveDrawerDialogContent>
            </ResponsiveDrawerDialog>

            <OtpVerification
                isOpen={showOtpDialog}
                onOpenChange={setShowOtpDialog}
                onSuccess={handleOtpSuccess}
                onError={handleOtpError}
                description="Veuillez entrer le code OTP pour valider votre soumission."
            />
        </>
    )
}

export default AddTartar
