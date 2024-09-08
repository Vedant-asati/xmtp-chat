import { ReactElement, useEffect, useState } from "react";
import GroupMessageComposerView from "./GroupMessageComposerView.tsx";
import { fetchGroupMessages, sendGroupMessage, fetchGroupConversations, sendGroupMedia } from "../services/groupService";
import { useWebSocket } from "../hooks/useWebSocket";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { Conversation, DecodedMessage } from "@xmtp/mls-client";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

export default function GroupConversationView({ params }: any): ReactElement {
    const groupId = params.groupId;
    const [messages, setMessages] = useState<DecodedMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [group, setGroup] = useState<Conversation | null>();
    const { address } = useAccount();

    const { socket, newGroupMessage, newGroup } = useWebSocket();

    useEffect(() => {
        const fetchGroups = async () => {
            const conversations = await fetchGroupConversations(groupId);
            const conversation: Conversation | null = conversations.getConversationById(params.groupId);
            setGroup(conversation);
        };
        fetchGroups();
    }, []);

    useEffect(() => {
        async function fetchMessages() {
            const groupMessages = await fetchGroupMessages(address, groupId);
            setMessages(groupMessages);
            setIsLoading(false);
        }
        fetchMessages();
    }, [groupId]);

    // useEffect(() => {
    //     // if(newGroup)
    //     toast.custom((t) => (
    //         <div
    //             className={`${t.visible ? 'animate-enter' : 'animate-leave'
    //                 } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    //         >
    //             <div className="flex-1 w-0 p-4">
    //                 <div className="flex items-start">
    //                     <div className="flex-shrink-0 pt-0.5">
    //                         <img
    //                             className="h-10 w-10 rounded-full"
    //                             src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
    //                             alt=""
    //                         />
    //                     </div>
    //                     <div className="ml-3 flex-1">
    //                         <p className="text-sm font-medium text-gray-900">
    //                             Emilia Gates
    //                         </p>
    //                         <p className="mt-1 text-sm text-gray-500">
    //                             Sure! 8:30pm works great!
    //                         </p>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className="flex border-l border-gray-200">
    //                 <button
    //                     onClick={() => toast.dismiss(t.id)}
    //                     className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //                 >
    //                     Close
    //                 </button>
    //             </div>
    //         </div>
    //     ));
    // }, [newGroup])

    useEffect(() => {
        if (newGroupMessage && newGroupMessage.conversationId === groupId) {
            setMessages((prevMessages) => [...prevMessages, newGroupMessage]);
        }
    }, [newGroupMessage]);

    const handleSendMessage = async (message: string) => {
        await sendGroupMessage(address, groupId, message); // Sends message via API route
    };

    const handleSendMedia = async (file: File) => {
        await sendGroupMedia(groupId, file); // Send media via API route
    };

    return (
        <div className="p-4 pb-20 pt-14">
            <Header>
                <div className="flex justify-between font-bold">
                    <span>Group {group?.id}</span>
                    <span> {group?.name}</span>
                    <span>Members: {group?.members.toString()}</span>
                    <Link className="text-blue-700" to="/group">Go Back</Link>
                </div>
            </Header>
            <div>
                {isLoading ? (
                    <span>Loading messages...</span>
                ) : messages?.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((message, i) => (
                        <div key={i} className="p-2 my-2 bg-gray-100 rounded">
                            <p><strong>{message.id}</strong>: {message.content}</p>
                        </div>
                    ))
                )}
            </div>
            <GroupMessageComposerView onSendMessage={handleSendMessage} onSendMedia={handleSendMedia} />
        </div>
    );
}
