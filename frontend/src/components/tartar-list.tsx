import { Tartar } from '@/types/tartar';
import React from 'react';
import { TartarRow } from './ui/tartar-row';

interface TartarListProps {
    tartars: Tartar[];
    setSelectedTartar: (tartar: Tartar | null) => void;
}

const TartarList: React.FC<TartarListProps> = ({ tartars = [], setSelectedTartar }) => {
    if (tartars.length === 0) return <div>Aucun tartar trouvé</div>;

    return (
        <div className="h-full pb-4">
            <ul className="flex flex-col gap-4">
                {tartars.map((tartar) => (
                    <li key={tartar.id} >
                        <TartarRow tartar={tartar} onClick={() => setSelectedTartar(tartar)} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TartarList;