import React from "react";
import Navbar from "../components/Navbar/Navbar";
import "./Layout.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="layout">
    <Navbar />
    <div className="content">{children}</div>
  </div>
);

export default Layout;
