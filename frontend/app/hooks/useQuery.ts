import { useContext } from "react";
import { QueryContext } from "../providers/QueryProvider";

export const useQuery = () => {
    const ctx = useContext(QueryContext)
    if (!ctx) throw new Error("Couldn't found QueryContext");
    return ctx;
}