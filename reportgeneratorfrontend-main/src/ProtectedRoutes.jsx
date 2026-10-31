import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ Component }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const login = localStorage.getItem("login");
        // console.log(login);
        if (login !== "true") navigate("/");
    }, []);
    return (
        <div>
            <Component />
        </div>
    );
};

export default ProtectedRoutes;