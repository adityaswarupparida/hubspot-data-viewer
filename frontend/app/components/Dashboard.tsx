"use client"
import { FaHubspot } from "react-icons/fa";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";
import { CheckAccess } from "../utils";
import { HubSpotDashboard } from "./HubSpotDashboard";

export const Dashboard = () => {
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setHasAccess(false);
            setLoading(false);
            return;
        }

        const checkAccess = async () => {
            const flag =  await CheckAccess(token);
            setHasAccess(flag);
            setLoading(false);
        }

        checkAccess()
    }, []);

    const handleHubSpotAuth = () => {
        window.location.href = `${BACKEND_URL}/hubspot/authorize`;
    }

    if (loading) {
        return <div className="flex justify-center items-center h-full w-full text-black">
            <div className="absolute px-12 py-6 w-full h-full z-10">
                <div className="bg-gray-100 hover:bg-gray-200 w-full h-full rounded-lg">
                    Loading...
                </div>
            </div>
        </div>;
    }
    // if (!hasAccess && !loading) {
    //     return (
    //         <div className="flex justify-center items-center h-full w-full">
    //             <div className="absolute px-12 py-6 w-full h-full z-10">
    //                 <div className="bg-gray-100 hover:bg-gray-200 w-full h-full rounded-lg"></div>
    //             </div>
    //             <button className="flex gap-2 text-xl items-center bg-white hover:bg-orange-100 px-9 py-3 rounded-lg cursor-pointer z-20"
    //                     onClick={handleHubSpotAuth}
    //             >
    //                 <div className="font-medium">Login with HubSpot</div>
    //                 <FaHubspot size={30} className="text-orange-500"/>
    //             </button>
    //         </div>
    //     );
    // }

    return (
        <div className="flex justify-center items-center w-full h-full">
            <div className="px-12 py-6 w-full h-full">
                <div className="bg-orange-100 hover:bg-orange-200 w-full h-full rounded-lg">
                    <HubSpotDashboard />
                </div>
            </div>
        </div>
    );
}