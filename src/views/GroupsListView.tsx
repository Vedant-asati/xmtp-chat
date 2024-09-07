// import { useConversations } from "../hooks/useConversations";
// import { useClient } from "../hooks/useClient";
// import { Link } from "react-router-dom";
// import { useLatestMessages } from "../hooks/useLatestMessages";
// import ConversationCellView from "./ConversationCellView";
// //
// // import "dotenv/config";
// // import { Client } from "@xmtp/mls-client";
// // import { createWalletClient, http } from "viem";
// // import { privateKeyToAccount } from "viem/accounts";
// // import { mainnet } from "viem/chains";
// // import { toBytes } from "viem";
// // import { generatePrivateKey } from "viem/accounts";

// import { ReactElement, useEffect, useState } from "react";
// import socketClient  from "socket.io-client";

// const SERVER = "http://localhost:8080";
// export default function GroupsListView(): ReactElement {

//     const socket = socketClient (SERVER);
//     socket.on('connection', () => {
//         console.log(`I'm connected with the back-end`);
//     });

//     return(
//     <div>
//         JSR
//     </div>
// )
// }


///////////////////////////////////////////////////////////
// export default function GroupsListView(): ReactElement {
    //   const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(
    //     window.localStorage.getItem("readReceiptsEnabled") === "true"
    //   );
    
    //   const client = useClient();
    //   const conversations = useConversations(client);
    //   const latestMessages = useLatestMessages(conversations);
    
    //   useEffect(() => {
    //     window.localStorage.setItem(
    //       "readReceiptsEnabled",
    //       String(readReceiptsEnabled)
    //     );
    //   }, [readReceiptsEnabled]);
    
    //   return (
    //     <div>
    //       <button
    //         onClick={() => setReadReceiptsEnabled(!readReceiptsEnabled)}
    //         className="bg-blue-100 p-1 my-2 text-xs"
    //         id={`read-receipt-${readReceiptsEnabled}`}
    //       >
    //         {readReceiptsEnabled ? "Disable read receipts" : "Enable read receipts"}
    //       </button>
    //       {conversations?.length == 0 && <p>No conversations yet.</p>}
    //       {conversations
    //         ? conversations.map((conversation, i) => (
    //           <Link to={`c/${conversation.topic}`} key={conversation.topic}>
    //             <ConversationCellView
    //               conversation={conversation}
    //               latestMessage={latestMessages[i]}
    //             />
    //           </Link>
    //         ))
    //         : "Could not load conversations"}
    //       <Link to="new-group" className="text-blue-700">
    //         Create a new group
    //       </Link>
    //     </div>
    //   );
    // }
    