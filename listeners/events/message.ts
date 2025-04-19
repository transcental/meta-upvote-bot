import { WebClient } from "@slack/web-api";
import messagePosted from "./message-posted";
import messageDeleted from "./message-deleted";

const newMessage = async ({ client, event }: {client: WebClient, event: any}) => {
  if (
    event.channel === process.env.CHANNEL_ID &&
    !event.thread_ts &&
    (!event.subtype || ["file_share", "me_message"].includes(event.subtype))
  ) {
    messagePosted({ client, event });
  } else if (event.channel === process.env.CHANNEL_ID && event.subtype == "message_changed" && event.message.subtype == "tombstone") {
    messageDeleted({ client, event });
  }
};

export default newMessage;
