import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUser } from "../../../hooks/use-user";
import type { AppState } from "../../../redux/app-state";
import { Role } from "../../../models/enums";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import { vacationSlice } from "../../../redux/vacation-slice";
import { store } from "../../../redux/store";
import { VacationCard } from "../../vacation-area/vacation-card/vacation-card";
import { VacationPagination } from "../../vacation-area/vacation-pagination/vacation-pagination";
import { VacationFilters, type VacationFilter } from "../../vacation-area/vacation-filters/vacation-filters";
import "./vacations.css";
import { NavLink } from "react-router-dom";

// Displays protected vacation cards with filters and pagination.
export function Vacations() {
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<VacationFilter>("all");
    const isLoggedin = useUser();
    const user = useSelector((state: AppState) => state.user);
    const vacations = useSelector((state: AppState) => state.vacations);
    const isAdmin = user?.roleId === Role.Admin;


    useEffect(() => {
        if (!isLoggedin) return;

        // Fetches vacations and stores them in Redux.
        async function loadVacations(): Promise<void> {
            try {
                const fetchedVacations = await vacationService.getAllVacations();
                store.dispatch(vacationSlice.actions.initVacations(fetchedVacations));
            }
            catch (error) {
                notify.error(error);
            }
        }

        loadVacations();
    }, [isLoggedin]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Selects matching vacations without changing the Redux array.
    const displayedVacations = vacations.filter(vacation => {
        if (filter === "liked") return vacation.isLiked === true;

        if (filter === "active" || filter === "upcoming") {
            const startDate = new Date(vacation.startDate);
            const endDate = new Date(vacation.endDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            if (filter === "active") return startDate <= today && endDate >= today;
            return startDate > today;
        }

        return true;
    });

    // Paginates the filtered results.
    const pageSize = 9;
    const totalPages = Math.ceil(displayedVacations.length / pageSize);
    const currentPage = Math.min(page, Math.max(1, totalPages));
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedVacations = displayedVacations.slice(startIndex, startIndex + pageSize);

    // Corrects the stored page when the result list shrinks.
    useEffect(() => {
        if (page !== currentPage) setPage(currentPage);
    }, [page, currentPage]);

    // Changes the filter and resets pagination.
    function handleFilterChange(selectedFilter: VacationFilter): void {
        setFilter(selectedFilter);
        setPage(1);
    }

    if (!isLoggedin) return null;

    return (
        <div className="Vacations">
            <h1>Vacations</h1>
            {isAdmin && (
                <NavLink to="/vacations/new">Add Vacation</NavLink>
            )}
            <VacationFilters selectedFilter={filter} onFilterChange={handleFilterChange} isAdmin={isAdmin} />


            <div className="VacationList">
                {paginatedVacations.map(v => (<VacationCard key={v.vacationId} vacation={v} isAdmin={isAdmin} />))}
            </div>

            <VacationPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            {displayedVacations.length === 0 && <p>No vacations to display for this filter.</p>}
        </div>
    );
}