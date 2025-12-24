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

        console.log(response.data);
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

export const getContacts = async (userId: string, params: any) => {
    const token = await getAccessToken(userId);

    try { 
        // https://api.hubapi.com/properties/v1/contacts/properties
        // const propertiesResponse = await axios.get(`${HUBSPOT_URL}/crm/v3/properties/contacts`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${token}`
        //     }
        // });
        // console.log(propertiesResponse.data);
        const searchResponse = await axios.post(`${HUBSPOT_URL}/crm/v3/objects/contacts/search`, {
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

        const response =  await axios.get(`${HUBSPOT_URL}/crm/v3/objects/contacts`, {
            params: new URLSearchParams(params),
            headers: {
                'Authorization': `Bearer ${token}`
            }, 
        });

        console.log(response.data);
        // console.log(`Next paging link:: ` + response.data.paging.next.link);
        console.log(`Properties:: ` + JSON.stringify(response.data.results[0].properties));

        return { 
            count: searchResponse.data.results, 
            records: response.data.results,
        };
    } catch (err) {
        console.error(`Error while retrieving contacts`);

        if (axios.isAxiosError(err)) {
            console.log(`Error: ` + err.message);
        } else {
            console.error(err);
        }
    }
}