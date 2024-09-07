import { useContext } from "react";
import { ClientContext } from "../contexts/ClientContext";
// import { GroupClientContext } from "../contexts/GroupClientContext";
import { Client } from "@xmtp/xmtp-js";
// import { Client as GroupClient } from "@xmtp/mls-client";
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import { ReplyCodec } from "@xmtp/content-type-reply";
import { ReactionCodec } from "@xmtp/content-type-reaction";
import { ReadReceiptCodec } from "@xmtp/content-type-read-receipt";

export function useClient() {
  return useContext(ClientContext).client;
}

// export function useGroupClient() {
//   return useContext(GroupClientContext).client;
// }

export function useSetClient() {
  const setClient = useContext(ClientContext).setClient;

  return (client: Client | null) => {
    if (client) {
      client.registerCodec(new AttachmentCodec());
      client.registerCodec(new RemoteAttachmentCodec());
      client.registerCodec(new ReplyCodec());
      client.registerCodec(new ReactionCodec());
      client.registerCodec(new ReadReceiptCodec());
    }

    setClient(client);
  };
}

// export function useSetGroupClient() {
//   const setClient = useContext(GroupClientContext).setClient;

//   return (client: GroupClient | null) => {
//     if (client) {
//       // client.registerCodec(new AttachmentCodec());
//       // client.registerCodec(new RemoteAttachmentCodec());
//       // client.registerCodec(new ReplyCodec());
//       // client.registerCodec(new ReactionCodec());
//       // client.registerCodec(new ReadReceiptCodec());
//     }

//     setClient(client);
//   };
// }
