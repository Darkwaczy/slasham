import dotenv from "dotenv";
import { createApp } from "./app";
import { getEnv } from "./env";

dotenv.config();

const env = getEnv();

(async () => {
  const app = await createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Slasham API listening on port ${env.port}`);
  });
})();
