import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import GroupConversationCellView from "./GroupConversationCellView";
import { useAccount, useSignMessage } from "wagmi";
import { Toaster, toast } from 'react-hot-toast';
import { Conversation } from "@xmtp/mls-client";
import { registerWithClient, fetchGroupConversations, fetchGroupMessages } from "../services/groupService";
import { Button, Typography } from "@mui/material";

export default function GroupsListView(): ReactElement {
  const [groups, setGroups] = useState<Conversation[]>([]);
  const { newGroup, newGroupMessage } = useWebSocket();
  // const { newGroup, newGroupMessage } = useLatestGroupMessages();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [toggled, setToggled] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  //   const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(
  //     window.localStorage.getItem("readReceiptsEnabled") === "true"
  //   );

  useEffect(() => {
    const fetchGroups = async () => {
      if (address) {
        const conversations = await fetchGroupConversations(address);
        setGroups(conversations);
        if (conversations) setIsRegistered(true);
      }
    };
    fetchGroups();
  }, [address, toggled]);

  useEffect(() => {
    if (newGroup) {
      setGroups((prevGroups) => [...prevGroups, newGroup]);
    }
  }, [newGroup]);

  useEffect(() => {
    if (newGroupMessage) {
      toast(
        (t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                    Emilia Gates
                  </p>
                  <p className="mt-1 text-sm dark:text-gray-300 text-gray-500">
                    Sure! 8:30pm works great!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l dark:border-zinc-700 border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        )
      );
    }
  }, [newGroupMessage]);

  return (
    <>
      <Toaster />
      <div>
        {groups?.length === 0 ? (
          <Typography variant="body1" className="dark:text-gray-300 text-gray-700">
            No group conversations yet.
          </Typography>
        ) : (
          groups?.map((group) => (
            <GroupConversationCellView key={group.id} conversation={group} />
          ))
        )}
      </div>
      {
        !isRegistered &&
        <div>
          <Button onClick={() => setToggled(!toggled)} variant="contained" className="my-4">Toggle</Button>
          <Button
            onClick={() => toast.promise(
              registerWithClient(address, signMessageAsync),
              {
                loading: 'Please Wait... Regsistering Client',
                success: () => {
                  setIsRegistered(true);
                  return <b>Successfully registered!</b>;
                },
                error: (err) => <b>Error registering Client: {err.message}{console.log(err)}</b>,
              }
            )}
            variant="contained"
            className="mb-4"
          >
            Register Client
          </Button>
        </div>
      }
    </>
  );
}
