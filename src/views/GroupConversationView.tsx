import { ReactElement, useEffect, useState, useRef } from "react";
import GroupMessageComposerView from "./GroupMessageComposerView.tsx";
import { fetchGroupMessages, sendGroupMessage, fetchGroupConversations, fetchInboxId, sendGroupMedia } from "../services/groupService";
import { useWebSocket } from "../hooks/useWebSocket";
import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import { Conversation, DecodedMessage } from "@xmtp/mls-client";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useAccount } from "wagmi";
import { shortAddress } from "../util/shortAddress.ts";
// import { formatTime } from "../util/formatTime"; // A utility to format timestamps
// import image

export default function GroupConversationView({ params }: any): ReactElement {
    const { groupId } = useParams();
    const { address } = useAccount();
    const [messages, setMessages] = useState<DecodedMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inboxId, setInboxId] = useState("")
    const [group, setGroup] = useState<Conversation | null>();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const { newGroupMessage } = useWebSocket();

    // Scroll to the bottom whenever a new message is added
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Fetch inboxId
    useEffect(() => {
        const fetchInboxData = async () => {
            const res = await fetchInboxId(address);
            console.log(res)
            setInboxId(res);

        };
    if(address)
        fetchInboxData();
    }, [address]);

    // Fetch group messages and details
    useEffect(() => {
        const fetchGroupData = async () => {
            const groupConversations = await fetchGroupConversations(address);
            const conversation = groupConversations.find((conv: Conversation) => conv.id === groupId);
            setGroup(conversation);

            const groupMessages = await fetchGroupMessages(address, groupId);
            setMessages(groupMessages);
            setIsLoading(false);
        };
        fetchGroupData();
    }, [address, groupId]);

    // Update messages when a new message arrives
    useEffect(() => {
        // Notification
        if(newGroupMessage && newGroupMessage.sender !== address){
            toast.custom((t) => (
                <div
                  className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
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
                          {newGroupMessage.groupName || shortAddress('0x'+newGroupMessage.groupId)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                        {shortAddress(newGroupMessage.sender)}: {newGroupMessage.content}
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
              ));
        }
        // State updation
        console.log(groupId);
        console.log(newGroupMessage);
        if (newGroupMessage && newGroupMessage.conversationId === groupId) {
            console.log("messages", messages);
            console.log("newGroupMessage", newGroupMessage);
            setMessages((prevMessages) => [...prevMessages, newGroupMessage]);
        }
    }, [newGroupMessage, groupId]);

    const handleSendMessage = async (messageContent: string) => {
        await sendGroupMessage(address, groupId, messageContent);
    };

    const handleSendMedia = async (file: File) => {
        await sendGroupMedia(groupId, file);
    };

    return (
        <>
            <Toaster />
            <div className="flex flex-col h-screen">
                <Header>
                    <div className="flex justify-between font-bold p-4">
                        
                        <span>{group?.name || `Group Chat ${shortAddress('0x' + group?.id)}`}</span>
                        <Link className="text-blue-700" to="/group">Go Back</Link>
                    </div>
                </Header>

                <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
                    {isLoading ? (
                        <div className="text-center text-gray-500">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-gray-500">No messages yet.</div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-2 flex ${message.senderInboxId === inboxId ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`p-3 rounded-lg shadow ${message.senderInboxId === inboxId ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                                >
                                    <p className="text-sm">
                                        <strong>{shortAddress('0x' + message.senderInboxId)}</strong>
                                    </p>
                                    <p className="text-sm mt-1">{message.content.toString()}</p>
                                    <span className="text-xs text-gray-400">{new Date(message.sentAt).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messageEndRef} />
                </div>

                <GroupMessageComposerView onSendMessage={handleSendMessage} onSendMedia={handleSendMedia} />
            </div>
        </>
    );
}
