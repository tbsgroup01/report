import axios from "axios";
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import logo from './msbpotechlogo.png'
import {useDispatch} from "react-redux";
import {selectJob, setUserDetails, updateRecordNumber} from "@/app/features/jobSlice";
import {baseUrl} from "@/baseUrl";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import bg1 from '../../../src/assets/carouselimages/bg1.jpg'
import bg2 from '../../../src/assets/carouselimages/bg2.webp'
import bg3 from '../../../src/assets/carouselimages/bg3.webp'
import bg4 from '../../../src/assets/carouselimages/bg4.jpg'
import bg5 from '../../../src/assets/carouselimages/bg5.jpg'

import {ArrowLeft} from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your login logic here, for example, send the email and password to your server
        // console.log("Email:", email);
        // console.log("Password:", password);


        axios.post(
            `${baseUrl}api/v1/user/login`,
            {
                email,
                password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        ).then((res) => {
            console.log(res, 'myloginrepsose')
            localStorage.setItem('adminLogin', res?.data?.message)
            localStorage.setItem('reportModel', res?.data?.data?.reportModel)

            localStorage.setItem("login", "true");
            dispatch(setUserDetails(res.data.data));
            if (res.data.data.role === "admin") {
                navigate("/admin");
            } else {
                // Use accessLevel for consistency (lowercase values)
                const jobValue = res?.data?.data?.accessLevel || res?.data?.data?.reportModel?.toLowerCase();
                sessionStorage.setItem("job", jobValue);
                sessionStorage.setItem("userId", res?.data?.data?._id);
                sessionStorage.setItem("isFreezed", res?.data?.data?.isFreezed || false);
                dispatch(selectJob(jobValue));
                dispatch(updateRecordNumber("REC01"))

                navigate("/home");
            }


        }).catch(res => {
            const errMsg = res?.response?.data?.message;
            if (errMsg === "either email or password is incorrect" || errMsg === "user not found") {
                navigate("/error");
            } else {
                console.log(res?.response, 'ressss');
                navigate("/suspended", {state: errMsg});
            }
        });

        // console.log(res);

    };

    return (
        <>
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-green-800 to-emerald-700 p-4">
                <div
                    className="w-full max-w-6xl grid md:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl bg-opacity-30 backdrop-blur-xl">
                    {/* Left Section */}
                    <div className="relative hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-700/40 to-green-900/90 z-10" />

                        {/* Carousel background */}
                        <Swiper
                            modules={[Autoplay]}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            loop={true}
                            className="absolute inset-0 w-full h-full z-0"
                        >
                            <SwiperSlide>
                                <img src={bg1} className="w-full h-full object-cover" alt="Slide 1" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={bg2} className="w-full h-full object-cover" alt="Slide 2" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={bg3} className="w-full h-full object-cover" alt="Slide 3" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={bg4} className="w-full h-full object-cover" alt="Slide 4" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={bg5} className="w-full h-full object-cover" alt="Slide 5" />
                            </SwiperSlide>
                        </Swiper>

                        <div className="relative z-20 p-8 h-full flex flex-col justify-end text-white">
                            <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
                            <p className="max-w-sm mb-4 text-white/70">
                                Welcome to Greenerace Technologies — your trusted partner for efficient and scalable outsourcing solutions.
                            </p>
                            <button
                                onClick={() => {
                                    window.location.assign('https://greeneracetechnologies.com/');
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded shadow"
                            >
                                Go To Website
                            </button>
                        </div>
                    </div>


                    {/* Right Section */}
                    <div className="p-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center">
                        <div className="w-full max-w-md">
                            <h2 className="text-white text-3xl font-bold mb-6 text-center">SIGN IN</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Email or User Name"
                                        className="w-full p-3 rounded bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="Password"
                                        className="w-full p-3 rounded bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded bg-gradient-to-r bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-semibold shadow-lg"
                                >
                                    Submit
                                </button>
                                <div className="flex justify-center space-x-4 pt-4">
                                    <a href="#" className="text-white hover:text-emerald-300">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="text-white hover:text-emerald-300">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" className="text-white hover:text-emerald-300">
                                        <i className="fab fa-pinterest"></i>
                                    </a>
                                </div>
                                <p className="text-sm text-center text-white/70 mt-6">
                                    Don't have an account?{' '}
                                    <Link to="/sign-up" className="text-white font-semibold hover:text-emerald-300">Sign
                                        Up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default LoginPage;
