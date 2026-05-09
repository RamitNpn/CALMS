import { AppRouteQueryImplementation } from "@ts-rest/express";
import { billingContract } from "../../contract/billing/billing.contract";
import billingRepository from "../../repository/billing.repository";

export const getAllBillings: AppRouteQueryImplementation<
  typeof billingContract.getAllBillings
> = async ({ req }) => {
  try {
    const billings = await billingRepository.getAll();

    const formattedbillings = billings.map((i: any) => ({
      _id: i._id.toString(),
      business_id: i.business_id?.toString(),
      title: i.title,
      clientId: i.clientId.toString(),
      clientName: i.clientName,
      clientEmail: i.clientEmail,
      items: i.items,
      totalAmount: i.totalAmount,
      paidAmount: i.paidAmount,
      paymentMethod: i.paymentMethod,
      recipt: i.recipt,
      status: i.status,
      dueDate: i.dueDate,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    }));

    return {
      status: 200,
      body: formattedbillings,
    };
  } catch (error) {
    console.error("Error in getAllbillings:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get all billings",
      },
    };
  }
};

export const getBillingByID: AppRouteQueryImplementation<
  typeof billingContract.getBillingByID
> = async ({ req }) => {
  try {
    const { billingID } = req.params;

    if (!billingID) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Billing ID is required",
        },
      };
    }

    const billing = await billingRepository.getByID(billingID);

    if (!billing) {
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
        _id: billing._id.toString(),
        business_id: billing.business_id?.toString(),
        title: billing.title,
        clientId: billing.clientId.toString(),
        clientName: billing.clientName,
        clientEmail: billing.clientEmail,
        items: billing.items,
        totalAmount: billing.totalAmount,
        paidAmount: billing.paidAmount,
        paymentMethod: billing.paymentMethod,
        recipt: billing.recipt,
        status: billing.status,
        dueDate: billing.dueDate,
        createdAt: billing.createdAt,
        updatedAt: billing.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error in getbillingByID:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get billing by ID",
      },
    };
  }
};


export const billingQueryHandler = {
  getAllBillings,
  getBillingByID,
};