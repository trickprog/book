import { createApp } from "./app";
import { config } from "./config";

createApp().listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}` );
});
