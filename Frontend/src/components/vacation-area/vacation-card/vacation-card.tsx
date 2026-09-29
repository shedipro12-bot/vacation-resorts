import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { VacationModel } from "../../../models/vacation-model";
import { likeService } from "../../../services/like-service";
import { vacationService } from "../../../services/vacation-service";
import { store } from "../../../redux/store";
import { vacationSlice } from "../../../redux/vacation-slice";
import { notify } from "../../../utils/notify";
import "./vacation-card.css";

type VacationCardProps = {
    vacation: VacationModel;
    isAdmin: boolean;
};

// Displays one vacation with controls based on the user's role.
export function VacationCard(props: VacationCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { vacation, isAdmin } = props;

    // Saves the like change to the backend, then updates Redux.
    async function handleLike(): Promise<void> {
        if (isSaving) return;

        setIsSaving(true);
        try {
            const nextIsLiked = !vacation.isLiked;

            if (nextIsLiked) {
                await likeService.addLike(vacation.vacationId);
            }
            else {
                await likeService.removeLike(vacation.vacationId);
            }

            store.dispatch(vacationSlice.actions.updateUserLike({
                vacationId: vacation.vacationId,
                isLiked: nextIsLiked
            }));
        }
        catch (error) {
            notify.error(error);
        }
        finally {
            setIsSaving(false);
        }
    }

    // Confirms deletion, deletes on the backend, then removes the Redux entry.
    async function handleDelete(): Promise<void> {
        if (isDeleting) return;
        if (!window.confirm(`Delete the vacation to ${vacation.destination}?`)) return;

        setIsDeleting(true);
        try {
            await vacationService.deleteVacation(vacation.vacationId);
            store.dispatch(vacationSlice.actions.deleteVacation(vacation.vacationId));
        }
        catch (error) {
            notify.error(error);
        }
        finally {
            setIsDeleting(false);
        }
    }

    return (
        <article className="VacationCard">
            <img src={vacation.imageUrl} alt={vacation.destination} loading="lazy" />

            <div className="CardBody">
                <h2>{vacation.destination}</h2>
                <p className="CardDescription">{vacation.description}</p>

                <p className="CardDates">
                    {new Date(vacation.startDate).toLocaleDateString("en-GB")}
                    {" — "}
                    {new Date(vacation.endDate).toLocaleDateString("en-GB")}
                </p>

                <p className="CardPrice">{vacation.price.toFixed(2)}</p>

                <div className="CardFooter">
                    <div className="CardActions">
                        {isAdmin ? (
                            <>
                                <NavLink to={`/vacations/edit/${vacation.vacationId}`}>Edit</NavLink>
                                <button type="button" className="DeleteButton" onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </>
                        ) : (
                            <button type="button" className={vacation.isLiked ? "LikedButton" : ""} onClick={handleLike} disabled={isSaving} aria-pressed={vacation.isLiked === true}>
                                {isSaving ? "Saving..." : vacation.isLiked ? "♥ Unlike" : "♡ Like"}
                            </button>
                        )}
                    </div>

                    <p className="CardLikes">{vacation.likesCount ?? 0} likes ❤️</p>
                </div>
            </div>
        </article>
    );
}