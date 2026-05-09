import { AppRouteMutationImplementation } from "@ts-rest/express";
import { paymentContract } from "../../contract/payment/payment.contract";
import paymentRepository from "../../repository/payment.repository";
import mongoose from "mongoose";
import businessRepository from "../../repository/business.repository";

export const createPayment: AppRouteMutationImplementation<
  typeof paymentContract.createPayment
> = async ({ req }) => {
  try {
    const {
      businessName,
      businessEmail,
      package: pkg = "starter",
      startedAt,
      endAt,
      paidAmount,
      dueAmount,
      paymentStatus = "pending",
      isActive = true,
    } = req.body;

    if (!businessEmail) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Business email is required",
        },
      };
    }

    const businessData = await businessRepository.getByEmail(
      businessEmail.toLowerCase(),
    );

    if (!businessData) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Business with that email does not exist",
        },
      };
    }

    const payment = await paymentRepository.create({
      business_id: new mongoose.Types.ObjectId(businessData._id),
      businessName,
      businessEmail,
      package: pkg,
      startedAt,
      endAt,
      paidAmount,
      dueAmount,
      paymentStatus,
      isActive,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Payment created successfully",
        data: payment,
      },
    };
  } catch (error: any) {
    if (error.code === 11000) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Payment already exists",
        },
      };
    }

    return {
      status: 500,
      body: {
        success: false,
        error: error.message,
      },
    };
  }
};

export const updatePayment: AppRouteMutationImplementation<
  typeof paymentContract.updatePayment
> = async ({ req }) => {
  try {
    const { paymentID } = req.params;

    const { package: pkg, ...rest } = req.body;

    const updateData: Record<string, any> = {};

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });

    if (pkg !== undefined) {
      updateData.package = pkg;
    }

    const updatedPayment = await paymentRepository.update(
      paymentID,
      updateData,
    );

    return {
      status: 200,
      body: {
        success: true,
        message: "Payment updated successfully",
        data: updatedPayment,
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

export const renewPayment: AppRouteMutationImplementation<
  typeof paymentContract.renewPayment
> = async ({ req }) => {
  try {
    const {
      business_id,
      package: pkg,
      startedAt,
      endAt,
      paidAmount,
      dueAmount,
      paymentStatus,
      isActive,
    } = req.body;

    const business = await businessRepository.getByID(
      business_id,
    );

    if (!business) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Business not found",
        },
      };
    }

    const payment = await paymentRepository.create({
      business_id: new mongoose.Types.ObjectId(business_id),
      businessName: business.businessName,
      businessEmail: business.operatorEmail,
      package: pkg,
      startedAt,
      endAt,
      paidAmount,
      dueAmount,
      paymentStatus,
      isActive,
    });

    // OPTIONAL: UPDATE BUSINESS STATUS
    await businessRepository.update(business_id, {
      status: true,
      payment_status: paymentStatus === "paid",
      package: pkg,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Subscription renewed successfully",
        data: payment,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      body: {
        success: false,
        error: error.message,
      },
    };
  }
};

export const removePayment: AppRouteMutationImplementation<
  typeof paymentContract.removePayment
> = async ({ req }) => {
  try {
    const existing = await paymentRepository.getByID(req.params.paymentID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Payment not found",
        },
      };
    }

    const deleted = await paymentRepository.delete(req.params.paymentID);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Payment was not deleted",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Payment deleted successfully",
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

export const paymentMutationHandler = {
  createPayment,
  updatePayment,
  renewPayment,
  removePayment,
};
