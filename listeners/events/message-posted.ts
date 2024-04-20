import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from "@slack/bolt";
import { airtable } from "../../util/airtable";
import { createInteractiveMessage } from "../../util/createInteractiveMessage";

const messagePosted = async ({ client, event }: any) => {
  if (
    event.channel === process.env.CHANNEL_ID &&
    !event.thread_ts &&
    !event.subtype
  ) {
    airtable(process.env.AIRTABLE_TABLE_NAME).create(
      [
        {
          fields: {
            message_id: event.ts,
            upvote: "[]",
            downvote: "[]",
          },
        },
      ],
      { typecast: true },
      function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.getId());
        });
      }
    );

    client.chat.postMessage({
      channel: process.env.CHANNEL_ID,
      thread_ts: event.ts,
      reply_broadcast: true,
      blocks: createInteractiveMessage(0, 0),
    });
  }
};

export default messagePosted;
