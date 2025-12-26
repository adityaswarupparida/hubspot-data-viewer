import { 
    getCoreRowModel, 
    useReactTable,
    ColumnDef, 
    flexRender
} from "@tanstack/react-table";
import { useQuery } from "../hooks/useQuery";
import { LuFileSearch } from "react-icons/lu";
import { useMemo } from "react";

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
        for (const [key, _] of Object.entries(records[0].properties)) {
            if (key !== `hs_object_id`)
                set.add(key);
        }
    }
    return properties
        .filter(p => !p.hidden && set.has(p.name))
        .map(p => ({
            id: p.name,
            header: p.label,
            accessorFn: (row) => row.properties[p.name],
            cell: ({ getValue }) => {
                const value = getValue<string>();
                return !value ? `` : String(value);
            },
        }));
}

export const DataTable = ({ records, count }: { 
    records: CRMObjectRecord[],
    count: number 
}) => {

    const { appliedColumns: properties } = useQuery();
    const idColumn: ColumnDef<CRMObjectRecord> = {
        id: `hs_object_id`,
        header: `Record ID`,
        accessorKey: `id`,
        cell: ({ getValue, row }) => {
            const recordId = getValue<string>();
            return (
                <a 
                    href={`${row.original.url}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline cursor-pointer"
                >
                    {recordId}
                </a>
            )
        }
    }
    const columns = useMemo<ColumnDef<CRMObjectRecord>[]>(() => 
        [idColumn, ...buildColumns(properties, records)], 
    [properties]);

    const table = useReactTable({
        data: records,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    // console.log(properties, records);
    if (!count) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <LuFileSearch className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg font-medium text-gray-500">No Records Found</p>
                <p className="text-sm mt-2 text-gray-500">
                    Your query returned no results. Try adjusting your filters or selected fields.
                </p>
            </div>
        )
    }
    return (
        <div className="overflow-hidden h-full flex flex-col px-3">
            <div className="text-lg tracking-tighter font-semibold pt-2 pb-3">
                Query Results <span className="font-medium tracking-tight">(showing {records.length} of {count} records)</span>
            </div>
            <div className="overflow-auto flex-1">
                <table className="border-collapse text-sm">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map(hg => (
                            <tr key={hg.id}>
                                {hg.headers.map(header => (
                                    <th key={header.id}
                                        className="border border-gray-300 px-2 py-1"
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
                            <tr key={row.id} className="bg-white hover:bg-orange-50">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} 
                                        className="border border-gray-300 w-52 h-7 text-md px-2 py-1"
                                    >
                                        <div className="truncate w-52">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}