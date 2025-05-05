"use client"

import type React from "react"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface DefaultSearchResult {
    id: string | number
    text: string
}

export interface SearchInputProps<T extends DefaultSearchResult = DefaultSearchResult> {
    placeholder?: string
    onSearch: (query: string) => void
    results: T[]
    isLoading?: boolean
    className?: string
    debounceTime?: number
    renderItem?: (item: T, isSelected: boolean) => ReactNode
    onItemSelect?: (item: T) => void
    inputClassName?: string
    resultsClassName?: string
}

export function SearchInput<T extends DefaultSearchResult = DefaultSearchResult>({
    placeholder = "Search...",
    onSearch,
    results,
    isLoading = false,
    className,
    debounceTime = 500,
    renderItem,
    onItemSelect,
    inputClassName,
    resultsClassName,
}: SearchInputProps<T>) {
    const [query, setQuery] = useState("")
    const [showResults, setShowResults] = useState(true)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const searchTimeoutRef = useRef<number | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const resultsRef = useRef<HTMLDivElement>(null)
    const onSearchRef = useRef(onSearch)

    useEffect(() => {
        onSearchRef.current = onSearch
    }, [onSearch])

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = window.setTimeout(() => {
            onSearchRef.current(query)
        }, debounceTime)

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [query, debounceTime]) // Removed onSearch from dependencies

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                resultsRef.current &&
                !resultsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowResults(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!results.length) return

        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelectedIndex((prevIndex) => (prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0))
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault()
            handleItemSelect(results[selectedIndex])
        }
    }

    const handleItemSelect = (item: T) => {
        if (onItemSelect) {
            onItemSelect(item)
        }
        setQuery(item.text)
        setShowResults(false)
        setSelectedIndex(-1)
    }

    const defaultRenderItem = (item: T, isSelected: boolean) => (
        <div className={cn("px-4 py-2 cursor-pointer hover:bg-muted transition-colors", isSelected && "bg-muted")}>
            {item.text}
        </div>
    )

    return (
        <div className={cn("relative w-full", className)}>
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                }}
                onFocus={() => setShowResults(true)}
                onKeyDown={handleKeyDown}
                className={cn("w-full", inputClassName)}
            />

            {showResults && results.length > 0 && (
                <div
                    ref={resultsRef}
                    className={cn(
                        "absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-auto",
                        resultsClassName,
                    )}
                >
                    {results.map((item, index) => (
                        <div key={item.id} onClick={() => handleItemSelect(item)}>
                            {renderItem
                                ? renderItem(item, index === selectedIndex)
                                : defaultRenderItem(item, index === selectedIndex)}
                        </div>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            )}
        </div>
    )
}
