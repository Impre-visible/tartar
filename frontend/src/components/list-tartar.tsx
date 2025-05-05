import { Tartar } from '@/types/tartar';
import React from 'react';
import { TartarRow } from './ui/tartar-row';

interface ListTartarProps {
    tartars: Tartar[];
}

const ListTartar: React.FC<ListTartarProps> = ({ tartars = [] }) => {
    if (tartars.length === 0) return <div>Aucun tartar trouvé</div>;

    return (
        <div className="h-full pb-4">
            <ul className="flex flex-col gap-4">
                {tartars.map((tartar) => (
                    <li key={tartar.id} >
                        <TartarRow tartar={tartar} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListTartar;