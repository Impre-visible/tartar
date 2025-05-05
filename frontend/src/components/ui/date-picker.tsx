"use client"

import * as React from "react"
import { format } from "date-fns"
import { enUS, Locale } from 'date-fns/locale'

import { CalendarIcon } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    defaultValue?: Date
    value?: Date
    onChange?: (date: Date | undefined) => void
    locale?: Locale
}

export function DatePicker({ defaultValue, value, onChange, locale = enUS }: DatePickerProps) {
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultValue)

    const date = value !== undefined ? value : internalDate

    const handleSelect = (newDate: Date | undefined) => {
        if (value === undefined) {
            setInternalDate(newDate)
        }

        if (onChange) {
            onChange(newDate)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale }) : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    locale={locale}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
