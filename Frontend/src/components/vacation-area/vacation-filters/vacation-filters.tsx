import "./vacation-filters.css";

export type VacationFilter = "all" | "liked" | "active" | "upcoming";

type VacationFiltersProps = {
    selectedFilter: VacationFilter;
    onFilterChange: (filter: VacationFilter) => void;
    isAdmin: boolean;
};

// Displays filter buttons and reports the selected filter to the parent.
export function VacationFilters(props: VacationFiltersProps) {
    return (
        <div className="VacationFilters">
            <button
                type="button"
                onClick={() => props.onFilterChange("all")}
                aria-pressed={props.selectedFilter === "all"}
            >
                All
            </button>

            {!props.isAdmin && (
                <button
                    type="button"
                    onClick={() => props.onFilterChange("liked")}
                    aria-pressed={props.selectedFilter === "liked"}
                >
                    My Likes
                </button>
            )}

            <button
                type="button"
                onClick={() => props.onFilterChange("active")}
                aria-pressed={props.selectedFilter === "active"}
            >
                Active Now
            </button>

            <button
                type="button"
                onClick={() => props.onFilterChange("upcoming")}
                aria-pressed={props.selectedFilter === "upcoming"}
            >
                Not Started
            </button>
        </div>
    );
}