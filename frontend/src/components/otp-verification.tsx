"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { env } from "@/environment"

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
    const maxLength = expectedCode?.length || env.VITE_OTP_CODE?.toString().length || 6

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
        const envCode = env.VITE_OTP_CODE || "123456" // Default value
        const codeToCheck = expectedCode || envCode

        if (otpValue === codeToCheck) {
            onSuccess()
            setOtpValue("")
        } else {
            onError("Code OTP incorrect")
        }
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
                        <Button variant="outline" onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button onClick={verifyOtp}>Vérifier</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
