import { useState } from "react";

const Filters = ({
    filters = [],
    values = {},
    onChange,
    onApply,
    onClear,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (name, value) => {
        if (onChange) {
            onChange(name, value);
        }
    };

    const renderFilter = (filter) => {
        const commonClasses =
            "w-full h-9 px-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition";

        const value = values[filter.name] ?? "";
        console.log(filter)   
        switch (filter.type) {
            case "select":
                return (
                    <select
                        id={filter.name}
                        name={filter.name}
                        value={value}
                        onChange={(e) =>
                            handleChange(filter.name, e.target.value)
                        }
                        className={commonClasses}
                    >
                        <option value="">
                            {filter.allLabel || `All ${filter.label}`}
                        </option>

                        {filter.options?.map((option) => (
                            <option
                                key={option?.value ? option.value : option``.id}
                                value={option?.value ? option.value : option.id}
                            >
                                {option?.label ? option.label : option.name}
                            </option>
                        ))}
                    </select>
                );

            case "text":
                return (
                    <input
                        type="text"
                        id={filter.name}
                        name={filter.name}
                        value={value}
                        placeholder={
                            filter.placeholder ||
                            `Search by ${filter.label}...`
                        }
                        onChange={(e) =>
                            handleChange(filter.name, e.target.value)
                        }
                        className={commonClasses}
                    />
                );

            case "number":
                return (
                    <input
                        type="number"
                        id={filter.name}
                        name={filter.name}
                        value={value}
                        min={filter.min}
                        max={filter.max}
                        placeholder={
                            filter.placeholder ||
                            `Enter ${filter.label}...`
                        }
                        onChange={(e) =>
                            handleChange(filter.name, e.target.value)
                        }
                        className={commonClasses}
                    />
                );

            case "date":
                return (
                    <input
                        type="date"
                        id={filter.name}
                        name={filter.name}
                        value={value}
                        onChange={(e) =>
                            handleChange(filter.name, e.target.value)
                        }
                        className={commonClasses}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full bg-white dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-800/30 p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-1 text-xs">
            {/* Filter Header */}
            <div className="flex items-center justify-between px-4 py-3">

                <div>
                    <h3 className="font-semibold text-stone-800 dark:text-stone-100">
                        Filters
                    </h3>

                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        Filter results based on your requirements
                    </p>
                </div>

                <div className="flex items-center gap-2">

                    {/* Clear Button */}
                    {isOpen && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-gold-600 dark:text-stone-400 dark:hover:text-gold-400 transition-colors"
                        >
                            Clear All
                        </button>
                    )}

                    {/* Collapse / Expand */}
                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-expanded={isOpen}
                        aria-label={
                            isOpen
                                ? "Collapse filters"
                                : "Expand filters"
                        }
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-all"
                    >
                        <svg
                            className={`w-4 h-4 transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Filters Content */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">

                    <div className="px-4 pb-4 pt-1 border-t border-stone-200/40 dark:border-stone-800/30">

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

                            {filters.map((filter) => (
                                <div
                                    key={filter.name}
                                    className={filter.width || ""}
                                >
                                    <label
                                        htmlFor={filter.name}
                                        className="block mb-1.5 font-medium text-stone-700 dark:text-stone-300"
                                    >
                                        {filter.label}
                                    </label>

                                    {renderFilter(filter)}
                                </div>
                            ))}

                            {/* Apply Button */}
                           <div className="flex items-end">
                            <button
                            type="button"
                            onClick={onApply}
                            className="w-full h-9 px-4 rounded-lg bg-gold-600 hover:bg-gold-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                            Apply Filters
                            </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;