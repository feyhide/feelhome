import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth' 
import { app } from '../firebase'
import {useDispatch,useSelector} from 'react-redux'
import { signinFailure, signinStart, signinSuccess } from '../redux/user/userSlice'

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {url} = useSelector(state=>state.user)

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res = await fetch(`/api/v1/auth/google`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            dispatch(signinSuccess(data));
            //navigate('/home')
            //console.log(data);
        } catch (error) {
            console.error(`Could not sign in with Google: ${error}`);
        }
    };

    return (
        <button onClick={handleGoogleClick} type='button' className='gap-2 flex items-center justify-center bg-slate-200 border border-white bg-opacity-60 backdrop-blur-xl h-10 transition-all ease text-black rounded-lg uppercase w-[70%] '>
            <div className='w-9 h-full relative'><img className='w-full h-full object-contain' src='/googleicon.png'/></div>
            <p>Continue With Google</p>
        </button>
    );
};

export default OAuth;
