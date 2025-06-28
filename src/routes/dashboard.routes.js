import { Router } from "express";
import {
    getChannelStats,
    getChannelVideos,
    verifyJWT,
} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router