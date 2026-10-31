import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Logout, selectJob, updateRecordNumber } from "@/app/features/jobSlice";
import { addImageName, imageUrl } from "@/app/features/imageSlice";
import logo from './../../pages/signup/GREENERACETECHNOLOGIES.png'
export default function Header() {
  const { user } = useSelector((state) => state.job);
  const adminLogin=localStorage.getItem('adminLogin')
  console.log(user)
  // console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <header className="shadow sticky z-50 top-0 mb-1">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-1 h-15">
        <div className="flex flex-wrap justify-between items-center  max-w-screen-xl h-10">
          <Link to="/" className="flex items-start">
            <img
            src={logo}
              className="h-10 rounded-full"
              alt="Logo"
            height='50px'
            />
            {/* <span className="font-bold text-3xl text-san">
              MS <span className="text-red-500">BPO </span>{" "}
          </span> */}
          </Link>

          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                {/* <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                  }
                >
                  File
                </NavLink> */}
              </li>
              <li>
                {/* <NavLink
                  to="/help"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                  }
                >
                  Help
                </NavLink> */}
              </li>
              <li>
                {adminLogin ? (
                  <span className="capitalize">{localStorage.getItem('adminLogin')}</span>
                ) : (
                  <NavLink
                    to="/sign-up"
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"
                      } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                    }
                  >
                    Sign Up
                  </NavLink>
                )}
              </li>
              {adminLogin && (
                <button
                  onClick={() => {
                    localStorage.clear()
                    navigate("/");
                    dispatch(Logout([]));
                    dispatch(updateRecordNumber(""))
                    dispatch(addImageName(""));
                    dispatch(imageUrl(""));
                    dispatch(selectJob(""));
                  }}
                  className="border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0"
                >
                  {" "}
                  Logout
                </button>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
