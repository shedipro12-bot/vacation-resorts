import { VacationModel } from "../../../models/vacation-model";
import "./vacation-card.css";

type VacationCardProps = {
    vacation: VacationModel
    isAdmin: boolean

}
export function VacationCard(props: VacationCardProps) {
    return (

        <div className="VacationCard">

            <img src={props.vacation.imageUrl} alt={props.vacation.description} />
            <h2>Destination✈️: {props.vacation.destination}</h2>
            <p>{props.vacation.description}</p>
            <p>Vacation Period:🕛{props.vacation.startDate} to {props.vacation.endDate}</p>
            <p> Price:💵 {props.vacation.price.toFixed(2)}</p>
            {props.isAdmin ? (
                <>
                {/* come back to this */}
                console.log(props.vacation.price, typeof props.vacation.price);
                    <button>Edit</button>
                    <button>Delete</button>
                </>
            ) :
                <button type="button">{props.vacation.isLiked ? "Unlike" : "Like"}</button>
            }
            <p>Likes: {props.vacation.likesCount}</p>


        </div>
    );
}
