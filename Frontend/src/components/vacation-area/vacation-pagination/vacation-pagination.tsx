type VacationPaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

// Displays page controls and reports page changes to the parent.
export function VacationPagination(props: VacationPaginationProps) {
    if (props.totalPages <= 1) return null;

    return (
        <nav className="VacationPagination" aria-label="Vacation pages">
            <button
                type="button"
                disabled={props.currentPage === 1}
                onClick={() => props.onPageChange(props.currentPage - 1)}
            >
                Previous
            </button>

            <span>
                Page {props.currentPage} of {props.totalPages}
            </span>

            <button
                type="button"
                disabled={props.currentPage === props.totalPages}
                onClick={() => props.onPageChange(props.currentPage + 1)}
            >
                Next
            </button>
        </nav>
    );
}