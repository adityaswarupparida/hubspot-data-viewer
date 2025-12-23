import { StylesConfig } from "react-select";

export const selectStyles: StylesConfig = {
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
}; 