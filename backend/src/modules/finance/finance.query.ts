import { AppRouteQueryImplementation } from "@ts-rest/express";
import financeRepository from "../../repository/finance.repository";
import { financeContract } from "../../contract/finance/finance.contract";

export const getAllFinance: AppRouteQueryImplementation<
  typeof financeContract.getAllFinance
> = async ({ req }) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const business_id = req.query.business_id as string | undefined;
    const skip = (page - 1) * limit;

    const { data: records, total } = await financeRepository.getAll(
      business_id,
      skip,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    const formattedRecords = records.map((r) => ({
      _id: r._id.toString(),

      business_id: r.business_id.toString(),

      title: r.title,

      type: r.type,

      category: r.category,

      amount: r.amount,

      relatedTo: r.relatedTo ?? undefined,

      objectType: r.objectType ?? undefined,

      objectId: r.objectId ?? undefined,

      paymentMethod: r.paymentMethod ?? undefined,

      referenceNumber: r.referenceNumber ?? undefined,

      description: r.description ?? undefined,

      status: r.status ?? undefined,

      transactionDate: r.transactionDate,

      createdBy: r.createdBy?.toString() ?? undefined,

      createdAt: r.createdAt,

      updatedAt: r.updatedAt,
    }));

    return {
      status: 200,

      body: {
        data: formattedRecords,

        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllFinancialRecords:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get all financial records",
      },
    };
  }
};

export const getFinanceByID: AppRouteQueryImplementation<
  typeof financeContract.getFinanceByID
> = async ({ req }) => {
  const { financeID } = req.params;

  if (!financeID) {
    return {
      status: 400,

      body: {
        success: false,
        error: "Finance Record ID is required",
      },
    };
  }

  try {
    const financialRecord = await financeRepository.getByID(financeID);

    if (!financialRecord) {
      return {
        status: 404,

        body: {
          success: false,
          error: "Financial record not found",
        },
      };
    }

    return {
      status: 200,

      body: {
        _id: financialRecord._id.toString(),
        business_id: financialRecord.business_id.toString(),
        title: financialRecord.title,
        type: financialRecord.type,
        category: financialRecord.category,
        amount: financialRecord.amount,
        relatedTo: financialRecord.relatedTo ?? undefined,
        objectType: financialRecord.objectType ?? undefined,
        objectId: financialRecord.objectId ?? undefined,
        paymentMethod: financialRecord.paymentMethod ?? undefined,
        referenceNumber: financialRecord.referenceNumber ?? undefined,
        description: financialRecord.description ?? undefined,
        status: financialRecord.status ?? undefined,
        createdBy: financialRecord.createdBy?.toString() ?? undefined,
        transactionDate: financialRecord.transactionDate,
        createdAt: financialRecord.createdAt,
        updatedAt: financialRecord.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error in getFinancialRecordByID:", error);

    return {
      status: 500,

      body: {
        success: false,
        error: "Failed to get financial record",
      },
    };
  }
};

export const financeQueryHandler = {
  getAllFinance,
  getFinanceByID,
};
