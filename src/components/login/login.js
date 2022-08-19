import { useState } from "react";
import { supabase } from "../../supabase-config";
import { Link } from "react-router-dom";
import ErrMsg from "../errmsg/errmsg";
export function Login() {
  const [loading, setLoading] = useState(false);
  const [User, setUser] = useState("");
  const [session, setSession] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [invalCred, setInvalCred] = useState(false);
  async function signin(email, pass) {
    setLoading(true);
    const { user, error } = await supabase.auth.signIn({
      email: email,
      password: pass,
    });
    if (error.status === 400) {
      setLoading(false);
      setInvalCred(true);
      return;
    }
    setInvalCred(false);
    setLoading(false);
  }
  return (
    <>
      <div className="UpperSignUp">
        <div className="SignUp">
          <div className="form-SignUp">
            <span className="SignUpTitle">Sign In</span>
            <div className="input-label">E-mail</div>
            <input
              placeholder="E-Mail"
              type="E-mail"
              onChange={(e) => setMail(e.target.value)}
            />
            <div className="input-label">Password</div>
            <input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {invalCred && <ErrMsg c="Invalid credentials!" />}
            <button
              onClick={() => {
                signin(mail, password);
              }}
            >
              <div>
                {!loading && "Signin"}
                {loading && <div className="loader" />}
              </div>
            </button>
            <div className="loginsignuplink">
              Don't have an account? <Link to="signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
