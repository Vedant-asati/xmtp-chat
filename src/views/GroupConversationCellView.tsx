import { ReactElement } from "react";
import { shortAddress } from "../util/shortAddress";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";
import { Conversation, DecodedMessage } from "@xmtp/mls-client"

export default function GroupConversationCellView({
  conversation,
}: {
  conversation: Conversation; // Replace with actual type
}): ReactElement {
  return (
    
    <div className="mt-2 p-2 border dark:border-zinc-600 rounded">
      <div className="flex items-center justify-between space-x-2">
        <div className="hover:underline">
          <Link to={`/group/${conversation.id}`}>
            <span className="text-blue-700 dark:text-blue-500">
              <img src={conversation.imageUrl} alt="grp-icon" />
              <b>{conversation.name}</b>
              {/* Id: {shortAddress(conversation.id)} */}
              {/* Description: {conversation.description} */}
              {/* Admins: {conversation.admins} */}
              {/* Members: {conversation.members.toString()} */}
              {/* Members: {conversation.pinnedFrameUrl} */}
              {/* Is Active: {conversation.isActive} */}
              {new Date(conversation.createdAt).toString().split('2024 ')[1].split(' GMT')[0]} <br />
              {shortAddress('0x' + conversation.addedByInboxId)}: {conversation.latestMessages[conversation.latestMessages.length - 1]?.content.toString()}
            </span>
          </Link>
        </div>
        <div className="text-xs text-zinc-500">
          {/* <ReactTimeAgo date={conversation.messages()[-1].sentAt} /> */}
        </div>
      </div>
    </div>
  );
}
