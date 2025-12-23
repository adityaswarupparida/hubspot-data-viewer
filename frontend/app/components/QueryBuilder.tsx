"use client"
import { FaPlay } from "react-icons/fa6";
import { CRMObjectProperty } from "./DataTable";
import { useState } from "react";
import Select from 'react-select';

export const QueryBuilder = ({ properties }: { 
    properties:  CRMObjectProperty[]
}) => {
    const [showQuery, setShowQuery] = useState<boolean>(false);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [fieldFilter, setFieldFilter] = useState<string>("");
    const options = [
        { value: 'contacts', label: 'Contacts' },
        { value: 'carts', label: 'Carts' }
    ]
    return (
        <div className="px-3 py-2 mx-auto w-full h-full relative">
            <div className="text-lg mb-2 flex justify-between">
                <div className="tracking-tighter font-semibold">
                    Query Builder
                </div>
                <div>
                    {!showQuery && <button className="border border-gray-200 cursor-pointer rounded hover:border-orange-500 hover:text-orange-600 pl-2 pr-2 py-1 text-xs" onClick={() => setShowQuery(s => !s)}>{`<>`} Show Query</button>}
                    {showQuery && <button className="border border-gray-200 cursor-pointer rounded hover:border-orange-500 hover:text-orange-600 pl-2 pr-2 py-1 text-xs" onClick={() => setShowQuery(s => !s)}>{`<>`} Hide Query</button>}
                </div>
            </div>
            <div className="flex flex-col items-start mb-2">
                <div className="font-semibold tracking-tight">Object</div>
                <div className="w-full">
                    <Select
                        className="focus:outline outline-orange-500 text-sm" 
                        options={options}
                        placeholder={`Choose an object`}
                        // styles={{
                        //     control: (base) => ({
                        //         ...base,
                        //         // minHeight: "32px",
                        //         // height: "32px",
                        //     }),
                        //     valueContainer: (base) => ({
                        //         ...base,
                        //         // padding: "3px 6px",
                        //     }),
                        //     input: (base) => ({
                        //         ...base,
                        //         margin: 0,
                        //         padding: 0,
                        //     }),
                        //     indicatorsContainer: (base) => ({
                        //         ...base,
                        //         height: "32px",
                        //     }),
                        //     dropdownIndicator: (base) => ({
                        //         ...base,
                        //         padding: 0,
                        //         scale: 0.75
                        //     }),
                        //     clearIndicator: (base) => ({
                        //         ...base,
                        //         padding: "4px",
                        //     }),
                        //     indicatorSeparator: (base) => ({
                        //         ...base,
                        //         visibility: "hidden"
                        //     })
                        // }}
                    />
                </div>
            </div>
            <div className="mb-2">
                <div className="font-semibold tracking-tight">Select Fields</div>
                <div className="h-64 w-full border border-gray-400 rounded">
                    <div className="p-1 h-full relative overflow-hidden">
                        <div className="flex justify-between gap-2 mb-1">
                            <input type="text" className="border flex-1 px-3 py-1 text-sm border-gray-200 rounded focus:outline-2 outline-orange-500" value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)} placeholder="Search fields..."></input>
                            <button className="border border-gray-200 hover:border-orange-500 hover:text-orange-600 cursor-pointer rounded pl-3 pr-2 py-1 text-xs">Select All</button>
                        </div>
                        <div className="h-full w-full overflow-y-auto px-2">
                            {properties.length > 0 && 
                                properties.filter(p => !p.hidden && p.label.toLowerCase().includes(fieldFilter.toLowerCase()))
                                          .map(p => (
                                <div className="flex gap-2">
                                    <input type="checkbox" />
                                    <div className="text-xs font-bold">{p.label} <span>({p.type})</span></div>
                                </div>
                            ))}
                            {/* <div className="flex gap-2">
                                <input type="checkbox" />
                                <div className="text-xs font-bold">First Name <span>(string)</span></div>
                            </div>
                            <div className="flex gap-2">
                                <input type="checkbox" />
                                <div className="text-xs font-bold">Last Name <span>(string)</span></div>
                            </div>
                            <div className="flex gap-2">
                                <input type="checkbox" />
                                <div className="text-xs font-bold">Date of Birth <span>(string)</span></div>
                            </div>
                            <div className="flex gap-2">
                                <input type="checkbox" />
                                <div className="text-xs font-bold">Address <span>(string)</span></div>
                            </div> */}
                        </div>
                        {/* <div className="absolute h-24 w-full bg-red-300 bottom-0 left-0">

                        </div> */}
                    </div>
                </div>
            </div>
            <div className="mb-2 flex justify-between">
                <div className="font-semibold tracking-tight">Filters (Optional)</div>
                <button className="border border-gray-200 hover:border-orange-500 hover:text-orange-600 cursor-pointer rounded pl-3 pr-2 py-1 text-xs">+ Add Filter</button>
            </div>
            {showQuery && <div className="mb-2">
                <div>
                    <div className="font-semibold tracking-tight">Query (HubSpot API Format)</div>
                    <div className="bg-gray-200 rounded w-full h-64"></div>
                </div>
            </div>}
            <div className="absolute bottom-0 left-0 w-full px-3 pb-1">
                <button className="flex gap-2 w-full items-center border py-2 justify-center bg-orange-500 hover:bg-orange-600 rounded cursor-pointer text-white font-bold text-sm">
                    <FaPlay /> Run Query
                </button>
            </div>
        </div>
    );
}