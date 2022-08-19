import { useEffect, useState, Router } from "react";
import "./App.css";
import { supabase } from "./supabase-config";
import ChatBox from "./components/chatbox/chatbox";
import SignUp from "./components/signup/signup";
import ErrMsg from "./components/errmsg/errmsg";
import { Login } from "./components/login/login";

function App() {
  const [session, setSession] = useState();
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return <>{!session ? <Login /> : <ChatBox session={session} />}</>;
}
export default App;
