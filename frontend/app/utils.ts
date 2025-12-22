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

export const LoadContacts = async (token: string): Promise<any> => {
    const response = await axios.get(`${BACKEND_URL}/hubspot/crm/contacts`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

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