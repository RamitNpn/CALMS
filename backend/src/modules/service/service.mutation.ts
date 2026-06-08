import { AppRouteMutationImplementation } from "@ts-rest/express";
import { serviceContract } from "../../contract/service/service.contract";
import serviceRepository from "../../repository/service.repository";

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
};