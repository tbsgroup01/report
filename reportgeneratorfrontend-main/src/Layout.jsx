import React from "react";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import StateRestoration from "./components/StateRestoration/StateRestoration";

function Layout() {
  return (
    <StateRestoration>
      {/* <Header /> */}
      <Outlet />
    </StateRestoration>
  );
}

export default Layout;
