import { AppRouteQueryImplementation } from "@ts-rest/express";

import { paymentContract } from "../../contract/payment/payment.contract";

import paymentRepository from "../../repository/payment.repository";

export const getAllPayments: AppRouteQueryImplementation<
  typeof paymentContract.getAllPayments
> = async ({ req }) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const skip = (page - 1) * limit;

    const { data: payments, total } = await paymentRepository.getAll(skip, limit);

    const totalPages = Math.ceil(total / limit);

    const formattedPayments = payments.map((p: any) => ({
      _id: p._id.toString(),
      business_id: p.business_id?.toString(),
      businessName: p.businessName,
      businessEmail: p.businessEmail,
      package: p.package,
      duration: p.duration,
      startedAt: p.startedAt,
      endAt: p.endAt,
      paidAmount: p.paidAmount,
      dueAmount: p.dueAmount,
      paymentStatus: p.paymentStatus,
      isActive: p.isActive,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formattedPayments,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllPayments:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get all payments",
      },
    };
  }
};

export const getPaymentById: AppRouteQueryImplementation<
  typeof paymentContract.getPaymentById
> = async ({ req }) => {
  const { paymentID } = req.params;

  if (!paymentID) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Payment ID is required",
      },
    };
  }

  try {
    const payment = await paymentRepository.getByID(paymentID);

    if (!payment) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Payment not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: payment._id.toString(),
        business_id: payment.business_id?.toString(),
        businessName: payment.businessName,
        businessEmail: payment.businessEmail,
        package: payment.package,
        startedAt: payment.startedAt,
        endAt: payment.endAt,
        paidAmount: payment.paidAmount,
        dueAmount: payment.dueAmount,
        paymentStatus: payment.paymentStatus,
        isActive: payment.isActive,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error in getPaymentById:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get payment",
      },
    };
  }
};

export const paymentQueryHandler = {
  getAllPayments,
  getPaymentById,
};