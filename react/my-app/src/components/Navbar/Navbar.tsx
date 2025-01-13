import React from "react";
import { Menu, Dropdown, Avatar, Switch } from "antd";
import { Link } from "react-router-dom";
import {  UserOutlined } from "@ant-design/icons";
import "./Navbar.css"; // Add styling here

const Navbar: React.FC = () => {
  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Link to="/logout">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      {/* Logo and Branding */}
      <div className="navbar-logo">
        <Link to="/" className="brand-name">
          DataVizTool
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/visualize">Visualize</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/help">Help</Link>
      </div>

      {/* Right Side Controls */}
      <div className="navbar-controls">
        {/* Theme Switch */}
        <div className="theme-toggle">
          <Switch checkedChildren="🌙" unCheckedChildren="☀️" />
        </div>

        {/* User Profile */}
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="profile-avatar"
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
