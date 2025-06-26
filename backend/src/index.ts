import { logger } from "./applications/logger";
import { web } from "./applications/web";

web.listen(3030, () => {
  logger.info("Server running on port 3030");
});
