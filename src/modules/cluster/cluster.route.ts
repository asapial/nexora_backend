import { Router } from "express";
import { clusterController } from "./cluster.controller";

const router=Router();


router.post("/", clusterController.createCluster);


export const clusterRouter=router;