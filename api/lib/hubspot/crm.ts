import axios from "axios";
import { HUBSPOT_URL } from "../../config";
import { getAccessToken } from "./auth";

export const getObjects = async (userId: string) => {
    const token = await getAccessToken(userId);
    console.log(token);

    try {
        const response = await axios.get(`${HUBSPOT_URL}/crm-object-schemas/v3/schemas`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(response.data);
        return response.data.results;
    } catch (err) {
        console.error(`Error while retrieving objects`);

        if (axios.isAxiosError(err)) {
            console.log(`Error: ` + err.message);
        } else {
            console.error(err);
        }
    }
}

export const getProperties = async (userId: string, objectType: string) => {
    const token = await getAccessToken(userId);

    try {
        const response = await axios.get(`${HUBSPOT_URL}/crm/v3/properties/${objectType}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // console.log(response.data);
        return response.data.results;
    } catch (err) {
        console.error(`Error while retrieving properties of ${objectType}`);

        if (axios.isAxiosError(err)) {
            console.log(`Error: ` + err.message);
        } else {
            console.error(err);
        }
    }
}

export const getRecords = async (userId: string, objectType: string, params: any) => {
    const token = await getAccessToken(userId);

    try { 
        const searchResponse = await axios.post(`${HUBSPOT_URL}/crm/v3/objects/${objectType}/search`, {
            "limit": "0",
            "filterGroups": [
                {
                    "filters": [
                        {
                            "propertyName": "hs_object_id",
                            "operator": "HAS_PROPERTY"
                        }
                    ]
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(searchResponse.data); 
        console.log(params);

        const response =  await axios.get(`${HUBSPOT_URL}/crm/v3/objects/${objectType}`, {
            params: new URLSearchParams(params),
            headers: {
                'Authorization': `Bearer ${token}`
            }, 
        });

        console.log(response.data);
        // console.log(`Next paging link:: ` + response.data.paging.next.link);
        // if (response.data.results.length > 0)
        //     console.log(`Properties:: ` + JSON.stringify(response.data.results[0].properties));

        return { 
            count: searchResponse.data.total, 
            records: response.data.results,
        };
    } catch (err) {
        console.error(`Error while retrieving ${objectType}`);

        if (axios.isAxiosError(err)) {
            console.log(`Error: ` + err.message);
        } else {
            console.error(err);
        }
    }
}

export const searchRecords = async (userId: string, objectType: string, params: any) => {
    const token = await getAccessToken(userId);

    try { 
        const response = await axios.post(`${HUBSPOT_URL}/crm/v3/objects/${objectType}/search`, 
            params, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response.data); 
        console.log(params);

        if (response.data.results.length > 0)
            console.log(`Properties:: ` + JSON.stringify(response.data.results[0].properties));

        return { 
            count: response.data.total, 
            records: response.data.results,
        };
    } catch (err) {
        console.error(`Error while searching ${objectType}`);

        if (axios.isAxiosError(err)) {
            console.log(`Error: ` + err.message);
        } else {
            console.error(err);
        }
    }
}