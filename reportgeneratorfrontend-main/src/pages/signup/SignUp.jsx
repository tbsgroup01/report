import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "@/baseUrl";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

import bg1 from '../../../src/assets/carouselimages/bg1.jpg';
import bg2 from '../../../src/assets/carouselimages/bg2.webp';
import bg3 from '../../../src/assets/carouselimages/bg3.webp';
import bg4 from '../../../src/assets/carouselimages/bg4.jpg';
import bg5 from '../../../src/assets/carouselimages/bg5.jpg';

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${baseUrl}api/v1/user/register`, {
        name,
        email,
      });

      alert("Registered successfully, contact admin");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-green-800 to-emerald-700 p-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl bg-opacity-30 backdrop-blur-xl">
          {/* Left Section */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-700/40 to-green-900/90 z-10" />
            <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                className="absolute inset-0 w-full h-full z-0"
            >
              <SwiperSlide><img src={bg1} className="w-full h-full object-cover" alt="Slide 1" /></SwiperSlide>
              <SwiperSlide><img src={bg2} className="w-full h-full object-cover" alt="Slide 2" /></SwiperSlide>
              <SwiperSlide><img src={bg3} className="w-full h-full object-cover" alt="Slide 3" /></SwiperSlide>
              <SwiperSlide><img src={bg4} className="w-full h-full object-cover" alt="Slide 4" /></SwiperSlide>
              <SwiperSlide><img src={bg5} className="w-full h-full object-cover" alt="Slide 5" /></SwiperSlide>
            </Swiper>
            <div className="relative z-20 p-8 h-full flex flex-col justify-end text-white">
              <h1 className="text-4xl font-bold mb-4">Join Us!</h1>
              <p className="max-w-sm mb-4 text-white/70">
                Sign up now to become part of Greenerace Technologies — where innovation meets excellence.
              </p>
              <button
                  onClick={() => window.location.assign('https://greeneracetechnologies.com/')}
                  className="px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded shadow"
              >
                Go To Website
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center">
            <div className="w-full max-w-md">
              <h2 className="text-white text-3xl font-bold mb-6 text-center">SIGN UP</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full p-3 rounded bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                  />
                </div>
                <div>
                  <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full p-3 rounded bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                  />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 rounded bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-semibold shadow-lg"
                >
                  Create Account
                </button>
                <p className="text-sm text-center text-white/70 mt-6">
                  Already have an account?{" "}
                  <Link to="/" className="text-white font-semibold hover:text-emerald-300">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SignUpPage;
