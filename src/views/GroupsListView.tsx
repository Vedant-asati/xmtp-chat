import { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import GroupConversationCellView from "./GroupConversationCellView";
import { io } from 'socket.io-client';
import {
  configureChains,
  createClient,
  WagmiConfig,
  useSignMessage,
  useAccount,
  useDisconnect,
} from "wagmi";
import { Toaster, toast } from 'react-hot-toast';
import { toBytes } from 'viem';
import { Conversation } from "@xmtp/mls-client";

import { registerWithClient, fetchGroupConversations, fetchGroupMessages } from "../services/groupService";
import { useLatestMessages } from "../hooks/useLatestMessages";
// import { useLatestGroupMessages } from "../hooks/useLatestGroupMessages";

const socket = io('http://localhost:3000'); // Replace with your backend URL

export default function GroupsListView(): ReactElement {
  const [groups, setGroups] = useState<Conversation[]>([]);
  const { newGroup, newGroupMessage } = useWebSocket();
  // const { newGroup, newGroupMessage } = useLatestGroupMessages();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [toggled, setToggled] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      console.log("calling conv", address)
      const conversations = await fetchGroupConversations("0xafC55278246Ba557F639fA3A297EAeDe772Cf49C");
      console.log("done")
      setGroups(conversations);
    };
    fetchGroups();
  }, [toggled]);

  useEffect(() => {
    if (newGroup) {
      setGroups((prevGroups) => [...prevGroups, newGroup]);
    }
  }, [newGroup]);

  useEffect(() => {
    if (newGroupMessage) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Emilia Gates
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Sure! 8:30pm works great!
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ))
    }
  }, [newGroupMessage]);

  return (
    <>
      <Toaster />
      <button onClick={() => setToggled(!toggled)}>Toggle</button>
      <div>
        <div><button onClick={() => toast.promise(
          registerWithClient(address, signMessageAsync),
          {
            loading: 'Please Wait... Regsistering Client',
            success: <b>Successfully registered!</b>,
            error: (err) => <b>Error registering Client: {err.message}{console.log(err)}</b>,
          }
        )}>Register a Client</button></div>
        {groups?.length === 0 && <p>No group conversations yet.</p>}
        {groups?.map((group) => (
          <Link to={`group/${group.id}`} key={group.id}>
            <GroupConversationCellView key={group.id} conversation={group}
            // latestMessage={latestMessage}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
