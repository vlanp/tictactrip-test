import { app } from "./app.js";
import checkedEnv from "./utils/check-env.js";

app.listen(checkedEnv.PORT, () => {
  console.log(`Server is running on port ${checkedEnv.PORT}`);
});
