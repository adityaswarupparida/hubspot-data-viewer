"use client"
import { FaPlay } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CRMObjectProperty } from "./DataTable";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { selectStyles } from "./styles/reactSelect";
import { LoadProperties } from "../utils";
import { Spinner } from "./Spinner";
import { useQuery } from "../hooks/useQuery";

type FilterRule = {
    propertyName: string;
    operator: string;
    value: string | string[];
}

export type FilterGroup = {
    filters: FilterRule[];
}

export type Query = {
    objectType: string;
    properties: string[];
    filterGroups: FilterGroup[];
    limit: number;
}

export const QueryBuilder = ({ objects }: {
    objects: any[], 
}) => {

    const { columns, setColumns, selectedObject, setSelectedObject, query, setQuery, run, setRun } = useQuery();
    const [properties, setProperties] = useState<CRMObjectProperty[]>([]);
    const [showQuery, setShowQuery] = useState<boolean>(false);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [fieldFilter, setFieldFilter] = useState<string>("");
    const [filters, setFilters] = useState<FilterRule[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const MAX_VISIBLE = 8;
    const QUERY_LIMIT = 100;
    const options = !properties.length ? [] : 
        properties.map(p => ({ value: p.name, label: p.label}));
    
    const objectOptions = !objects.length ? [
        { value: 'carts', label: 'Carts' },
        { value: 'contacts', label: 'Contacts' },
        { value: 'companies', label: 'Companies' },
        { value: 'deals', label: 'Deals' },
        { value: 'invoices', label: 'Invoices' },
        { value: 'line_items', label: 'Line Items' },
        { value: 'orders', label: 'Orders' },
        { value: 'products', label: 'Products' },
        { value: 'tickets', label: 'Tickets' }
    ] : objects.map(o => ({ value: o.name, label: o.labels.plural }));
    
    const operatorOptions = [
        { value: 'EQ', label: 'equals to' },
        { value: 'NEQ', label: 'not equals to' },
        { value: 'GT', label: 'greater than' },
        { value: 'GTE', label: 'greater than or equal to' },
        { value: 'LT', label: 'less than' },
        { value: 'LTE', label: 'less than or equal to' },
    ]

    const addFilter = () => {
        const filter: FilterRule = { 
            operator: "", 
            propertyName: "", 
            value: "" 
        };
        
        const group = 0 // for now, there is one group i.e groupIndex = 0
        setQuery(prev => ({
            ...prev,
            filterGroups: prev?.filterGroups ? 
                (prev?.filterGroups).map((grp, grpIdx) => 
                    grpIdx !== group ? 
                    grp : {
                        ...grp,
                        filters: [...grp.filters, filter ]
                    }
                ) : [{ filters: [filter] }]
        }))
        setFilters(prev => [
            ...prev,
            filter
        ]);
    };

    const updateFilter = (index: number, patch: Partial<FilterRule>) => {
        setFilters(prev => 
            prev.map((f, idx) => 
                idx === index ? {...f, ...patch} : f
            )
        );

        const group = 0 // for now, there is one group i.e groupIndex = 0
        setQuery(prev => {
            if (!prev || !prev.filterGroups) return prev;

            // console.log('fg', prev.filterGroups);
            // console.log('fgg', prev.filterGroups[group].filters);
            return {
                ...prev,
                filterGroups: prev.filterGroups.map((grp, grpIdx) => 
                    grpIdx !== group ? 
                    grp : {
                        ...grp,
                        filters: grp.filters.map((f, idx) =>
                            idx === index ? 
                            {...f, ...patch} : f
                        )
                    })
            }            
        });
    };

    const removeFilter = (index: number) => {
        if (filters.length == 1){
            setQuery(prev => {
                if (!prev) return prev;
                const { filterGroups, ...rest } = prev;
                return rest;
            })
        }
        setFilters(prev => prev.filter((_, idx) => idx !== index));
    }
    
    useEffect(() => {
        if (!selectedObject.trim().length) return;
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        const loadProperties = async () => {
            const response = await LoadProperties(token, selectedObject);
            if (!response) return;
            setProperties(response);
            setLoading(false);
        }

        const newQuery: Partial<Query> = { objectType: selectedObject, properties: [], limit: QUERY_LIMIT };
        setFilters([]);
        setColumns([]);
        setQuery(newQuery);
        if (selectAll)
            setSelectAll(s => !s)
        loadProperties();
    }, [selectedObject]);

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
                            indicatorSeparator: () => `hidden`,
                            // option: (state) => `p-0 text-sm
                            // ${state.isFocused ? `bg-orange-100`: ``}
                            // ${state.isSelected ? `bg-orange-200`: ``}
                            // `
                        }} 
                        options={objectOptions}
                        placeholder={`Choose an object`}
                        onChange={(newValue: any) => { 
                            console.log(newValue);
                            setSelectedObject(newValue.value);
                        }}
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
                            <button className="border border-gray-200 hover:border-orange-500 hover:text-orange-600 cursor-pointer rounded pl-3 pr-2 py-1 text-xs"
                                onClick={() => {
                                    if (!selectAll) {
                                        setColumns(properties);
                                        setQuery(prev => ({
                                            ...prev, 
                                            properties: properties.map(p => p.name)
                                        }));
                                        setSelectAll(true);
                                    } else {
                                        setColumns([]);
                                        setQuery(prev => ({
                                            ...prev, 
                                            properties: []
                                        }));
                                        setSelectAll(false);
                                    }
                                }}
                            >
                                {selectAll ? `Deselect All` : `Select All`}
                            </button>
                        </div>
                        <div className="h-full w-full overflow-y-auto px-2">
                            {!loading && properties.length > 0 && 
                                properties.filter(p => !p.hidden && p.label.toLowerCase().includes(fieldFilter.toLowerCase()))
                                          .map(p => (
                                <div key={p.name}>
                                    <label className="flex gap-2">
                                        <input type="checkbox" value={p.name} className="accent-gray-200" checked={columns.includes(p)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setColumns(prev => [...prev, p])
                                                    setQuery(prev => ({
                                                        ...prev, 
                                                        properties: [...(prev?.properties ?? []), p.name]
                                                    }));
                                                } else {
                                                    setColumns(prev => prev.filter(c => c.name !== p.name ))
                                                    setQuery(prev => ({
                                                        ...prev, 
                                                        properties: (prev?.properties ?? []).filter(pr => pr !== p.name)
                                                    }));
                                                }
                                            }}
                                        />
                                        <div className="text-xs font-bold">{p.label} <span className="text-gray-500 font-semibold">({p.type})</span></div>
                                    </label>
                                </div>
                            ))}
                            {loading && 
                                <div className="flex justify-center items-center h-4/5">
                                    <Spinner size="sm" />
                                </div>
                            }
                        </div>
                        {columns.length > 0 && (
                            <div className="absolute max-h-24 w-full bg-white px-1 py-2 bottom-0 left-0 flex flex-wrap gap-1 wrap-normal">
                                {columns.slice(0, MAX_VISIBLE).map((s, index) => (
                                    <div key={index} className="bg-gray-200 rounded-lg px-2 text-xs">{s.label}</div>
                                ))}
                                {columns.length - MAX_VISIBLE > 0 && (
                                    <div className="bg-gray-200 rounded-lg px-2 text-xs">+{Math.min(columns.length - MAX_VISIBLE, 10)}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mb-2 overflow-hidden">
                <div className="px-3 flex justify-between mb-1">
                    <div className="font-semibold tracking-tight">Filters (Optional)</div>
                    <button className="border border-gray-200 hover:border-orange-500 hover:text-orange-600 cursor-pointer rounded pl-3 pr-2 py-1 text-xs" onClick={addFilter}>+ Add Filter</button>
                </div>
                <div className="overflow-y-auto max-h-96 scrollbar-hover">
                    <div className="px-3">
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
                                            updateFilter(index, { propertyName: newValue.value } ) 
                                        }}
                                        options={options}
                                        placeholder="First Name"
                                        styles={selectStyles}
                                        // tabSelectsValue={false}
                                        value={options.find(op => op.value === f.propertyName) ?? ``}
                                    />
                                    <Select
                                        className="w-24"
                                        // autoFocus
                                        backspaceRemovesValue={false}
                                        components={{ DropdownIndicator: null , IndicatorSeparator: null }}
                                        // controlShouldRenderValue={false}
                                        hideSelectedOptions={false}
                                        isClearable={false}
                                        onChange={(newValue: any) => updateFilter(index, { operator: newValue.value })}
                                        options={operatorOptions}
                                        placeholder="equals to"
                                        styles={selectStyles}
                                        // tabSelectsValue={false}
                                        value={operatorOptions.find(op => op.value === f.operator) ?? ``}
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
                    {showQuery && <div className="mt-2 mb-3 px-3">
                        <div className="overflow-hidden">
                            <div className="font-semibold tracking-tight">Query (HubSpot API Format)</div>
                            <div className="bg-gray-100 text-black font-mono rounded w-full max-h-60 overflow-auto px-6 py-4 text-xs whitespace-pre-wrap">
                                {query && JSON.stringify(query, null, 2)}
                                {!query && ``}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full px-3 pb-2">
                <button className="flex gap-2 w-full items-center border py-2 justify-center bg-orange-500 hover:bg-orange-600 disabled:bg-orange-600/30 disabled:cursor-not-allowed rounded cursor-pointer text-white font-bold text-sm"
                    onClick={() => setRun(true)}
                    disabled={run || !selectedObject}
                >
                    {!run && <div className="flex gap-2 items-center tracking-tight"><FaPlay /> Run Query</div> }
                    {run && <Spinner size="xs" /> }
                </button>
            </div>
        </div>
    );
}