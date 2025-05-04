// Component based on the original from:
// https://shadcn-extra-five.vercel.app
// Thanks to @shadcn for the great work!
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { currencies } from "@/lib/constants/currencies";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface PriceInputProps {
    onCurrencyChange?: (currency: string) => void;
    onAmountChange?: (amount: number) => void;
    initialCurrency?: string;
    initialAmount?: number;
    searchCurrencyText?: string;
    searchCurrencyEmptyText?: string;
}

export function PriceInput({
    onCurrencyChange,
    onAmountChange,
    initialCurrency = "usd",
    initialAmount = 0,
    searchCurrencyText = "Search currency...",
    searchCurrencyEmptyText = "No currency found.",
}: PriceInputProps) {
    const [open, setOpen] = useState(false);
    const [currency, setCurrency] = useState(initialCurrency);
    const [amount, setAmount] = useState(initialAmount);
    const [inputValue, setInputValue] = useState(initialAmount.toString());

    const selectedCurrency = currencies.find((c) => c.value === currency);

    useEffect(() => {
        if (onCurrencyChange) {
            onCurrencyChange(currency);
        }
    }, [currency, onCurrencyChange]);

    useEffect(() => {
        if (onAmountChange) {
            onAmountChange(amount);
        }
    }, [amount, onAmountChange]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Remplacer les virgules par des points pour standardiser les entrées
        value = value.replace(/,/g, '.');

        // Vérifier si la valeur contient déjà un point décimal
        const hasDecimal = value.includes('.');

        // Filtrer les caractères non valides et empêcher plusieurs points décimaux
        value = value.replace(/[^0-9.]/g, '');
        if (hasDecimal) {
            value = value.replace(/\./g, (match: string, offset: number, string: string) => {
                return offset === string.indexOf('.') ? match : '';
            });
        }

        setInputValue(value);
    };

    const handleInputBlur = () => {
        const newAmount = inputValue ? parseFloat(inputValue) : 0;
        setAmount(newAmount);
    };

    return (
        <div
            className={cn(
                "flex items-center rounded-md border bg-background text-sm shadow-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-2"
            )}
        >
            <span className="pl-3 pr-1 text-muted-foreground">
                {selectedCurrency?.symbol}
            </span>
            <input
                type="text"
                placeholder="0.00"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="h-9 w-full bg-transparent py-1 text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="h-5 w-px bg-border mx-1" />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="flex h-9 items-center gap-2 px-3 text-sm focus:outline-none"
                    >
                        <span className="flex items-center gap-2">
                            <span>{selectedCurrency?.icon}</span>
                            {selectedCurrency?.label}
                        </span>
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder={searchCurrencyText} />
                        <CommandList>
                            <CommandEmpty>{searchCurrencyEmptyText}</CommandEmpty>
                            <CommandGroup>
                                {currencies.map((c) => (
                                    <CommandItem
                                        key={c.value}
                                        value={c.value}
                                        onSelect={(val) => {
                                            setCurrency(val);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                currency === c.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <span className="mr-2">{c.icon}</span>
                                        {c.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
