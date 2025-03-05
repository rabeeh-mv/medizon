import React, { useState } from 'react'
// import { auth, db, createUserWithEmailAndPassword,  } from '../firebase/firebaseConfig'
import { useNavigate } from 'react-router-dom'

import { createUserWithEmailAndPassword , updateProfile} from "firebase/auth";
import {  doc, setDoc } from "firebase/firestore";

const SignUp = () => {

    const navigate =useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const hadleSignUp = async (e) => {
        e.preventDefault();
        setError("")
        setSuccess("")


        try{
            const userCredential=await createUserWithEmailAndPassword(auth, email, password)
            const user=userCredential.user


            await updateProfile(user,{displayName:username})


            await setDoc(doc(db, "user", user.uid),{
                uid:user.uid,
                username:username,
                email:email,
                createdAt: new Date()
            })
            navigate("/login")

            setSuccess("accoun created successfully!")
        }catch(err){
            setError(err.message)
        }


    }




    return (
        <div className='login-form  max-w-96 px-10 py-12 m-auto ring-1 ring-btnclr1 isolate aspect-video  w-96 backdrop-blur-sm rounded-xl bg-white/40 shadow-lg ring-1 ring-black/5'>
            <h1 className='text-3x1 font-bold text-btnclr1 '>Sign Up</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-red-500">{success}</p>}

            <form onSubmit={hadleSignUp}>
                <input
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className='bg-btnclr1/10 placeholder-black text-black w-full mt-1.5 mb-1.5 h-10 rounded-lg pl-2.5 pt-1.5 pb-1.5'
                />

                <input
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='bg-btnclr1/10 placeholder-black text-black w-full mt-1.5 mb-1.5 h-10 rounded-lg pl-2.5 pt-1.5 pb-1.5'
                />

                <input
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='bg-btnclr1/10 placeholder-black text-black w-full mt-1.5 mb-1.5 h-10 rounded-lg pl-2.5 pt-1.5 pb-1.5'
                />



                <button
                    type='submit'
                    className='text-white font-bold bg-gradient-to-r from-btnclr to-btnclr1 h-12 rounded-xl w-full mt-1.5 hover:shadow-md '>Login</button>
            </form>
        </div>
    )
}

export default SignUp 