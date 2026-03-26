import { MissionContentType } from "../../generated/prisma/enums";

// ── Content ───────────────────────────────────────────────
export interface CreateContentInput {
  type: MissionContentType;
  title: string;
  order?: number;
  videoUrl?: string;
  duration?: number;
  textBody?: string;
  pdfUrl?: string;
  fileSize?: number;
}

export interface UpdateContentInput extends Partial<CreateContentInput> {}

export interface ReorderContentsInput {
  orderedIds: string[]; // mission content IDs in new order
}
