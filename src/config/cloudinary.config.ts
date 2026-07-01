import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import status from "http-status";
import AppError from "../errorHelpers/AppError";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});


export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string,
  subfolder?: string,
): Promise<UploadApiResponse> => {

  if (!buffer || !fileName) {
    throw new AppError(status.BAD_REQUEST, "File buffer and file name are required for upload");
  }

  const extension = fileName.split(".").pop()?.toLocaleLowerCase();

  const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    // eslint-disable-next-line no-useless-escape
    .replace(/[^a-z0-9\-]/g, "");

  const uniqueName =
    Math.random().toString(36).substring(2) +
    "-" +
    Date.now() +
    "-" +
    fileNameWithoutExtension;

  // Determine folder and resource type based on extension
  const isPdf = extension === "pdf";
  const defaultFolder = isPdf ? "pdfs" : "images";
  const folderPath = subfolder
    ? `nexora/${subfolder}`
    : `nexora/${defaultFolder}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: isPdf ? "raw" : "auto",
        // Only use public_id (includes the folder path) — do NOT also set
        // the `folder` option, because that would double-nest the path.
        public_id: `${folderPath}/${uniqueName}${isPdf ? ".pdf" : ""}`,
      },
      (error, result) => {
        if (error) {
          return reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
        }
        resolve(result as UploadApiResponse);
      }
    ).end(buffer);
  });
};


export const deleteFileFromCloudinary = async (url: string) => {
  if (!url) return; // memory-storage files have no path; nothing to delete
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;

    const match = url.match(regex);

    if (match && match[1]) {
      const publicId = match[1];

      // Detect resource_type from the Cloudinary URL structure
      const isRaw = url.includes("/raw/upload/");
      const resourceType = isRaw ? "raw" : "image";

      await cloudinary.uploader.destroy(
        publicId, {
        resource_type: resourceType,
      });
    }

  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};


export const cloudinaryUpload = cloudinary;

export const uploadExamEvidenceToCloudinary = async (buffer: Buffer, evidenceId: string) => {
  if (!buffer.length) throw new AppError(status.BAD_REQUEST, "Snapshot evidence is empty");
  const publicId = `nexora/examshield-evidence/${evidenceId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image", type: "authenticated", public_id: publicId, overwrite: false },
      (error, result) => {
        if (error || !result) return reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload snapshot evidence"));
        resolve(result);
      },
    ).end(buffer);
  });
  return cloudinary.url(uploaded.public_id, {
    secure: true,
    sign_url: true,
    type: "authenticated",
    resource_type: "image",
  });
};

export const extractCloudinaryPublicId = (url: string) => {
  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(url).pathname);
  } catch {
    throw new AppError(status.BAD_REQUEST, "Invalid Cloudinary evidence URL");
  }

  const match = pathname.match(/\/(nexora\/examshield-evidence\/.+)$/) ?? pathname.match(/\/v\d+\/(.+)$/);
  if (!match?.[1]) throw new AppError(status.BAD_REQUEST, "Cloudinary evidence public ID could not be resolved");

  return match[1].replace(/\.[a-zA-Z0-9]+$/, "");
};

export const deleteExamEvidenceFromCloudinary = async (url: string) => {
  const publicId = extractCloudinaryPublicId(url);
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    type: "authenticated",
    invalidate: true,
  });
  if (!["ok", "not found"].includes(result.result)) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, `Cloudinary evidence deletion failed: ${result.result}`);
  }
};
