import { useEffect, useState } from "react";
import io from "socket.io-client";
import { DecodedMessage, Conversation } from "@xmtp/mls-client";

const SOCKET_URL = "http://localhost:3000";

export function useWebSocket() {
    const [socket, setSocket] = useState<any>(null);
    const [newGroupMessage, setNewGroupMessage] = useState<DecodedMessage | null>(null);
    const [newGroup, setNewGroup] = useState<Conversation>();

    useEffect(() => {
        const socketClient = io(SOCKET_URL);
        setSocket(socketClient);

        // Listen for different types of messages
        socketClient.on("newMessage", (message: DecodedMessage) => {
            setNewGroupMessage(message);
        });

        socketClient.on("newGroup", (group: Conversation) => {
            setNewGroup(group);
        });

        return () => {
            socketClient.disconnect();
        };
    }, []);

    return { socket, newGroupMessage, newGroup };
}
