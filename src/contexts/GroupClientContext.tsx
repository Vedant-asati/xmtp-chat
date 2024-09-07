// import { Client } from "@xmtp/xmtp-js";
// import { Client as GroupClient } from "@xmtp/mls-client";

// import { Wallet } from "ethers";
// import { createContext, useState, ReactElement, useEffect } from "react";
// import {
//   AttachmentCodec,
//   RemoteAttachmentCodec,
// } from "@xmtp/content-type-remote-attachment";
// import { ReplyCodec } from "@xmtp/content-type-reply";
// import { ReactionCodec } from "@xmtp/content-type-reaction";
// import { ReadReceiptCodec } from "@xmtp/content-type-read-receipt";

// type GroupClientContextValue = {
//   client: GroupClient | null;
//   setClient: (client: GroupClient | null) => void;
// };

// export const GroupClientContext = createContext<GroupClientContextValue>({
//   client: null,
//   setClient: () => {
//     return;
//   },
// });

// export default function GroupClientProvider({
//   children,
// }: {
//   children: ReactElement;
// }): ReactElement {
//   const [client, setClient] = useState<GroupClient | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       const insecurePrivateKey = localStorage.getItem("_insecurePrivateKey");

//       if (!insecurePrivateKey) {
//         setIsLoading(false);
//         return;
//       }

//       const wallet = new Wallet(insecurePrivateKey);
//       console.log(`Init wallet ${wallet?.address}`);
//       const client = await GroupClient.create(wallet?.address, {
//         env: "dev",
//         dbPath: `.cache/${wallet?.address}-${"dev"}`,
//       });

//       // client.registerCodec(new AttachmentCodec());
//       // client.registerCodec(new RemoteAttachmentCodec());
//       // client.registerCodec(new ReplyCodec());
//       // client.registerCodec(new ReactionCodec());
//       // client.registerCodec(new ReadReceiptCodec());

//       setClient(client);
//       setIsLoading(false);
//     })();
//   }, []);

//   const clientContextValue = {
//     client,
//     setClient,
//   };

//   return (
//     <GroupClientContext.Provider value={clientContextValue}>
//       {isLoading ? (
//         <div className="w-full p-4 m-auto">Loading client....</div>
//       ) : (
//         children
//       )}
//     </GroupClientContext.Provider>
//   );
// }
