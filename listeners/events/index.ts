import { App } from "@slack/bolt";

import newMessage from "./message";

const register = (app: App) => {
  app.event("message", newMessage);
};

export default { register };
