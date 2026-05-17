import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";
import { billingContract } from "../../contract/billing/billing.contract";
import billingRepository from "../../repository/billing.repository";
import userRepository from "../../repository/user.repository";
import businessRepository from "../../repository/business.repository";
import activityLogRepository from "../../repository/activity-log.repository";

export const createBilling: AppRouteMutationImplementation<
  typeof billingContract.createBilling
> = async ({ req }) => {
  try {
    let {
      business_id,
      clientName,
      clientEmail,
      title,
      items,
      totalAmount,
      paidAmount,
      paymentMethod,
      status,
      dueDate,
    } = req.body;

    // Parse items from FormData
    if (typeof items === "string") {
      items = JSON.parse(items);
    }

    // Convert numbers
    totalAmount = Number(totalAmount);
    paidAmount = Number(paidAmount || 0);

    if (!clientEmail) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Client email is required",
        },
      };
    }

    const clientData = await userRepository.getByEmail(
      clientEmail.toLowerCase(),
    );

    if (!clientData) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Client with that email does not exist",
        },
      };
    }

    const files = req.files as {
      recipt?: Express.Multer.File[];
    };

    const reciptUrl = files?.recipt?.[0]?.path || "";

    const billing = await billingRepository.create({
      business_id: new mongoose.Types.ObjectId(business_id),
      clientId: new mongoose.Types.ObjectId(clientData._id),
      clientName,
      clientEmail,
      title,
      items,
      totalAmount,
      paidAmount,
      paymentMethod,
      status,
      dueDate,
      recipt: reciptUrl,
    });

    const businessUser = await businessRepository.getByID(business_id);
    const user = await userRepository.getByID(business_id);
    const account = businessUser || user;

    if (!account) {
      return {
        status: 404,
        body: { success: false, error: "User not found" },
      };
    }

    const isBusiness = "operatorPassword" in account;

    const userName = isBusiness ? account.operatorName : account.userName;

    if (billing) {
      const createLogs = await activityLogRepository.create({
        module: "Billing",
        action: "CREATE",
        userId: new mongoose.Types.ObjectId(business_id),
        userName: userName,
        description: `Billing created for client: ${clientName}`,
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "billing created successfully",
        data: billing,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: `Error creating billing: ${(error as Error).message}`,
      },
    };
  }
};

export const updateBilling: AppRouteMutationImplementation<
  typeof billingContract.updateBilling
> = async ({ req }) => {
  try {
    const { billingID } = req.params;

    let {
      clientName,
      title,
      items,
      totalAmount,
      paidAmount,
      paymentMethod,
      status,
      dueDate,
    } = req.body;

    // Parse items from FormData
    if (typeof items === "string") {
      items = JSON.parse(items);
    }

    // Convert numbers
    totalAmount = Number(totalAmount);
    paidAmount = Number(paidAmount || 0);

    const files = req.files as {
      recipt?: Express.Multer.File[];
    };

    // Cloudinary URLs
    const reciptUrl = files?.recipt?.[0]?.path;

    const updated = await billingRepository.update(billingID, {
      clientName,
      title,
      paymentMethod,
      items,
      totalAmount,
      paidAmount,
      recipt: reciptUrl,
      status,
      dueDate,
    });

    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Billing not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Billing updated",
        data: updated,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const removeBilling: AppRouteMutationImplementation<
  typeof billingContract.removeBilling
> = async ({ req }) => {
  try {
    const { billingID } = req.params;

    const existing = await billingRepository.getByID(billingID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Billing not found",
        },
      };
    }

    const deleted = await billingRepository.delete(billingID);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Billing was not deleted",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Billing deleted",
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const billingMutationHandler = {
  createBilling,
  updateBilling,
  removeBilling,
};
