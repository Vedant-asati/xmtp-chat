import { ReactElement } from "react";
import { shortAddress } from "../util/shortAddress";
import { Link } from "react-router-dom";
import { Conversation } from "@xmtp/mls-client";
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";

export default function GroupConversationCellView({
  conversation,
}: {
  conversation: Conversation;
}): ReactElement {
  return (
    <Link to={`/group/${conversation.id}`}>
      <ListItem
        button
        className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition duration-300 p-3 rounded-lg"
      >
        <ListItemAvatar>
          <Avatar
            alt={conversation.name}
            src={conversation.imageUrl || "/default-group-icon.png"}
            className="w-12 h-12"
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle1" className="font-semibold dark:text-white text-gray-900">
              {conversation.name || shortAddress('0x' + conversation.id)}
            </Typography>
          }
          secondary={
            <>
              <Typography variant="body2" className="dark:text-gray-400 text-gray-600" noWrap>
                {shortAddress('0x' + conversation.addedByInboxId)}: {conversation.latestMessages[conversation.latestMessages.length - 1]?.content.toString() || "No messages yet."}
              </Typography>
              <Typography variant="caption" className="dark:text-gray-500 text-gray-500">
                {new Date(conversation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </>
          }
        />
      </ListItem>
    </Link>
  );
}
