import { logger } from "../logger.js";

const eventList = [
  "./EntityHurtEvent.js",
];

eventList.map(path=>import(path)).forEach(pro => pro.catch(logger.error));
