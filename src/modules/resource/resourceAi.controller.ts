import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  getCitations,
  getExtractedTextPreview,
  getGraph,
  getProcessingStatus,
  getSummary,
  processResourceAi,
  processResourceResearchGraph,
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

const regenerateGraph = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await processResourceResearchGraph(resourceIdFrom(req));
  sendResponse(res, { status: status.ACCEPTED, success: true, message: "Resource research graph queued", data: result });
});

const updateSummaryVisibility = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await setSummaryVisibility(resourceIdFrom(req), Boolean(req.body?.isVisible));
  sendResponse(res, { status: status.OK, success: true, message: "Summary visibility updated", data: result });
});

/**
 * Returns a short preview of the extracted PDF text (first ~1800 chars + page
 * count) so the UI can show the user what the AI is going to summarize before
 * triggering the actual generation. Returns `{ status: "PENDING", preview: null }`
 * when text extraction hasn't happened yet.
 */
const extractedTextPreview = catchAsync(async (req: Request, res: Response) => {
  await assertReadableResource(req);
  const result = await getExtractedTextPreview(resourceIdFrom(req));
  sendResponse(res, { status: status.OK, success: true, message: "Resource extracted text preview", data: result });
});

export const resourceAiController = {
  processingStatus,
  summary,
  citations,
  graph,
  processAi,
  regenerateSummary,
  reanalyzeCitations,
  regenerateGraph,
  updateSummaryVisibility,
  extractedTextPreview,
};
