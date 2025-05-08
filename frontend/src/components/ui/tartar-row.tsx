"use client"

import { useState, useRef, useEffect } from "react"
import type { Tartar } from "@/types/tartar"
import { MapPin, Star, Pencil, Trash2, Eye, MoreHorizontal } from 'lucide-react'
import { currencies } from "@/lib/constants/currencies"

interface TartarRowProps {
    tartar: Tartar
    onClick: () => void
    onEdit?: (tartar: Tartar) => void
    onDelete?: (tartar: Tartar) => void
}

export function TartarRow({ tartar, onClick, onEdit, onDelete }: TartarRowProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isMenuOpen])

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsMenuOpen(!isMenuOpen)
    }

    const handleMenuItemClick = (handler: () => void) => {
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            setIsMenuOpen(false)
            handler()
        }
    }

    return (
        <div
            className="relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <div className="absolute top-1 right-2 z-10" ref={menuRef}>
                <button
                    className="flex cursor-pointer h-8 w-8 items-center justify-center rounded-full p-0 text-muted-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    onClick={handleMenuToggle}
                    aria-label="Menu"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-[160px] rounded-md border bg-popover shadow-md z-50">
                        <div>
                            <button
                                className="flex w-full items-center px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                onClick={handleMenuItemClick(() => onClick())}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir
                            </button>

                            {onEdit && (
                                <button
                                    className="flex w-full items-center px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                    onClick={handleMenuItemClick(() => onEdit(tartar))}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Modifier
                                </button>
                            )}

                            {onDelete && (
                                <>
                                    <div className="my-1 h-px bg-muted"></div>
                                    <button
                                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-muted cursor-pointer text-destructive"
                                        onClick={handleMenuItemClick(() => onDelete(tartar))}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Supprimer
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 space-y-4 mt-3">
                <div className="flex flex-col justify-between items-between">
                    <div className="flex flex-row justify-between items-center">
                        <h3 className="text-xl font-semibold tracking-tight">{tartar.restaurant.name}</h3>
                        <div className="flex items-center bg-primary/10 px-2.5 py-1 rounded-full">
                            <span className="font-normal md:font-medium text-xs md:text-sm text-primary whitespace-nowrap">
                                {tartar.price} {currencies.find((c) => c.value === tartar.currency)?.symbol}
                            </span>
                        </div>
                    </div>
                    <div className="flex mt-1 text-sm text-muted-foreground">
                        <MapPin className="mt-[3px] h-3.5 w-3.5 mr-1" />
                        <span>{tartar.restaurant.address}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                    <RatingItem label="Goût" rating={tartar.taste_rating.toFixed(2)} />
                    <RatingItem label="Texture" rating={tartar.texture_rating.toFixed(2)} />
                    <RatingItem label="Présentation" rating={tartar.presentation_rating.toFixed(2)} />
                    <RatingItem label="Total" rating={tartar.total_rating.toFixed(2)} />
                </div>
            </div>
        </div>
    )
}

function RatingItem({ label, rating }: { label: string; rating: string }) {
    return (
        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
            <span className="text-xs text-muted-foreground mb-1">{label}</span>
            <div className="flex items-center">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-0.5" />
                <span className="font-medium text-sm">{rating}</span>
            </div>
        </div>
    )
}
