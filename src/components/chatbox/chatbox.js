import Message from "../message/message";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../supabase-config";
import { getDefaultNormalizer } from "@testing-library/react";
import { SideBar } from "../sidebar/sidebar";
import { FaBars, FaTimes } from "react-icons/fa";
import userEvent from "@testing-library/user-event";
import { Link } from "react-router-dom";
import { scroller } from "react-scroll";
import { wait } from "@testing-library/user-event/dist/utils";

const ChatBox = ({ session }) => {
  //State's
  const [loading, setLoading] = useState(true); //Loading is for not showing data when fethcing it
  const [messages, setMessages] = useState([]); //Messages that are fetched
  const [message, setMessage] = useState(""); //Your message in your input
  const [show, setShow] = useState(false); //Showing Sidebar
  const [username, setUsername] = useState(""); //Username for sender

  const [todayDate, setTodayDate] = useState();
  const ref = useRef();
  const scroll = document.getElementById("scrollToEnd");
  const today = new Date();
  //useEffecs
  //  -Getting users username for submitting a message
  //  -Getting messages
  useEffect(() => {
    setLoading(true);
    getContent();
    getUsername();
    setTodayDate(today.toISOString());
    setLoading(false);
  }, []);
  //Functions
  //  -
  const scrol = () => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };
  async function getUsername() {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", supabase.auth.user().id);
    setUsername(data[0].username);
  }

  //  -setting css for the message(being sent or received)
  function checkForSender(a) {
    if (a === supabase.auth.user().id) {
      return ["mSent", "uE"];
    }
    return ["mReceived", "u"];
  }

  //  -sign out function
  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  //  -sending message to database with username on them
  async function sendMessage({
    msg = message,
    usrid = supabase.auth.user().id,
    user_name = username,
  }) {
    const { data, error } = await supabase
      .from("chats")
      .insert([{ content: msg, user_id: usrid, username: user_name }]);
    if (error) {
      alert(error.message);
      return;
    }
    setMessage("");
  }

  //  -Getting messages
  async function getContent() {
    const { data, error } = await supabase
      .from("chats")
      .select()
      .order("created_at", { ascending: true });
    if (error) throw error;
    setMessages(data);
    setTimeout(() => {
      scrol();
    }, 200);
  }

  //  -Real-time part of the application
  const mySubscription = supabase
    .from("chats")
    .on("*", (payload) => {
      getContent();
    })
    .subscribe();

  //Html part
  return (
    <>
      <div className="header">
        <span className="app-title">ChatApp</span>
        <div className="header-icon">
          <FaBars
            color="white"
            size={30}
            onClick={() => {
              setShow(!show);
            }}
          />
          <div className={show ? "sidebar-upper toggle" : "sidebar-upper"}>
            <div className="icon">
              <FaTimes
                size={40}
                color="white"
                onClick={() => {
                  setShow(!show);
                }}
              />
            </div>
            <div className="sidebar">
              <p>
                <span>
                  <Link to="/profile">Profile</Link>
                </span>
              </p>
              <p>
                <span>Settings</span>
              </p>
              <p>
                <span onClick={signOut}>SignOut</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mUpperContainer">
        <div className="mContainer">
          {loading ? (
            <span className="mLoadingMsg">Loading...</span>
          ) : (
            messages.map((m) => {
              const mday = m.created_at.substring(5, 10);
              return (
                <>
                  <Message
                    key={m.time}
                    uid={m.user_id}
                    user={m.username}
                    content={m.content}
                    css={checkForSender(m.user_id)}
                    time={mday + " " + m.created_at.substring(11, 16)}
                  />
                </>
              );
            })
          )}
          <div className="scrollToEnd" id="scrollToEnd" ref={ref} />
        </div>
      </div>

      <div className="sendMsgDiv">
        <input
          value={message}
          type="text"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button
          onClick={() => {
            sendMessage(message);
            /*scrol();*/
          }}
        >
          {!loading && "Send"}
          {loading && <div className="loader" />}
        </button>
      </div>
      {!loading && <div></div>}
    </>
  );
};
export default ChatBox;
