import { AppRouteQueryImplementation } from "@ts-rest/express";
import { businessContract } from "../../contract/business/business.contract";
import businessRepository from "../../repository/business.repository";
import serviceRepository from "../../repository/service.repository";
import businessServiceConfigRepository from "../../repository/business-service-config.repository";

export const getAllBusinesses: AppRouteQueryImplementation<
  typeof businessContract.getAllBusinesses
> = async ({ req }) => {
  try {
    const page = (req.query.page as unknown as number) || 1;
    const limit = (req.query.limit as unknown as number) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";
    const dateFilter = req.query.dateFilter || "all";

    const { data: businesses, total } = await businessRepository.getAll({
      skip,
      limit,
      search,
      dateFilter,
    });
    const totalPages = Math.ceil(total / limit);

    const businessIds = businesses.map((b) => b._id.toString());

    const serviceConfigs =
      await businessServiceConfigRepository.getByBusinessIDs(businessIds);

    const serviceMap = new Map(
      serviceConfigs.map((s) => [s.business_id.toString(), s.services]),
    );

    const formattedBusinesses = businesses.map((b: any) => ({
      _id: b._id.toString(),
      businessName: b.businessName,
      operatorName: b.operatorName,
      operatorEmail: b.operatorEmail,
      businessType: b.businessType,
      profile: b.profile,
      role: b.role,
      teams: b.teams,
      branch: b.branch,
      package: b.package,

      services: serviceMap.get(b._id.toString()) || [],

      status: b.status,
      payment_status: b.payment_status,
      payment_initiation: b.payment_initiation,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formattedBusinesses,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllBusinesses:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get all businesses",
      },
    };
  }
};

export const getBusinessById: AppRouteQueryImplementation<
  typeof businessContract.getBusinessById
> = async ({ req }) => {
  const { businessID } = req.params;

  if (!businessID) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Business ID is required",
      },
    };
  }

  try {
    const business = await businessRepository.getByID(businessID);

    if (!business) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Business not found",
        },
      };
    }

    const serviceConfig =
      await businessServiceConfigRepository.getByBusinessID(businessID);

    return {
      status: 200,
      body: {
        _id: business._id.toString(),
        businessName: business.businessName,
        operatorName: business.operatorName,
        operatorEmail: business.operatorEmail,
        businessType: business.businessType,
        profile: business.profile || "",
        role: business.role,
        teams: business.teams,
        branch: business.branch,
        package: business.package,

        services: serviceConfig?.services || [],

        status: business.status,
        payment_status: business.payment_status,
        payment_initiation: business.payment_initiation,
        createdAt: business.createdAt,
        updatedAt: business.updatedAt,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get business",
      },
    };
  }
};
export const businessQueryHandler = {
  getAllBusinesses,
  getBusinessById,
};
