"use client"
import { FaPlay } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CRMObjectProperty } from "./DataTable";
import { useState } from "react";
import Select from 'react-select';
import { selectStyles } from "./styles/reactSelect";

type FilterRule = {
    field: string;
    operator: number;
    value: string;
}

export const QueryBuilder = ({ properties }: { 
    properties:  CRMObjectProperty[]
}) => {
    const [showQuery, setShowQuery] = useState<boolean>(false);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [fieldFilter, setFieldFilter] = useState<string>("");
    const [filters, setFilters] = useState<FilterRule[]>([]);

    const options = [
        { value: 'contacts', label: 'Contacts' },
        { value: 'carts', label: 'Carts' }
    ]
    const operatorOptions = [
        { id: 1, value: 'EQ', label: 'equals to' },
        { id: 2, value: 'NEQ', label: 'not equals to' },
        { id: 3, value: 'GT', label: 'greater than' },
        { id: 4, value: 'GTE', label: 'greater than or equal to' },
        { id: 5, value: 'LT', label: 'less than' },
        { id: 6, value: 'LTE', label: 'less than or equal to' },
    ]

    const addFilter = () => {
        setFilters(prev => [
            ...prev,
            { field: "", operator: 0, value: "" }
        ]);
    };

    const updateFilter = (index: number, patch: Partial<FilterRule>) => {
        setFilters(prev => 
            prev.map((f, idx) => 
                idx === index ? {...f, ...patch} : f
            )
        );
    };

    const removeFilter = (index: number) => {
        setFilters(prev => prev.filter((_, idx) => idx !== index));
    }

    return (
        <div className="py-2 mx-auto w-full h-full relative">
            <div className="px-3 text-lg mb-2 flex justify-between">
                <div className="tracking-tighter font-semibold">
                    Query Builder
                </div>
                <div>
                    {!showQuery && <button className="border border-gray-200 cursor-pointer rounded hover:border-orange-500 hover:text-orange-600 pl-2 pr-2 py-1 text-xs" onClick={() => setShowQuery(s => !s)}>{`<>`} Show Query</button>}
                    {showQuery && <button className="border border-gray-200 cursor-pointer rounded hover:border-orange-500 hover:text-orange-600 pl-2 pr-2 py-1 text-xs" onClick={() => setShowQuery(s => !s)}>{`<>`} Hide Query</button>}
                </div>
            </div>
            <div className="px-3 flex flex-col items-start mb-2">
                <div className="font-semibold tracking-tight">Object</div>
                <div className="w-full">
                    <Select
                        components={{ IndicatorSeparator: null }}
                        className={`text-sm`}
                        classNames={{ 
                            control: () => `min-h-8 h-8`,
                            // valueContainer: () => `p-0`,
                            // input: () => `p-0 text-sm`,
                            indicatorSeparator: () => `hidden`,
                            // menu: () => `p-0`,
                            // menuList: () => `p-0`,
                            // option: (state) => `p-0 text-sm
                            // ${state.isFocused ? `bg-orange-100`: ``}
                            // ${state.isSelected ? `bg-orange-200`: ``}
                            // `
                        }} 
                        options={options}
                        placeholder={`Choose an object`}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                minHeight: "32px",
                                height: "32px",
                                boxShadow: "none",
                                border: state.isFocused ? `1px solid oklch(70.5% 0.213 47.604)`: base.border,
                                outline: state.isFocused ? `1px solid oklch(70.5% 0.213 47.604)`: base.outline,
                                ":hover": {
                                    borderColor: `oklch(70.5% 0.213 47.604)`
                                }
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                padding: "3px 6px",
                            }),
                            input: (base) => ({
                                ...base,
                                margin: 0,
                                padding: "0 2px",
                            }),
                            indicatorsContainer: (base) => ({
                                ...base,
                                height: "32px",
                            }),
                            dropdownIndicator: (base) => ({
                                ...base,
                                padding: "0 2px",
                                scale: 0.75
                            }),
                            clearIndicator: (base) => ({
                                ...base,
                                padding: "4px",
                            }),
                            // indicatorSeparator: (base) => ({
                            //     ...base,
                            //     visibility: "hidden"
                            // }),
                            option: (base, state) => ({
                                ...base,
                                padding: "4px 8px",
                                backgroundColor: state.isSelected ? `oklch(70.5% 0.213 47.604)` :
                                                state.isFocused ? `oklch(98% 0.016 73.684)` : `white`,
                                ":active": {
                                    backgroundColor: state.isSelected ? `oklch(70.5% 0.213 47.604)` : `oklch(98% 0.016 73.684)`,
                                },
                            })
                        }}
                    />
                </div>
            </div>
            <div className="px-3 mb-2">
                <div className="font-semibold tracking-tight">Select Fields</div>
                <div className="h-64 w-full border border-gray-300 rounded">
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
                                    <input type="checkbox" className="accent-orange-300"/>
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
            <div className="mb-2 overflow-hidden">
                <div className="px-3 flex justify-between mb-1">
                    <div className="font-semibold tracking-tight">Filters (Optional)</div>
                    <button className="border border-gray-200 hover:border-orange-500 hover:text-orange-600 cursor-pointer rounded pl-3 pr-2 py-1 text-xs" onClick={addFilter}>+ Add Filter</button>
                </div>
                <div className="px-3 max-h-24 overflow-y-auto scrollbar-hover">
                    {filters.length > 0 &&
                        filters.map((f, index) => (
                    
                        <div key={index} className="flex justify-between items-center py-1">
                            <div className="flex justify-between gap-2 text-xs">
                                <Select
                                    className="w-32"
                                    backspaceRemovesValue={false}
                                    components={{ DropdownIndicator: null , IndicatorSeparator: null }}
                                    // controlShouldRenderValue={false}
                                    hideSelectedOptions={false}
                                    isClearable={false}
                                    onChange={(newValue: any) => { 
                                        console.log(newValue);
                                        updateFilter(index, { field: newValue.value } ) 
                                    }}
                                    options={options}
                                    placeholder="First Name"
                                    styles={selectStyles}
                                    // tabSelectsValue={false}
                                    value={options.find(op => op.value === f.field) ?? ``}
                                />
                                <Select
                                    className="w-24"
                                    // autoFocus
                                    backspaceRemovesValue={false}
                                    components={{ DropdownIndicator: null , IndicatorSeparator: null }}
                                    // controlShouldRenderValue={false}
                                    hideSelectedOptions={false}
                                    isClearable={false}
                                    onChange={(newValue: any) => updateFilter(index, { operator: newValue.id })}
                                    options={operatorOptions}
                                    placeholder="equals to"
                                    styles={selectStyles}
                                    // tabSelectsValue={false}
                                    value={!f.operator ? ``: operatorOptions[f.operator - 1]}
                                />
                                <input type="text" placeholder="John"
                                    className="border w-28 border-gray-300 p-2 rounded focus:outline-1 hover:border-orange-500 outline-orange-500"
                                    value={f.value}
                                    onChange={(e) => updateFilter(index, { value: e.target.value })} 
                                />
                            </div>
                            <RiDeleteBin5Line className="text-gray-400 cursor-pointer hover:text-red-600" scale={1.25} onClick={() => removeFilter(index)}/>
                        </div>
                        
                        ))
                    }
                </div>
            </div>
            {showQuery && <div className="mb-2 px-3">
                <div>
                    <div className="font-semibold tracking-tight">Query (HubSpot API Format)</div>
                    <div className="bg-gray-200 rounded w-full h-60"></div>
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