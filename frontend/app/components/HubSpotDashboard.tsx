"use client";
import { useEffect, useState } from "react";
import { CRMObjectProperty, CRMObjectRecord, DataTable } from "./DataTable";
import { LoadContacts } from "../utils";

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
        <div className="w-full h-full flex bg-red-100 rounded-lg">
            <div className="w-64 h-full rounded-l-lg bg-amber-100"></div>
            <div className="w-full h-full">
                {/* <table className="w-full border border-collapse border-gray-500">
                    <thead>
                        <tr>
                            <th>
                                Contact
                            </th>
                             <th>
                                Contact
                            </th>
                             <th>
                                Contact
                            </th>
                             <th>
                                Contact
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>6</td>
                            <td>7</td>
                            <td>8</td>
                            <td>9</td>
                        </tr>
                    </tbody>
                </table> */}
                { !loading && <DataTable records={data} properties={columns}/>}
            </div>
        </div>
    );
}