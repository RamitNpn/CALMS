// openapi.ts
import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "../contract";

export const openApiDocument = generateOpenApi(contract, {
  info: {
    title: "Flowdesk API",
    version: "1.0.0",
  },
  baseUrl: "http://localhost:4000", // Your API base URL
});