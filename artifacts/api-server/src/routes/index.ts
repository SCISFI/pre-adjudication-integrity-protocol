import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import participantsRouter from "./participants";
import checkinsRouter from "./checkins";
import modulesRouter from "./modules";
import submissionsRouter from "./submissions";
import clinicianRouter from "./clinician";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(participantsRouter);
router.use(checkinsRouter);
router.use(modulesRouter);
router.use(submissionsRouter);
router.use(clinicianRouter);

export default router;
