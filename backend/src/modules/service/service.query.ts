import { AppRouteQueryImplementation } from "@ts-rest/express";
import { serviceContract } from "../../contract/service/service.contract";
import serviceRepository from "../../repository/service.repository";
import businessServiceConfigRepository from "../../repository/business-service-config.repository";

// Get all MASTER services
export const getAllServices: AppRouteQueryImplementation<
  typeof serviceContract.getAllServices
> = async () => {
  try {
    const services = await serviceRepository.getAll();

    const formattedServices = services.map((service: any) => {
      return {
        _id: service._id.toString(),
        service_key: service.service_key,
        default_name: service.default_name,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      };
    });

    return {
      status: 200,
      body: formattedServices,
    };
  } catch (error) {
    console.error("❌ GET ALL SERVICES ERROR:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch services",
      },
    };
  }
};

// Get MASTER service by ID
export const getServiceByID: AppRouteQueryImplementation<
  typeof serviceContract.getServiceByID
> = async ({ req }) => {
  try {
    const { serviceID } = req.params;

    const service = await serviceRepository.getByID(serviceID);

    if (!service) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Service not found",
        },
      };
    }
    const formattedService = {
      _id: service._id.toString(),
      service_key: service.service_key,
      default_name: service.default_name,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
    return {
      status: 200,
      body: formattedService,
    };
  } catch (error) {
    console.error("GET SERVICE BY ID ERROR:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch service",
      },
    };
  }
};

export const getServiceByBusinessID: AppRouteQueryImplementation<
  typeof serviceContract.getServiceByBusinessID
> = async ({ req }) => {
  try {
    const { businessID } = req.params;

    // 1. Fetch the single document configuration from the repository
    const configDoc =
      await businessServiceConfigRepository.getByBusinessID(businessID);

    // 2. If no config profile exists at all in the database, return a clean 404
    if (!configDoc) {
      return {
        status: 404,
        body: {
          success: false,
          error: "No service configuration found for this business ID.",
        },
      };
    }

    // 3. Map the subdocuments array into the flat format expected by ts-rest contract
    // If the services array is empty, this safely evaluates to an empty array []
    const flattenedServices = (configDoc.services || []).map((service) => ({
      _id: configDoc._id.toString(), // The unique MongoDB document identifier
      service_key: service.service_key,
      default_name: service.default_name,
      custom_name: service.custom_name ?? null,
      enabled: service.enabled,
      permissions: {
        create: service.permissions?.create ?? true,
        edit: service.permissions?.edit ?? true,
        delete: service.permissions?.delete ?? false,
        view: service.permissions?.view ?? true,
      },
      createdAt: configDoc.createdAt,
      updatedAt: configDoc.updatedAt,
    }));

    // 4. Return the flattened array matching your contract validation schema
    return {
      status: 200,
      body: flattenedServices,
    };
  } catch (error) {
    console.error("GET SERVICE BY ID ERROR:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to process business service records.",
      },
    };
  }
};
export const serviceQueryHandler = {
  getAllServices,
  getServiceByID,
  getServiceByBusinessID,
};
