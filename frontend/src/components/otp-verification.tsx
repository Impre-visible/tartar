"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { env } from "@/environment"
import { usePost } from "@/hooks/use-post"

interface OtpVerificationProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    onError: (error: string) => void
    title?: string
    description?: string
    maxLength?: number
    expectedCode?: string
}

export function OtpVerification({
    isOpen,
    onOpenChange,
    onSuccess,
    onError,
    title = "Vérification OTP",
    description = "Veuillez entrer le code OTP pour continuer.",
    expectedCode,
}: OtpVerificationProps) {
    const [otpValue, setOtpValue] = useState("")
    const maxLength = expectedCode?.length || (env.VITE_OTP_FORMAT?.match(/X/g) || []).length || 6

    const processedResultRef = useRef<string | null>(null);

    const {
        execute: validateOtp,
        isLoading,
        error: apiError,
        data: validationResult,
        reset
    } = usePost<{ isValid: boolean }, { code: string }>('/otp/validate')

    useEffect(() => {
        if (isOpen) {
            processedResultRef.current = null;
        } else {
            reset()
            setOtpValue("")
        }
    }, [isOpen, reset])

    useEffect(() => {
        if (validationResult && isOpen &&
            processedResultRef.current !== `${Date.now()}-${JSON.stringify(validationResult)}`) {

            processedResultRef.current = `${Date.now()}-${JSON.stringify(validationResult)}`;

            if (validationResult.isValid) {
                onSuccess()
                setOtpValue("")
                reset()
            } else {
                onError("Code OTP incorrect")
            }
        }
    }, [validationResult, onSuccess, onError, isOpen, reset])

    useEffect(() => {
        if (apiError && processedResultRef.current !== apiError.message) {
            processedResultRef.current = apiError.message;
            onError(`Erreur de connexion: ${apiError.message}`)
        }
    }, [apiError, onError])

    const otpGroups = useMemo(() => {
        const formatString = env.VITE_OTP_FORMAT

        if (formatString) {
            const groups = formatString.split("-")
            return groups.map((group, index) => ({
                length: group.length,
                hasSeparator: index < groups.length - 1,
            }))
        }

        switch (maxLength) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                // 1-5: one group
                return [{ length: maxLength, hasSeparator: false }]
            case 6:
                // 6: XXX-XXX
                return [
                    { length: 3, hasSeparator: true },
                    { length: 3, hasSeparator: false },
                ]
            case 7:
                // 7: XX-XXX-XX
                return [
                    { length: 2, hasSeparator: true },
                    { length: 3, hasSeparator: true },
                    { length: 2, hasSeparator: false },
                ]
            case 8:
                // 8: XXXX-XXXX
                return [
                    { length: 4, hasSeparator: true },
                    { length: 4, hasSeparator: false },
                ]
            case 9:
                // 9: XXX-XXX-XXX
                return [
                    { length: 3, hasSeparator: true },
                    { length: 3, hasSeparator: true },
                    { length: 3, hasSeparator: false },
                ]
            case 10:
                // 10: XXXXX-XXXXX
                return [
                    { length: 5, hasSeparator: true },
                    { length: 5, hasSeparator: false },
                ]
            default:
                // Default case: return a single group with the maxLength
                return [{ length: maxLength, hasSeparator: false }]
        }
    }, [maxLength])

    const verifyOtp = () => {
        processedResultRef.current = null;
        validateOtp({ code: otpValue })
    }

    const handleClose = () => {
        setOtpValue("")
        onOpenChange(false)
    }

    const renderOtpGroups = () => {
        let currentIndex = 0
        const elements = []

        for (let groupIndex = 0; groupIndex < otpGroups.length; groupIndex++) {
            const group = otpGroups[groupIndex]
            const slots = []

            for (let i = 0; i < group.length; i++) {
                slots.push(<InputOTPSlot key={`slot-${currentIndex}`} index={currentIndex} />)
                currentIndex++
            }

            elements.push(<InputOTPGroup key={`group-${groupIndex}`}>{slots}</InputOTPGroup>)

            if (group.hasSeparator) {
                elements.push(<InputOTPSeparator key={`separator-${groupIndex}`} />)
            }
        }

        return elements
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:min-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="w-full flex items-center space-y-2">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="otp">Code OTP</Label>
                            <InputOTP maxLength={maxLength} value={otpValue} onChange={setOtpValue} containerClassName="justify-center">
                                {renderOtpGroups()}
                            </InputOTP>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                            Annuler
                        </Button>
                        <Button onClick={verifyOtp} disabled={isLoading}>
                            {isLoading ? "Vérification..." : "Vérifier"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
