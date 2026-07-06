import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  getCitations,
  getGraph,
  getProcessingStatus,
  getSummary,
  processResourceAi,
  processResourceSummary,
  setSummaryVisibility,
} from "./resourceAi.service";
import { resourceService } from "./resource.service";

const resourceIdFrom = (req: Request) => String(req.params.resourceId ?? "");

const assertReadableResource = async (req: Request) => {
  if (req.user?.role === "ADMIN") return;
  await resourceService.assertResourceAccess(req.user!.userId, resourceIdFrom(req));
};

const processingStatus = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await getProcessingStatus(resourceIdFrom(req));
  sendResponse(res, { status: status.OK, success: true, message: "Resource AI processing status", data: result });
});

const summary = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await getSummary(resourceIdFrom(req));
  sendResponse(res, { status: status.OK, success: true, message: "Resource AI summary", data: result });
});

const citations = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await getCitations(resourceIdFrom(req));
  sendResponse(res, { status: status.OK, success: true, message: "Resource citations", data: result });
});

const graph = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await getGraph(resourceIdFrom(req), req.query as Record<string, string | undefined>);
  sendResponse(res, { status: status.OK, success: true, message: "Resource citation graph", data: result });
});

const processAi = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await processResourceAi(resourceIdFrom(req), {
    regenerateSummary: Boolean(req.body?.regenerateSummary),
    reanalyzeCitations: Boolean(req.body?.reanalyzeCitations),
  });
  sendResponse(res, { status: status.ACCEPTED, success: true, message: "Resource AI processing queued", data: result });
});

const regenerateSummary = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await processResourceSummary(resourceIdFrom(req), true);
  sendResponse(res, { status: status.ACCEPTED, success: true, message: "Resource AI summary queued", data: result });
});

const reanalyzeCitations = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await processResourceAi(resourceIdFrom(req), { reanalyzeCitations: true });
  sendResponse(res, { status: status.ACCEPTED, success: true, message: "Resource citations queued", data: result });
});

const updateSummaryVisibility = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await setSummaryVisibility(resourceIdFrom(req), Boolean(req.body?.isVisible));
  sendResponse(res, { status: status.OK, success: true, message: "Summary visibility updated", data: result });
});

export const resourceAiController = {
  processingStatus,
  summary,
  citations,
  graph,
  processAi,
  regenerateSummary,
  reanalyzeCitations,
  updateSummaryVisibility,
};
