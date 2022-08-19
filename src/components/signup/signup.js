import { useEffect, useState } from "react";
import { supabase } from "../../supabase-config";
import ErrMsg from "../errmsg/errmsg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(null);
  const [mail, setMail] = useState(null);
  const [passwordChecked, setPasswordChecked] = useState("");
  const [showPMatch, setShowPMatch] = useState("");
  const [showPvMatch, setShowPvMatch] = useState(null);
  const [pMatchCss, setPMatchCss] = useState("ErrMsg");
  const [pReqCheck, setPReqCheck] = useState(null);
  const [pc, setPc] = useState(false);
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);

  let errMsgContent = "Passwords Don't Match.";
  let sucMsgContent = "Passwords Match.";
  useEffect(() => {
    if (passwordChecked === "") {
      setShowPvMatch(null);
      setShowPMatch("");
      return;
    }
    setShowPvMatch(true);
    password === passwordChecked
      ? setPMatchCss("SucMsg") && setPc(true)
      : setPMatchCss("ErrMsg") && setPc(false);

    setReady(pReqCheck && showPvMatch && pc);
  }, [passwordChecked]);

  useEffect(() => {
    if (password === "" || password === null) {
      setPReqCheck(null);
      return;
    }
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    password.length >= 8
      ? setPReqCheck(false)
      : setPReqCheck(true);
  }, [password]);

  useEffect(() => {
    if (username.length < 3) {
      setUsernameValid(false);
      return;
    }
    setUsernameValid(true);
  }, [username]);

  async function signUp(
    pccc = pc,
    email = mail,
    pass = password,
    uname = username,
    n = navigate
  ) {
    if (!pccc) {
      return "passwords didnt match, please check your passwords and try again.";
    }
    setLoading(true);
    const { user, error } = await supabase.auth.signUp(
      {
        email: email,
        password: pass,
      },
      {
        data: { user_name: uname },
      }
    );
    if (error) throw error;

    setLoading(false);
    n("/");
  }

  return (
    <div className="UpperSignUp">
      <div className="SignUp">
        <div className="form-SignUp">
          <span className="SignUpTitle">Sign Up Now!</span>
          <div className="input-label">E-mail</div>
          <input
            placeholder="E-Mail"
            type="E-mail"
            onChange={(e) => setMail(e.target.value)}
          />
          <div className="input-label">username</div>
          <input
            placeholder="Username"
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {!usernameValid && (
            <ErrMsg c="Username should be at least 3 characters" />
          )}
          <div className="input-label">Password</div>
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {pReqCheck && (
            <ErrMsg c="password should contain uppercase, lowercase and numbers (minimum 8)" />
          )}
          <div className="input-label">Confirm Password</div>
          <input
            placeholder="Confirm Password"
            type="password"
            onChange={(e) => {
              setPasswordChecked(e.target.value);
            }}
          />
          {showPvMatch && (
            <ErrMsg
              c={pMatchCss == "ErrMsg" ? errMsgContent : sucMsgContent}
              s={pMatchCss}
              v={showPvMatch}
            />
          )}
          {}
          <button onClick={signUp}>
            <div>
              {!loading && "SignUp"}
              {loading && <div className="loader" />}
            </div>
          </button>
          <div className="loginsignuplink">
            Already have an account? <Link to="/">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
