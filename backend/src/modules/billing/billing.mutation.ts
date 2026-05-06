import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";
import { billingContract } from "../../contract/billing/billing.contract";
import billingRepository from "../../repository/billing.repository";

export const createBilling: AppRouteMutationImplementation<
  typeof billingContract.createBilling
> = async ({ req }) => {
  try {
    const {
      business_id,
      clientId,
      items,
      totalAmount,
      paidAmount,
      status,
      dueDate,
    } = req.body;

    const billing = await billingRepository.create({
      business_id: new mongoose.Types.ObjectId(business_id),
      clientId: new mongoose.Types.ObjectId(clientId),
      items,
      totalAmount,
      paidAmount,
      status,
      dueDate,
    });

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
        error: (error as Error).message,
      },
    };
  }
};

export const updateBilling: AppRouteMutationImplementation<
  typeof billingContract.updateBilling
> = async ({ req }) => {
  try {
    const { billingID } = req.params;

    const {
      items,
      totalAmount,
      paidAmount,
      status,
      dueDate,
    } = req.body;

    const updated = await billingRepository.update(billingID, {
      items,
      totalAmount,
      paidAmount,
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