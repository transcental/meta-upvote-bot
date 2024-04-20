import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from "@slack/bolt";
import { airtable } from "../../util/airtable";
import { createInteractiveMessage } from "../../util/createInteractiveMessage";

const messagePosted = async ({ client, event }: any) => {
  // const { event } = body;
  // const { type, subtype, user, channel, ts, text } = event;
  if (
    event.channel === process.env.CHANNEL_ID &&
    !event.thread_ts &&
    !event.subtype
  ) {
    airtable("Table 1").create(
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
