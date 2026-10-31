import React from 'react'
import error from '../../assets/error.png'
import { useLocation } from 'react-router-dom';

const SuspendedPage = () => {
    const {state}=useLocation()
    console.log(state,'mgggdgdg')
    const reasons = [
        "The page you are looking for might have been removed.",
        "The page you are looking for is temporarily unavailable.",
        " You are blocked by admin ",
        "Internal Server Error",
        "You are Not Allowed to  Login",
        "Your Login Session has been expired "

    ];


    const getRandomReason = () => {
        return reasons[Math.floor(Math.random() * reasons.length)];
    };
    return (
        // <div className='h-[100vh] flex flex-col items-center justify-center gap-5'>
        //     {/* <div className=' rounded-full bg-gray-200 flex justify-center items-center'> */}
        //     <img src={error} alt="" className='h-80' />
        //     <span className='p-10 font-bold text-5xl text-white'>Error : 404</span>
        //     {/* </div> */}
        //     {/* <p className='font-medium text-3xl capitalize text-gray-400'>page not found</p> */}
        // </div>





        <div id="notfound" className="flex items-center h-screen bg-gray-100">
            <div className="container mx-auto">
                <div className="max-w-md mx-auto">
                    <div className="text-center">
                        <div className="text-9xl font-bold text-gray-700">Oops!</div>
                        <h2 className=" mt-5 text-4xl font-medium mb-8">{state}</h2>
                        <p className="text-lg text-gray-700 mb-8">
                            {getRandomReason()}
                            {/* The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. */}
                        </p>
                        <a href="/" className="btn-primary">Go To Homepage</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuspendedPage