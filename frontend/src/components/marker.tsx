import { MapPin } from 'lucide-react';
import React from 'react';

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

interface MarkerProps {
    text: string;
    description?: string;
    onClick?: () => void;
    className?: string;
}

const CustomMarker: React.FC<MarkerProps> = ({ text, description, onClick, className }) => {
    return (
        <HoverCard>
            <HoverCardTrigger onClick={onClick}>
                <div
                    className={`absolute transform -translate-x-1/2  -translate-y-full cursor-pointer ${className || ''}`}
                >
                    <div className="flex flex-col items-center ">
                        <MapPin className="w-8 h-8 text-neutral-100 fill-neutral-900 border-neutral-0" strokeWidth={1} />
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-48 p-2 bg-white text-black rounded-md shadow-lg">
                <div className="text-sm font-semibold">{text}</div>
                <div className="text-xs text-gray-500">{description ? description : "Click to view details"}</div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default CustomMarker;