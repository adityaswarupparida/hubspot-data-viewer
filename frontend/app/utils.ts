import axios from "axios";
import { BACKEND_URL } from "./config";

export const CheckAccess = async (token: string): Promise<boolean> => {
    const response = await axios.post(`${BACKEND_URL}/integrations`, {
            type: "HUBSPOT",
        }, {        
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }          
        }
    );

    return response.data.active;
}

export const GetAuthorized = async (token: string): Promise<string> => {
    const response = await axios.post(`${BACKEND_URL}/hubspot/authorize`, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data.redirectUrl;
}

export const LoadObjects = async (token: string): Promise<any> => {
    const response = await axios.get(`${BACKEND_URL}/hubspot/crm/objects`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data.payload;
}

export const LoadProperties = async (token: string, objectType: string): Promise<any> => {
    const response = await axios.get(`${BACKEND_URL}/hubspot/crm/properties/${objectType}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    return response.data.payload;
}

export const LoadRecords = async (token: string, objectType: string, params: any): Promise<any> => {
    const response = await axios.post(`${BACKEND_URL}/hubspot/crm/records/${objectType}`,
        params, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }
    );

    return response.data.payload;
}

// export const CreateAccess = async (token: string): Promise<Boolean> => {
//     const response = await axios.post(`${BACKEND_URL}/integrations`, {
//         data: {
//             type: "HUBSPOT",
//         },
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     });

//     return response.data.active;
// }