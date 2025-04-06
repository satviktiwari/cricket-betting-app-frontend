import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import TeamData from "./components/TeamData";
import TournamentsTab from "./components/TournamentsTab";
import Login from "./components/Login";
import Profile from "./components/Profile";
import News from "./components/News";
import Chat from "./components/Chat";
import styled from "styled-components";
import TopNavBar from "./components/TopNavBar";
import TermsAndConditions from "./components/TermsAndConditions";
import MyPredictions from "./components/MyPredictions";

// Styled component for the main content area
const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  padding-top: 80px; /* Add padding-top to account for the TopNavBar height */
  margin-left: 0; /* No margin needed since the sidebar is fixed */
`;

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Check if the user is logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {/* Conditionally render the TopNavBar */}
      {loggedInUser && <TopNavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />}
      {/* Main content area */}
      <MainContent>
        <Routes>
          <Route path="/" element={loggedInUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={loggedInUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/team-data" element={loggedInUser ? <TeamData /> : <Navigate to="/login" />} />
          <Route path="/ipl-2025" element={loggedInUser ? <TournamentsTab /> : <Navigate to="/login" />} />
          <Route path="/profile" element={loggedInUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
          <Route path="/news" element={loggedInUser ? <News /> : <Navigate to="/login" />} />
          <Route path="/chat" element={loggedInUser ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/terms-and-conditions" element={loggedInUser ? <TermsAndConditions /> : <Navigate to="/login" />} />
          <Route path="/my-predictions" element={loggedInUser ? <MyPredictions /> : <Navigate to="/login" />} />
        </Routes>
      </MainContent>
    </div>
  );
}