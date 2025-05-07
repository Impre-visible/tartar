"use client"

import type { Tartar } from "@/types/tartar"
import type React from "react"
import { useState, useMemo } from "react"
import { TartarRow } from "./ui/tartar-row"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowUpDownIcon,
    DollarSignIcon,
    CalendarIcon,
    StarIcon,
    FilterIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

type SortField = "total_rating" | "usd_price" | "createdAt"
type SortDirection = "asc" | "desc"

interface TartarListProps {
    tartars: Tartar[]
    setSelectedTartar: (tartar: Tartar | null) => void
}

const TartarList: React.FC<TartarListProps> = ({ tartars = [], setSelectedTartar }) => {
    const [sortField, setSortField] = useState<SortField>("total_rating")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

    const sortedTartars = useMemo(() => {
        if (tartars.length === 0) return []

        return [...tartars].sort((a, b) => {
            let valueA, valueB

            // Handle different sort fields
            switch (sortField) {
                case "total_rating":
                    valueA = a.total_rating
                    valueB = b.total_rating
                    break
                case "usd_price":
                    valueA = a.usd_price
                    valueB = b.usd_price
                    break
                case "createdAt":
                    valueA = new Date(a.createdAt || 0).getTime()
                    valueB = new Date(b.createdAt || 0).getTime()
                    break
                default:
                    valueA = a.total_rating
                    valueB = b.total_rating
            }

            // Apply sort direction
            return sortDirection === "asc" ? valueA - valueB : valueB - valueA
        })
    }, [tartars, sortField, sortDirection])

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            // Set new field with default direction
            setSortField(field)
            setSortDirection("desc") // Default to descending for ratings, ascending for others
        }
    }

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />
        return sortDirection === "asc" ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
    }

    if (tartars.length === 0) return <div>Aucun tartar trouvé</div>

    return (
        <div className="h-full pt-2 pb-4">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="text-sm font-medium">Trier par:</div>

                <Button
                    variant={sortField === "total_rating" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSort("total_rating")}
                    className="flex items-center gap-1"
                >
                    <StarIcon className="h-4 w-4" />
                    Note
                    {getSortIcon("total_rating")}
                </Button>

                <Button
                    variant={sortField === "usd_price" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSort("usd_price")}
                    className="flex items-center gap-1"
                >
                    <DollarSignIcon className="h-4 w-4" />
                    Prix
                    {getSortIcon("usd_price")}
                </Button>

                <Button
                    variant={sortField === "createdAt" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-1"
                >
                    <CalendarIcon className="h-4 w-4" />
                    Date
                    {getSortIcon("createdAt")}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="hidden md:flex">
                        <Button variant="outline" size="sm" className="ml-auto">
                            <FilterIcon className="mr-2 h-4 w-4" />
                            Filtres
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Trier par</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSort("total_rating")}>
                            <StarIcon className="mr-2 h-4 w-4" />
                            Note {sortField === "total_rating" && (sortDirection === "asc" ? "(croissant)" : "(décroissant)")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSort("usd_price")}>
                            <DollarSignIcon className="mr-2 h-4 w-4" />
                            Prix {sortField === "usd_price" && (sortDirection === "asc" ? "(croissant)" : "(décroissant)")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Date {sortField === "createdAt" && (sortDirection === "asc" ? "(ancien → récent)" : "(récent → ancien)")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Direction</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSortDirection("asc")}>
                            <ArrowUpIcon className="mr-2 h-4 w-4" />
                            Croissant
                            {sortDirection === "asc" && (
                                <Badge className="ml-2" variant="outline">
                                    Actif
                                </Badge>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortDirection("desc")}>
                            <ArrowDownIcon className="mr-2 h-4 w-4" />
                            Décroissant
                            {sortDirection === "desc" && (
                                <Badge className="ml-2" variant="outline">
                                    Actif
                                </Badge>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ul className="flex flex-col gap-4">
                {sortedTartars.map((tartar) => (
                    <li key={tartar.id}>
                        <TartarRow tartar={tartar} onClick={() => setSelectedTartar(tartar)} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TartarList
