import {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { airtable } from "../../util/airtable";

const voteCallback = async ({
  payload,
  ack,
  client,
  body,
}: AllMiddlewareArgs & SlackActionMiddlewareArgs<BlockAction>) => {
  try {
    await ack();
    console.log(payload, body);
    console.log(body.message.root.ts);
    if (payload.action_id === "actionId-upvote") {
      airtable("Table 1")
        .select({
          filterByFormula: `{message_id}=${body.message.root.ts}`,
        })
        .eachPage(function page(records, fetchNextPage) {
          console.log(records);
        });
    } else if (payload.action_id === "actionId-downvote") {
    }
  } catch (error) {
    console.error(error);
  }
};

export default voteCallback;
