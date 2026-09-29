import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../hooks/use-admin";
import type { VacationModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import { VacationForm } from "../../vacation-area/vacation-form/vacation-form";
import "./edit-vacation.css";

// Reads the requested vacation ID and mounts its editor.
export function EditVacation() {
    const isAdmin = useAdmin();
    const { vacationId } = useParams();
    const id = Number(vacationId);

    if (!isAdmin) return null;
    if (!Number.isSafeInteger(id) || id <= 0) return <p>Invalid vacation ID.</p>;

    return <VacationEditor key={id} vacationId={id} />;
}

// Loads the existing vacation before displaying its form.
function VacationEditor({ vacationId }: { vacationId: number }) {
    const navigate = useNavigate();
    const [vacation, setVacation] = useState<VacationModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        // Fetches the vacation and ignores results after leaving the page.
        async function loadVacation(): Promise<void> {
            try {
                const result = await vacationService.getOneVacation(vacationId);
                if (!cancelled) setVacation(result);
            }
            catch (error) {
                if (!cancelled) {
                    setHasError(true);
                    notify.error(error);
                }
            }
            finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadVacation();
        return () => { cancelled = true; };
    }, [vacationId]);

    // Saves changes while preserving the old image if no replacement is sent.
    async function handleSave(data: FormData): Promise<void> {
        await vacationService.updateVacation(vacationId, data);
        navigate("/vacations");
    }

    if (isLoading) return <p>Loading vacation...</p>;
    if (hasError || !vacation) return <p>Could not load this vacation.</p>;

    return (
        <div className="EditVacation">
            <h1>Edit Vacation</h1>
            <VacationForm vacation={vacation} onSave={handleSave} />
        </div>
    );
}