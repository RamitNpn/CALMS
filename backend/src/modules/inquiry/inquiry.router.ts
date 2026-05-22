import { initServer } from "@ts-rest/express";
import { inquiryContract } from "../../contract/inquiry/inquiry.contract";
import { inquiryMutationHandler } from "./inquiry.mutation";
import { inquiryQueryHandler } from "./inquiry.query";
import { userUploadFields } from "../../middleware/upload-fields";

const s = initServer();

export const inquiryRouter = s.router(inquiryContract, {
  createInquiry: {
    middleware: [userUploadFields],
    handler: inquiryMutationHandler.createDrivingInquiry,
  },
  removeInquiry: inquiryMutationHandler.removeDrivingInquiry,

  getAllInquiries: inquiryQueryHandler.getAllDrivingInquiries,
  getInquiryByID: inquiryQueryHandler.getDrivingInquiryByID,
});
