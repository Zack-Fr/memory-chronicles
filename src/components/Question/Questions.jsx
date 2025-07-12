import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Question.module.css';

export default function Question() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const primaryQuestion =
    'What would you write your future self that only your future self can read?'

    const altQuestion = 'Hmm… maybe think of one small memory you never want to forget?'

    return (
        <div className = {styles.container}>
        <h1 className = {styles.title}> Welcome! </h1>
        <p className = {styles.question}>
            {step === 0 ? primaryQuestion : altQuestion}
        </p>
        
        <div className= {styles.actions}>
            {step === 0 ? (
                <>
                <button className = {styles.secondaryBtn} onClick={() => setStep(1)}
                    >I don't get it! </button>

                    <button className = {styles.primaryBtn} onClick = {()=> navigate('/write')}
                    > write my first Chronicle </button>
                    </>
            ) : (

                <button className = {styles.primaryBtn} onClick={()=> navigate('/write')}
                > Okay, let's write </button>
            )}
            
        </div>
        </div>
    )
}