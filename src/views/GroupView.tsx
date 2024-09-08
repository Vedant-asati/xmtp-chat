import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
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
import { registerWithClient } from '../services/groupService';

const socket = io('http://localhost:3000'); // Replace with your backend URL

const GroupView = () => {
    const [receivedMessage, setReceivedMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [groupId, setGroupId] = useState('');
    const [participants, setParticipants] = useState("");

    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();

    // useEffect(() => {
    //     // Listen for new messages
    //     socket.on('newMessage', (data) => {
    //         setMessages((prevMessages) => [...prevMessages, data]);
    //     });

    //     // Listen for new groups
    //     socket.on('newGroup', (data) => {
    //         console.log('New group created:', data);
    //     });
    //     //wss
    //     socket.on('message', (msg) => {
    //         // toast.success("New msg: ", msg);
    //         setReceivedMessage(msg);
    //         console.log("new msg: ", msg)
    //     });

    //     // Clean up socket events on unmount
    //     return () => {
    //         socket.off('newMessage');
    //         socket.off('newGroup');
    //     };
    // }, []);


    const sendMessage = async () => {
        if (newMessage && groupId) {
            await axios.post('http://localhost:3000/sendMessage', {
                groupId,
                messageContent: newMessage,
            });
            setNewMessage('');
        }
    };
    const createGroup = async () => {
        if (participants) {
            await axios.post('http://localhost:3000/createGroup', {
                members: participants,
            });
        }
    };

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div className="App" style={{ padding: '20px' }}>
                <h1>Groups View</h1>

                <div>
                    <input
                        type="text"
                        placeholder="Group ID"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send Message</button>
                </div>
                {/* ///////////////////////////////////////////// */}
                <div>
                    <input
                        type="text"
                        placeholder="0xa,0xb,..."
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                    />
                    <button onClick={createGroup}>Create Group</button>
                </div>
                <div><button onClick={() => toast.promise(
                    registerWithClient(address, signMessageAsync),
                    {
                        loading: 'Please Wait... Regsistering Client',
                        success: <b>Successfully registered!</b>,
                        error: (err) => <b>Error registering Client: {err.message}{console.log(err)}</b>,
                    }
                )}>Register a Client</button></div>

                {/* Chat Messages */}
                {/* <div style={{ border: '1px solid black', height: '300px', overflowY: 'scroll', marginTop: '20px' }}>
                {messages.map((msg, index) => (
                    <p key={index}>{`Group ${msg.groupId}: ${msg.messageContent}`}</p>
                ))}
            </div> */}
                <button onClick={() => socket.emit('hello', 'world')}>send to server</button>
                <div>Received from server: {receivedMessage}</div>
            </div >
        </>
    );
};

export default GroupView;
