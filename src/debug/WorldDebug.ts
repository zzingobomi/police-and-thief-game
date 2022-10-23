import express from "express";
import path from "path";

const frontendDirectory = path.resolve(__dirname, "frontend");

export function WorldDebug(): express.Router {
  const router = express.Router();
  router.use(express.static(frontendDirectory));
  //router.use('/api', getAPI(opts));
  return router;
}
