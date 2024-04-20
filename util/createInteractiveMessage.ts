export const createInteractiveMessage = (
  upvotes: number,
  downvotes: number
) => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Upvotes: ${upvotes}\nDownvotes: ${downvotes}`,
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
  ];
};
