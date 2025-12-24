import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { CRMObjectProperty } from '../components/DataTable';

type QueryContextValue = {
    columns: CRMObjectProperty[];
    setColumns: Dispatch<SetStateAction<CRMObjectProperty[]>>;
    appliedColumns: CRMObjectProperty[];
    setAppliedColumns: Dispatch<SetStateAction<CRMObjectProperty[]>>;


    run: boolean;
    setRun: Dispatch<SetStateAction<boolean>>;
}
export const QueryContext = createContext<QueryContextValue | null>(null);

export const QueryContextProvider = ({ children }: {
    children: ReactNode 
}) => {
    const [columns, setColumns] = useState<CRMObjectProperty[]>([]);
    const [appliedColumns, setAppliedColumns] = useState<CRMObjectProperty[]>([]);
    const [run, setRun] = useState<boolean>(false);

    return (
        <QueryContext.Provider 
            value={{ 
                columns, 
                setColumns,
                appliedColumns,
                setAppliedColumns,
                run,
                setRun 
            }}
        >
            { children }
        </QueryContext.Provider>
    );
}