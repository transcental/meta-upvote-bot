import { WebClient } from "@slack/web-api";
import { airtable } from "../../util/airtable";
import { createInteractiveMessage } from "../../util/createInteractiveMessage";
import { GenericMessageEvent } from "@slack/bolt";

const messagePosted = async ({ client, event }: {client: WebClient, event: GenericMessageEvent}) => {
    let msg = await client.chat.postMessage({
      channel: process.env.CHANNEL_ID,
      thread_ts: event.ts,
      reply_broadcast: false,
      text: "Vote on this meta post",
      blocks: createInteractiveMessage(0, 0),
    });
    airtable(process.env.AIRTABLE_TABLE_NAME).create(
      [
        {
          fields: {
            message_id: event.ts,
            upvote: "[]",
            downvote: "[]",
            vote_ts: msg.ts,
          },
        },
      ],
      { typecast: true },
      function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        // records.forEach(function (record) {
        //   console.log(record.getId());
        // });
      }
    );

};

export default messagePosted;
