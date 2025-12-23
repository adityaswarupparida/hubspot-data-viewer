"use client";
import { useEffect, useState } from "react";
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
            const { records, properties } = await LoadContacts(token);
            if (records) 
                setData(records);
            if (properties) 
                setColumns(properties);
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
            </div>
        </div>
    );
}