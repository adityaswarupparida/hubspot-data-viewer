"use client";
import { useEffect, useRef, useState } from "react";
import { LuDatabase } from "react-icons/lu";
import { CRMObjectRecord, DataTable } from "./DataTable";
import { LoadRecords, LoadObjects } from "../utils";
import { QueryBuilder } from "./QueryBuilder";
import { Spinner } from "./Spinner";
import { useQuery } from "../hooks/useQuery";

export const HubSpotDashboard = () => {
    const [data, setData] = useState<CRMObjectRecord[]>([]);
    const [count, setCount] = useState<number>(0);
    const { columns, setAppliedColumns, selectedObject, query, run, setRun } = useQuery();
    const [objects, setObjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const displayRef = useRef<boolean>(false);
    const fetchRef = useRef<boolean>(false);   // prevent re-renders

    useEffect(() => {
        if (fetchRef.current) return;
        fetchRef.current = true;

        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        
        const loadObjects = async () => {
            const payload = await LoadObjects(token);
            if (!payload) return;
            setObjects(payload)
            setLoading(false)
        }

        loadObjects();
    }, []);

    useEffect(() => {
        if (!run) return;
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        const loadRecords = async () => {
            let params: any = {
                properties: query?.properties,
                limit: query?.limit,
            }
            if (query?.filterGroups) {
                params = { ...params, filterGroups: query.filterGroups };
            }
            const payload = await LoadRecords(token, selectedObject, params);
            if (!payload) return;
            if (payload.records) 
                setData(payload.records);
            if (payload.count > 0)
                setCount(payload.count);

            displayRef.current = true;
            setLoading(false);
            setRun(false);
        }

        setAppliedColumns(columns);
        loadRecords();

    }, [run])

    return (
        <div className="w-full h-full flex gap-3 rounded-lg">
            <div className="w-1/4 shrink-0 h-full rounded-lg bg-white shadow-2xl">
                <QueryBuilder objects={objects} />
            </div>
            <div className="flex-1 h-full bg-white rounded-lg shadow-2xl overflow-hidden">
                { loading && 
                    <div className="flex justify-center items-center h-full">
                        <Spinner size="lg"/>
                    </div>
                }
                { !loading && displayRef.current && <DataTable records={data} count={count} />}
                { !loading && !displayRef.current && 
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