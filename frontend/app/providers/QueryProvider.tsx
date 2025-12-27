import { 
    createContext, 
    Dispatch, 
    ReactNode, 
    RefObject, 
    SetStateAction, 
    useRef, 
    useState 
} from 'react';
import { CRMObjectProperty } from '../components/DataTable';
import { Query } from '../components/QueryBuilder';

type QueryContextValue = {
    columns: CRMObjectProperty[];
    setColumns: Dispatch<SetStateAction<CRMObjectProperty[]>>;
    appliedColumns: CRMObjectProperty[];
    setAppliedColumns: Dispatch<SetStateAction<CRMObjectProperty[]>>;
    selectedObject: string;
    setSelectedObject: Dispatch<SetStateAction<string>>;
    query: Partial<Query> | null;
    setQuery: Dispatch<SetStateAction<Partial<Query> | null>>;
    loadAll: boolean;
    setLoadAll: Dispatch<SetStateAction<boolean>>;
    nextPageRef: RefObject<string | undefined>;

    run: boolean;
    setRun: Dispatch<SetStateAction<boolean>>;
}
export const QueryContext = createContext<QueryContextValue | null>(null);

export const QueryContextProvider = ({ children }: {
    children: ReactNode 
}) => {
    const [columns, setColumns] = useState<CRMObjectProperty[]>([]);
    const [appliedColumns, setAppliedColumns] = useState<CRMObjectProperty[]>([]);
    const [selectedObject, setSelectedObject] = useState<string>("");
    const [query, setQuery] = useState<Partial<Query> | null>(null);
    const [run, setRun] = useState<boolean>(false);
    const [loadAll, setLoadAll] = useState<boolean>(false);
    const nextPageRef = useRef<string | undefined>(undefined);

    return (
        <QueryContext.Provider 
            value={{ 
                columns, 
                setColumns,
                appliedColumns,
                setAppliedColumns,
                selectedObject,
                setSelectedObject,
                query,
                setQuery,
                loadAll,
                setLoadAll,
                nextPageRef,
                run,
                setRun 
            }}
        >
            { children }
        </QueryContext.Provider>
    );
}