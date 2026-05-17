import { AppRouteMutationImplementation } from "@ts-rest/express";
import { serviceContract } from "../../contract/service/service.contract";
import serviceRepository from "../../repository/service.repository";

const MOCK_SERVICES = [
  {
    service_key: "asset_management",
    default_name: "Asset Management",
  },

  {
    service_key: "attendance_management",
    default_name: "Attendance Management",
  },

  {
    service_key: "billing_management",
    default_name: "Billing and Payments",
  },

  {
    service_key: "business_management",
    default_name: "Business Management",
  },

  {
    service_key: "client_management",
    default_name: "Client Management",
  },

  {
    service_key: "staff_management",
    default_name: "Staff Management",
  },
];

// Initialize MASTER services (run once)
export const initializeServices: AppRouteMutationImplementation<
  typeof serviceContract.initializeService
> = async ({ req }) => {
  try {
    console.log("📋 Checking if services exist...");
    const existingCount = await serviceRepository.count();
    console.log("📊 Existing services count:", existingCount);

    if (existingCount > 0) {
      console.log("✅ Services already initialized");
      const existingServices = await serviceRepository.getAll();
      console.log("📤 Returning existing services:", existingServices.length);

      return {
        status: 200,
        body: {
          success: true,
          message: "Services already initialized",
          data: existingServices.map((service: any) => ({
            _id: service._id.toString(),
            service_key: service.service_key,
            default_name: service.default_name,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
          })),
        },
      };
    }

    console.log("🔄 Creating", MOCK_SERVICES.length, "services...");
    const createdServices = [];

    for (const serviceData of MOCK_SERVICES) {
      try {
        console.log("Attempting to create service:", JSON.stringify(serviceData));
        const created = await serviceRepository.create(serviceData);
        console.log("Service created successfully:", created._id, created.service_key);
        createdServices.push(created);
      } catch (createError) {
        console.error("ERROR creating service:", createError);
        throw createError;
      }
    }

    console.log("🎉 All services created. Fetching from DB...");
    const services = await serviceRepository.getAll();
    console.log("📤 Final services from DB:", services.length);
    console.log("📋 Services data:", JSON.stringify(services));

    return {
      status: 201,
      body: {
        success: true,
        message: "Master services initialized successfully",
        data: services.map((service: any) => ({
          _id: service._id.toString(),
          service_key: service.service_key,
          default_name: service.default_name,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        })),
      },
    };
  } catch (error) {
    console.error("INITIALIZE SERVICES ERROR - Full Error:", error);
    console.error("Error message:", (error as Error).message);
    console.error("Error stack:", (error as Error).stack);
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

// Update MASTER service
export const updateService: AppRouteMutationImplementation<
  typeof serviceContract.updateService
> = async ({ req }) => {
  try {
    const { serviceID } = req.params;

    const {
      service_key,
      default_name,
    } = req.body;

    const updated = await serviceRepository.update(
      serviceID,
      {
        service_key,
        default_name,
      }
    );

    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Service not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Service updated successfully",
        data: updated,
      },
    };
  } catch (error) {
    console.error(
      "UPDATE SERVICE ERROR:",
      error
    );
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

// Remove MASTER service
export const removeService: AppRouteMutationImplementation<
  typeof serviceContract.removeService
> = async ({ req }) => {
  try {
    const { serviceID } = req.params;
    const existing =
      await serviceRepository.getByID(serviceID);
    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Service not found",
        },
      };
    }

    const deleted =
      await serviceRepository.remove(serviceID);
    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Service was not deleted",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Service deleted successfully",
      },
    };
  } catch (error) {
    console.error(
      "REMOVE SERVICE ERROR:",
      error
    );
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const serviceMutationHandler = {
  updateService,
  removeService,
  initializeServices,
};