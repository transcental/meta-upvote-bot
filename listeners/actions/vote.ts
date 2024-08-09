import {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { airtable } from "../../util/airtable";
import { hashUserId } from "../../util/hashUserID";
import { createInteractiveMessage } from "../../util/createInteractiveMessage";

const voteCallback = async ({
  payload,
  ack,
  client,
  body,
}: AllMiddlewareArgs & SlackActionMiddlewareArgs<BlockAction>) => {
  try {
    await ack();

    await airtable(process.env.AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: `{message_id}=${body.message.thread_ts}`,
      })
      .eachPage(function page(records, fetchNextPage) {
        const hashedUserId = hashUserId(body.user.id);

        let upvotes = JSON.parse(records[0].fields.upvote.toString());
        let downvotes = JSON.parse(records[0].fields.downvote.toString());

        if (
          payload.action_id === "actionId-upvote" &&
          !upvotes.includes(hashedUserId)
        ) {
          if (downvotes.includes(hashedUserId)) {
            downvotes = downvotes.filter(
              (downvote) => downvote !== hashedUserId
            );
          }

          upvotes.push(hashedUserId);
        } else if (
          payload.action_id === "actionId-downvote" &&
          !downvotes.includes(hashedUserId)
        ) {
          if (upvotes.includes(hashedUserId)) {
            upvotes = upvotes.filter((upvote) => upvote !== hashedUserId);
          }
          downvotes.push(hashedUserId);
        }

        airtable(process.env.AIRTABLE_TABLE_NAME).update(
          [
            {
              id: records[0].id,
              fields: {
                upvote: JSON.stringify(upvotes),
                downvote: JSON.stringify(downvotes),
              },
            },
          ],
          function (err, records) {
            if (err) {
              console.log("Err:", err);
            }

            client.chat.update({
              channel: body.channel.id,
              ts: body.message.ts,
              blocks: createInteractiveMessage(
                upvotes.length,
                downvotes.length
              ),
            });
          }
        );
      });
  } catch (error) {
    console.error(error);
  }
};

export default voteCallback;
