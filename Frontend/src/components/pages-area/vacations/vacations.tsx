import { useSelector } from "react-redux";
import { useUser } from "../../../hooks/use-user";
import { AppState } from "../../../redux/app-state";
import { Role } from "../../../models/enums";
import { VacationCard } from "../../vacation-area/vacation-card/vacation-card";
import "./vacations.css";
import { useEffect } from "react";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import { vacationSlice } from "../../../redux/vacation-slice";
import { store } from "../../../redux/store";
// Displays the vacation list to logged-in users and admins.
export function Vacations() {
    const isLoggedin = useUser();
    const user = useSelector((state: AppState) => state.user);
    // Reads the vacation array from Redux.
    const vacations = useSelector((state: AppState) => state.vacations);
    const isAdmin = user?.roleId === Role.Admin;
    useEffect(() => {
        if (!isLoggedin) return;
        //Fetch vaaction and store them into redux
        async function loadVacations() {
            try {
                const vacations = await vacationService.getAllVacations();
                store.dispatch(vacationSlice.actions.initVacations(vacations))
            }
            catch (error) {
                notify.error(error);
            }
        }
        loadVacations();
    }, [isLoggedin])

    return (
        <div className="Vacations">
            {vacations.map(v => (<VacationCard key={v.vacationId} vacation={v} isAdmin={isAdmin} />))}
        </div>
    );
}