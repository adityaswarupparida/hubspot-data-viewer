import { 
    getCoreRowModel, 
    useReactTable,
    ColumnDef, 
    flexRender
} from "@tanstack/react-table";

// export type DataTableProps<T> = {
//   columns: ColumnDef<T, any>[];
//   data: T[];
// };

export type CRMObjectRecord = {
    id: string;
    properties: Record<string, string>;
    createdAt: string;
    updatedAt: string;
    archived: boolean;
    url: string;
}

export type CRMObjectProperty = {
    updatedAt: string,
    createdAt: string,
    name: string,
    label: string,
    type: string,
    fieldType: string,
    description: string,
    groupName: string,
    options: any[],
    displayOrder: number,
    calculated: boolean,
    externalOptions: boolean,
    hasUniqueValue: boolean,
    hidden: boolean,
    hubspotDefined: boolean,
    modificationMetadata: any,
    formField: boolean,
    dataSensitivity: "non_sensitive" | "sensitive",
}

const buildColumns = (properties: CRMObjectProperty[], records: CRMObjectRecord[]): ColumnDef<CRMObjectRecord>[] => {
    const set = new Set<string>();
    if (records.length > 0) {
        for (const [key, value] of Object.entries(records[0].properties)) {
            set.add(key);
        }
    }
    console.log(`Properties `, properties);
    return properties
        .filter(p => !p.hidden && set.has(p.name))
        .map(p => ({
            id: p.name,
            header: p.label,
            accessorFn: (row) => row.properties[p.name],
            cell: ({ getValue }) => {
                const value = getValue();
                return String(value);
            },
        }));
}

export const DataTable = ({ properties, records }: { 
    properties: CRMObjectProperty[];
    records: CRMObjectRecord[] 
}) => {
    // console.log(properties, records);
    const columns = buildColumns(properties, records);
    const table = useReactTable({
        data: records,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="overflow-x-auto">
            <table className="border-collapse">
                <thead className="bg-gray-200">
                    {table.getHeaderGroups().map(hg => (
                        <tr key={hg.id}>
                            {hg.headers.map(header => (
                                <th key={header.id}
                                    className="border px-2"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="bg-white hover:bg-gray-50">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} 
                                    className="border w-40 text-md px-2 text-nowrap"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}