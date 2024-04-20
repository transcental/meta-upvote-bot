import { App } from "@slack/bolt";

import messagePosted from "./message-posted";

const register = (app: App) => {
  app.event("message", messagePosted);
};

export default { register };
