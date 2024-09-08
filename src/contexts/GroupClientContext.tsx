// import { createContext, useContext, useEffect, useState } from "react";
// import { Client as GroupClient } from "@xmtp/mls-client"; // Assuming you use this package for group chats
// import { io } from 'socket.io-client';
// import axios from 'axios';
// import {
//     configureChains,
//     createClient,
//     WagmiConfig,
//     useSignMessage,
//     useAccount,
//     useDisconnect,
// } from "wagmi";
// import { Toaster, toast } from 'react-hot-toast';

// const GroupClientContext = createContext<GroupClient | null>(null);
// const { address } = useAccount();
// const { signMessageAsync } = useSignMessage();


// export const GroupClientProvider = ({ children }: { children: React.ReactNode }) => {
//     const [groupClientSet, setGroupClientSet] = useState<boolean>(false);

//     const registerWithClient = async (): Promise<(boolean | undefined)> => {
//         if (address) {
//             console.log("Starting")
//             const res = await axios.post('http://localhost:3000/setupClient', {
//                 address,
//             });
//             console.log("Starting")
//             console.log(res);
//             if (res.status == 200) {
//                 try {
//                     const signatureText = res.data.signatureText;
//                     if (!signatureText) {
//                         console.log("Client already Registered");
//                         return;
//                     }
//                     const signature = await signMessageAsync({ message: signatureText }) || "";
//                     // const signatureBytes = toBytes(signature);
//                     const res2 = await axios.post('http://localhost:3000/registerClient', {
//                         address: address,
//                         signature: signature,
//                         signatureText: signatureText,
//                     });
//                     console.log(res2);
//                     return true; // return true if registered
//                 } catch (error) {
//                     toast.error("Error with signing message. Please try again.");
//                 }
//             }
//         }
//         else toast.error("Wallet not connected.");
//     };

//     useEffect(() => {
//         // Initialize the group client here
//         const initGroupClient = async () => {
//             // Connect with your wallet and XMTP Group Client (use ethers.js for wallet interaction)
//             const success = await registerWithClient();
//             if (success) setGroupClientSet(true);
//         };

//         initGroupClient();
//     }, []);

//     return (
//         <GroupClientContext.Provider value={groupClientSet}>
//             {children}
//         </GroupClientContext.Provider>
//     );
// };

// export const useGroupClient = () => useContext(GroupClientContext);
