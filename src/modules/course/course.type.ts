import { PaymentStatus } from "../../generated/prisma/enums";

export type PublicCourseQuery = {
  page?: string;
  limit?: string;
  search?: string;
  isFree?: string;
  featured?: string;
  tag?: string;
};

// ── Course ────────────────────────────────────────────────
export interface CreateCourseInput {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  tags?: string[];
  isFree: boolean;
  requestedPrice?: number;
  priceNote?: string;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  tags?: string[];
}


// ── Enrollment ────────────────────────────────────────────
export interface EnrollmentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: PaymentStatus;
}

// ── Price Request ─────────────────────────────────────────
export interface CreatePriceRequestInput {
  requestedPrice: number;
  note?: string;
}

// ── Mission ───────────────────────────────────────────────
export interface CreateMissionInput {
  title: string;
  description?: string;
  order?: number;
}

export interface UpdateMissionInput {
  title?: string;
  description?: string;
  order?: number;
}