import React from "react";
import Navbar from "../components/Navbar/Navbar";
import "./Layout.css";
import AppFooter from "../components/AppFooter";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="layout">
    <Navbar />
    <div className="content">{children}</div>

    <AppFooter/>
  </div>
);

export default Layout;
