import { ReactElement, useState } from "react";
import ConversationListView from "./ConversationListView";
// import GroupsListView from "./GroupsListView";
import { useClient, useSetClient } from "../hooks/useClient";
import { shortAddress } from "../util/shortAddress";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useDisconnect } from "wagmi";
import socketClient from "socket.io-client";

export default function HomeView(): ReactElement {

  // const SERVER = "http://localhost:8080";
  // const socket = socketClient(SERVER);
  // socket.on('connection', () => {
  //   console.log(`I'm connected with the back-end`);
  // });
  // socket.on('msgfound', (data) => {
  //   console.log(`I've got new chats`,data);
  // });
  // socket.onAny(()=>console.log("jai siyaram"))

  const client = useClient()!;
  const [copied, setCopied] = useState(false);
  const [activeChat, setActiveChat] = useState("single");

  function copy() {
    navigator.clipboard.writeText(client.address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const { disconnectAsync } = useDisconnect();
  const setClient = useSetClient();
  async function logout() {
    await disconnectAsync();
    indexedDB.deleteDatabase("DB");
    localStorage.removeItem("_insecurePrivateKey");
    setClient(null);
  }

  return (
    <div className="p-4 pt-14">
      <Header>
        <div className="flex justify-between">
          <div>
            Hi {shortAddress(client.address)}{" "}
            <button className="text-xs text-zinc-600" onClick={copy}>
              {copied ? "Copied Address!" : "Copy Address"}
            </button>
          </div>
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </Header>
      <small className="flex justify-between">
        <span><button onClick={() => setActiveChat("single")}>Chats</button></span>
        <span><button onClick={() => setActiveChat("group")}>Groups</button></span>
      </small>
      {
        activeChat === "group" ? "<GroupsListView/>" : <ConversationListView />
      }

    </div>
  );
}
