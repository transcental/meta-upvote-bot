import { App } from "@slack/bolt";
import voteCallback from "./vote";

const register = (app: App) => {
  app.action("actionId-upvote", voteCallback);
  app.action("actionId-downvote", voteCallback);
};

export default { register };
