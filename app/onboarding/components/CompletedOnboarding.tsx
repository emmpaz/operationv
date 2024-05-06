import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { _onboardingComplete } from "../../utils/supabase/actions/general.actions";
import Link from "next/link";



export const CompletedOnboarding = () => {
    const {user, userHandler} = useContext(AuthContext)!;
    const controls = useAnimation();
    const [showButton, setShowButton] = useState(false);

    const router = useRouter();

    const [currentPhrase, setCurrentPhrase] = useState(0);


    const phrases = [
        "Congrats! You have completed the onboarding process",
        "Now you can access your dashboard and start applying to opportunities!"
    ]

    useEffect(() => {
        const sequence = async () => {
            await controls.start({opacity: 1, y:0, transition: {duration: .8}});
            await controls.start({opacity: 0, y: -50, transition: {delay:  2, duration: .6}});

            if(currentPhrase === phrases.length - 1){
                await _onboardingComplete(user.id);
                userHandler({
                    ...user,
                    completed_onboarding: true
                })
            }else{
                await controls.start({opacity: 0, y: -50, transition: {
                    delay: .5, duration: .6
                }});
                setCurrentPhrase((prev) => (prev + 1) % phrases.length);
            }
            
        };
        

        sequence();
    }, [controls, currentPhrase]);

    return(
        <div className="flex flex-col items-center justify-center h-screen text-primary">
            <motion.div
                initial={{opacity: 0, y: 50}}
                animate={controls}
                className="text-4xl font-bold text-center"
            >
                {phrases[currentPhrase]}
            </motion.div>
        </div>
    )
}