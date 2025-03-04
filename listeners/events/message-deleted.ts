import { WebClient } from "@slack/web-api";
import { airtable } from "../../util/airtable";
import { MessageChangedEvent, MessageDeletedEvent, MessageEvent } from "@slack/bolt";

const messageDeleted = async ({ client, event }: {client: WebClient, event: MessageChangedEvent}) => {
    let data = await airtable(process.env.AIRTABLE_TABLE_NAME).select({
      filterByFormula: `{message_id} = '${event.previous_message.ts}'`,
    }).all();
    let record = data[0];
    
    let upvotes: [] = JSON.parse(record.fields.upvote.toString());
    let downvotes: [] = JSON.parse(record.fields.downvote.toString());
    if (upvotes.length == 0 && downvotes.length == 0) {
      airtable(process.env.AIRTABLE_TABLE_NAME).destroy(
        [data[0].id],
        function (err, deletedRecords) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
      await client.chat.delete(
        {
          channel: process.env.CHANNEL_ID,
          ts: record.fields.vote_ts.toString(),
        }
      )
    }
    
};

export default messageDeleted;
