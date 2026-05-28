import { AppRouteQueryImplementation } from "@ts-rest/express";
import { serviceContract } from "../../contract/service/service.contract";
import serviceRepository from "../../repository/service.repository";

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

export const serviceQueryHandler = {
  getAllServices,
  getServiceByID,
  getServiceByBusinessID,
};
