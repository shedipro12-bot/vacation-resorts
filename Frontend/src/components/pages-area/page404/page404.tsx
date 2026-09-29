import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./page404.css";

// Explains a missing route and helps travelers return to a working page.
export function Page404() {
    const video = useRef<HTMLVideoElement>(null);
    const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Respects motion preferences, including changes while the page is open.
    useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => {
            setReducedMotion(preference.matches);
            if (preference.matches) video.current?.pause();
        };
        preference.addEventListener("change", update);
        return () => preference.removeEventListener("change", update);
    }, []);

    return (
        <section className="Page404" aria-labelledby="missing-page-title">
            <span className="Page404Code">404 · OFF THE MAP</span>
            <h1 id="missing-page-title">This page drifted off course.</h1>
            <p>The link may be outdated, or the address might have a typo. Let’s get you back to your next getaway.</p>
            <video ref={video} className="Page404Video" width="640" height="360" autoPlay={!reducedMotion} muted playsInline controls preload="metadata" poster="/media/lost-at-sea-poster.png" aria-label="A small sailboat searches for its route at sea. Decorative four-second animation, without audio.">
                <source src="/media/lost-at-sea.mp4" type="video/mp4" />
                Your browser cannot play this animation. Use the links below to continue.
            </video>
            <div className="Page404Actions">
                <NavLink to="/vacations" className="Button Button--accent">Explore vacations</NavLink>
                <NavLink to="/sign-in" className="Button Button--secondary">Sign in</NavLink>
            </div>
        </section>
    );
}
