import { supabase } from "../../supabase-config";
import { Link } from "react-router-dom";

function Message({ user, content, css, uid, time }) {
  supabase.auth.user().id == uid ? (user = "You") : (user = user);
  return (
    <div className={css[1]}>
      <div className={css[0]}>
        {css === "mSent" ? (
          ""
        ) : (
          <div className="msgUser">
            {user === "You" ? user : <Link to={"u/" + uid}>{user}</Link>}
          </div>
        )}
        {content}
        <div className="msgTime">{time}</div>
      </div>
    </div>
  );
}
export default Message;
