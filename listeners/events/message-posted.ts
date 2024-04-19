import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from "@slack/bolt";
import { airtable } from "../../util/airtable";

const messagePosted = async ({ client, event }: any) => {
  // const { event } = body;
  // const { type, subtype, user, channel, ts, text } = event;
  if (event.channel === "C06V4CT6DV2" && !event.thread_ts && !event.subtype) {
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
      channel: "C06V4CT6DV2",
      thread_ts: event.ts,
      reply_broadcast: true,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Upvote/downvote above message",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: ":upvote:  Upvote",
                emoji: true,
              },
              value: "upvote",
              action_id: "actionId-upvote",
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: ":downvote:  Downvote",
                emoji: true,
              },
              value: "downvote",
              action_id: "actionId-downvote",
            },
          ],
        },
      ],
    });
  }
};

export default messagePosted;
