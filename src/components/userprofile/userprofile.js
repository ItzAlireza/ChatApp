import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase-config";
export function UserProfile() {
  //State's
  const [loading, setLoading] = useState(true);
  const { uid } = useParams();
  const [username, setUsername] = useState("");
  const [pPicture, setPPicture] = useState("");
  //Getting data once page is called
  useEffect(() => {
    setLoading(true);
    showProfile();
    setLoading(false);
  }, []);
  //Functions
  //  -Fetch username and avatar_url and setting its states
  async function showProfile() {
    const { data, err } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid);
    if (err) throw err;
    setUsername(data[0].username);
    setPPicture(data[0].avatar_url);
  }

  return (
    <>
      <div className="profileBackButton">
        <Link to="/">
          <p>Back</p>
        </Link>
      </div>
      <div className="profileContainer">
        <div className="profilePicture">
          {pPicture !== "" && <img src={pPicture}></img>}
          {pPicture == "" && <span></span>}
        </div>
        <div className="profileUsername">{username}</div>
      </div>
    </>
  );
}
