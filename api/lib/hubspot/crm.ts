import axios from "axios";
import { HUBSPOT_URL } from "../../config";
import { getAccessToken } from "./auth";

export const getProperties = async (userId: string, objectType: string) => {
    const token = await getAccessToken(userId);
}

export const getContacts = async (userId: string) => {
    const token = await getAccessToken(userId);

    try { 
        // https://api.hubapi.com/properties/v1/contacts/properties
        const propertiesResponse = await axios.get(`${HUBSPOT_URL}/crm/v3/properties/contacts`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(propertiesResponse.data);
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
        
        const response =  await axios.get(`${HUBSPOT_URL}/crm/v3/objects/contacts`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(response.data);
        // console.log(`Next paging link:: ` + response.data.paging.next.link);
        console.log(`Properties:: ` + JSON.stringify(response.data.results[0].properties));

        return { 
            records: response.data.results,
            properties: propertiesResponse.data.results 
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