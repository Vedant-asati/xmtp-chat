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

const socket = io('http://localhost:3000'); // Replace with your backend URL

const GroupView = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [groupId, setGroupId] = useState('');
    const [participants, setParticipants] = useState("");

    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();

    useEffect(() => {
        // Listen for new messages
        socket.on('newMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Listen for new groups
        socket.on('newGroup', (data) => {
            console.log('New group created:', data);
        });

        // Clean up socket events on unmount
        return () => {
            socket.off('newMessage');
            socket.off('newGroup');
        };
    }, []);

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
    const registerWithClient = async () => {
        if (address) {
            const res = await axios.post('http://localhost:3000/setupClient', {
                address,
            });
            console.log(res);
            if (res.status == 200) {
                try {
                    const signatureText = res.data.signatureText;
                    if (!signatureText) {
                        console.log("Client already Registered");
                        return;
                    }
                    const signature = await signMessageAsync({ message: signatureText }) || "";
                    // const signatureBytes = toBytes(signature);
                    const res2 = await axios.post('http://localhost:3000/registerClient', {
                        address: address,
                        signature: signature,
                        signatureText: signatureText,
                    });
                    console.log(res2);
                    toast.error("This didn't work.");
                } catch (error) {
                    toast.error("Error with signing message. Please try again.");
                }
            }
        }
        else toast.error("Wallet not connected.")

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
                    registerWithClient(),
                    {
                        loading: 'Please Wait... Regsistering Client',
                        success: <b>Successfully registered!</b>,
                        error: <b>Error registering Client.</b>,
                    }
                )}>Register a Client</button></div>

            {/* Chat Messages */}
            {/* <div style={{ border: '1px solid black', height: '300px', overflowY: 'scroll', marginTop: '20px' }}>
                {messages.map((msg, index) => (
                    <p key={index}>{`Group ${msg.groupId}: ${msg.messageContent}`}</p>
                ))}
            </div> */}
        </div >
        </>
    );
};

export default GroupView;
