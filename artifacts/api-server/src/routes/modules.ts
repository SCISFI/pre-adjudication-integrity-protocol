import { Router, type IRouter } from "express";
import { CURRICULUM_MODULES, getModule } from "../lib/modules";
import { GetModuleParams, GetModuleResponse, ListModulesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/modules", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.json(ListModulesResponse.parse(CURRICULUM_MODULES));
});

router.get("/modules/:weekNumber", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = GetModuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const module = getModule(params.data.weekNumber);
  if (!module) {
    res.status(404).json({ error: "Module not found" });
    return;
  }

  res.json(GetModuleResponse.parse(module));
});

export default router;
