import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase-config";

export function Profile() {
  const navigate = useNavigate();
  //State's
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [pPicture, setPPicture] = useState("");

  const [updateUsername, setUpdateUsername] = useState("");
  const [updatePicture, setUpdatePicture] = useState(null);
  const [invalidUpdatedCred, setInvalidUpdatedCred] = useState(false);
  const [updateType, setUpdateType] = useState(0);

  //Getting data once page is called
  useEffect(() => {
    setLoading(true);
    showProfile();
    setLoading(false);
  }, []);
  //Functions
  //
  async function updateData(
    u = updateUsername,
    a = updatePicture,
    check = invalidUpdatedCred
  ) {
    if (!check) {
      if (u.length >= 3 && (a === null || a === "")) {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .update({ username: u })
          .match({ id: supabase.auth.user().id });
        if (error) {
          throw error;
          return;
        }
        const { dat, err } = await supabase
          .from("chats")
          .update({ username: u })
          .match({ user_id: supabase.auth.user().id });
        if (error) {
          throw error;
          return;
        }
        setLoading(false);
      }
      if (u.length < 3 && !(a === null || a === "")) {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .update({ avatar_url: a })
          .match({ id: supabase.auth.user().id });
        if (error) {
          throw error;
          return;
        }
        setLoading(false);
      }
      if (u.length >= 3 && !(a === null || a === "")) {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .update({ username: u, avatar_url: a })
          .match({ id: supabase.auth.user().id });
        if (error) {
          throw error;
          return;
        }
        const { dat, err } = await supabase
          .from("chats")
          .update({ username: u })
          .match({ user_id: supabase.auth.user().id });
        if (error) {
          throw error;
          return;
        }
        setLoading(false);
      }
    }
    navigate("/");
    return;
  }
  //  -Fetch username and avatar_url and setting its states
  async function showProfile() {
    const { data, err } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabase.auth.user().id);
    if (err) throw err;
    setUsername(data[0].username);
    setPPicture(data[0].avatar_url);
  }
  //  -Send the updated profile data
  return (
    <>
      <div className="profileBackButton">
        <Link to="/">
          <p>Back</p>
        </Link>
      </div>
      <div className="profileContainerOwn">
        <div className="profilePictureOwn">
          {pPicture !== "" && <img src={pPicture}></img>}
          {pPicture == "" && <span></span>}
        </div>
        <div className="profileUsernameOwn">{username}</div>
        <div className="usernameChangeSetting">
          <label>Change Username</label>
          <input
            type="text"
            placeholder={username}
            onChange={(e) => {
              setUpdateUsername(e.target.value);
            }}
          />
        </div>
        <div className="avatarChangeSetting">
          <label>Change avatar (Insert Url)</label>
          <input
            type="text"
            onChange={(e) => {
              setUpdatePicture(e.target.value);
            }}
          />
          <button
            onClick={() => {
              updateData();
            }}
          >
            {!loading && "Save"}
            {loading && <div className="loader" />}
          </button>
        </div>
        <div></div>
      </div>
    </>
  );
}
