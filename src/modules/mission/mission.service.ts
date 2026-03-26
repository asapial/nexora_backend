import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { CreateContentInput, ReorderContentsInput, UpdateContentInput } from "./mission.type";


// ─────────────────────────────────────────────────────────
// MISSION CONTENT
// ─────────────────────────────────────────────────────────


const getContents = async (missionId: string) => {
  return prisma.missionContent.findMany({
    where: { missionId },
    orderBy: { order: "asc" },
  });
};

const createContent = async (missionId: string, input: CreateContentInput) => {
  const count = await prisma.missionContent.count({ where: { missionId } });
  return prisma.missionContent.create({
    data: { missionId, ...input, order: input.order ?? count },
  });
};

const updateContent = async (missionId: string, contentId: string, input: UpdateContentInput) => {
  const content = await prisma.missionContent.findFirst({ where: { id: contentId, missionId } });
  if (!content) throw new AppError(status.NOT_FOUND, "Content not found.");
  return prisma.missionContent.update({ where: { id: contentId }, data: input });
};

const deleteContent = async (missionId: string, contentId: string) => {
  const content = await prisma.missionContent.findFirst({ where: { id: contentId, missionId } });
  if (!content) throw new AppError(status.NOT_FOUND, "Content not found.");
  await prisma.missionContent.delete({ where: { id: contentId } });
  return { message: "Content deleted" };
};

const reorderContents = async (missionId: string, input: ReorderContentsInput) => {
  const updates = input.orderedIds.map((id, index) =>
    prisma.missionContent.update({ where: { id }, data: { order: index } })
  );
  await prisma.$transaction(updates);
  return prisma.missionContent.findMany({ where: { missionId }, orderBy: { order: "asc" } });
};




export const missionService={
    getContents,
createContent,
updateContent,
deleteContent,
reorderContents

}