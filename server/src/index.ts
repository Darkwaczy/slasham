import dotenv from "dotenv";
import { createApp } from "./app";
import { getEnv } from "./env";
import { initScheduler } from "./utils/scheduler";

dotenv.config();

const env = getEnv();
const app = createApp();

// Initialize Background Tasks
initScheduler();

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Slasham API listening on port ${env.port}`);
});
