import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Login } from "./components/login/login";
import SignUp from "./components/signup/signup";
import { HashRouter, Routes, Route, Router } from "react-router-dom";
import { UserProfile } from "./components/userprofile/userprofile";
import { Profile } from "./components/profile/profile";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HashRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/u/:uid" element={<UserProfile />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </HashRouter>
);
