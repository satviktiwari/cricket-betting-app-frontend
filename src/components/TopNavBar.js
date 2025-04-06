import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons/lib";
import { IconButton } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import '../styles/navbar.css';
import logo from '../styles/pp_logo.jpg';

// Define SidebarData directly in this file
const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
  },
  {
    title: "My Predictions",
    path: "/my-predictions",
    icon: <FaIcons.FaRegFutbol />
  },
  {
    title: "Chat",
    path: "/chat",
    icon: <IoIcons.IoIosChatboxes />,
  },
  {
    title: "Team Data",
    path: "/team-data",
    icon: <FaIcons.FaFolder />,
  },
  {
    title: "IPL 2025",
    path: "/ipl-2025",
    icon: <FaIcons.FaTrophy />,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <FaIcons.FaUser />,
  },
  {
    title: "News",
    path: "/news",
    icon: <FaIcons.FaNewspaper />,
  },
  {
    title: "Terms & Conditions",
    path: "/terms-and-conditions",
    icon: <AiIcons.AiFillFileText />,
  }
];

const Nav = styled.nav`
  background: linear-gradient(145deg, #1e1e2f, #2a2a40);
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const NavIcon = styled(Link)`
  font-size: 2rem;
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #632ce4;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: linear-gradient(145deg, #1e1e2f, #2a2a40);
    padding: 20px;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
  }
`;

const NavItemIcon = styled.span`
  margin-right: 10px;
`;

const NavItemText = styled.span`
  font-size: 1rem;
`;

const LogoutButton = styled(IconButton)`
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const Hamburger = styled.div`
  display: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export default function TopNavbar({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");

    // Update loggedInUser state
    setLoggedInUser(null);

    // Redirect to login page
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // If the user is not logged in, do not render the navbar
  if (!loggedInUser) {
    return null;
  }

  return (
    <IconContext.Provider value={{ color: "#fff" }}>
      <Nav>
        {/* Logo or Brand Name */}
        <NavIcon to="#">
          <img className="navbar-logo" src={logo} alt="logo" />
        </NavIcon>

        {/* Hamburger Menu Icon */}
        <Hamburger onClick={toggleMenu}>
          {isOpen ? <AiIcons.AiOutlineClose /> : <FaIcons.FaBars />}
        </Hamburger>

        {/* Navigation Menu */}
        <NavMenu isOpen={isOpen}>
          {SidebarData.map((item, index) => (
            <NavItem to={item.path} key={index} onClick={() => setIsOpen(false)}>
              <NavItemIcon>{item.icon}</NavItemIcon>
              <NavItemText>{item.title}</NavItemText>
            </NavItem>
          ))}
        </NavMenu>

        {/* Logout Button */}
        <LogoutButton onClick={handleLogout}>
          <ExitToApp />
        </LogoutButton>
      </Nav>
    </IconContext.Provider>
  );
}