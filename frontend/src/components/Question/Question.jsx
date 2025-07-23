import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Question.module.css';



export default function Question() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [visible ,setVisible] = useState(true);

    const questions = [

        'What would you write your future self that only your future self can read?',
        'hmmm...maybe think of one small memory you want to keep or a goal you want to achieve?',
        'Still stuck? What’s the happiest tiny moment you experienced this week?'
    ]

    const handleNegative = () =>{
        //fade out, then advance step
        setVisible(false)
        // advance to next question, but not past the last index
        setTimeout(() => {
            setStep(prev => Math.min(prev+1, questions.length -1))   
        }, 300)
    }

    const handlePositive = () => {
        //fade out, then navigate 
        setVisible(false)
        setTimeout(() => {
        navigate('/write')
        },300)
    }
        //whenever step changes, fade back in 
        useEffect(()=>{
            setVisible(true)
        },[step])
            

    return (
        <div className = {styles.container}>
        <h1 className = {styles.title}> Welcome! </h1>

        <p className = {`${styles.question} ${!visible ? styles.hidden : ''}`}>{questions[step]}
        </p>
        
        <div className= {styles.actions}>
            {step < questions.length -1 ? (
                <>
                <button className = {styles.secondaryBtn} onClick={handleNegative}
                    >Tell me more!</button>

                <button className = {styles.primaryBtn} onClick = {handlePositive}
                > {step === 0 ? 'Write my first Chronicle' : 'Okay, lets write!'}</button>
                </>
            ) : (
                <button className = {styles.primaryBtn} onClick={handlePositive}
                > Okay, let's write </button>
            )}
        </div>
        </div>
    )
}
            
