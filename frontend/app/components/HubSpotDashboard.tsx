"use client";
import { useEffect, useState } from "react";
import { LuDatabase } from "react-icons/lu";
import { CRMObjectProperty, CRMObjectRecord, DataTable } from "./DataTable";
import { LoadContacts } from "../utils";
import { QueryBuilder } from "./QueryBuilder";

export const HubSpotDashboard = () => {
    const [data, setData] = useState<CRMObjectRecord[]>([]);
    const [columns, setColumns] = useState<CRMObjectProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        const loadContacts = async () => {
            const payload = await LoadContacts(token);
            if (!payload) return;
            if (payload.records) 
                setData(payload.records);
            if (payload.properties) 
                setColumns(payload.properties);
            setLoading(false);
        }

        loadContacts()     
    }, []);

    return (
        <div className="w-full h-full flex gap-3 rounded-lg">
            <div className="w-1/4 shrink-0 h-full rounded-lg bg-white shadow-2xl">
                <QueryBuilder properties={columns}/>
            </div>
            <div className="flex-1 h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                { !loading && <DataTable records={data} properties={columns}/>}
                { loading  && 
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <LuDatabase className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium text-gray-500">No Results Yet</p>
                        <p className="text-sm mt-2 text-gray-500">
                            Build your query and click "Run Query" to see results
                        </p>
                    </div>
                }
            </div>
        </div>
    );
}