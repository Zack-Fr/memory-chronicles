import React from 'react'
import Input from '../components/Buttons/Buttons'

export default function MessageBoardPage() {
    return (
        <div>
            <h1>Write Your Chronicle</h1>
            <Input type= "textarea" placeholder = "Start typing..."></Input>
            <button> Send</button>
        </div>
    )
}