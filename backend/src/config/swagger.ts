// openapi.ts
import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "../contract";

export const openApiDocument = generateOpenApi(contract, {
  info: {
    title: "PDMS API",
    version: "1.0.0",
  },
  baseUrl: "https://flowdesk-backend-786k.onrender.com", // Your API base URL
});
