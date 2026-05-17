import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Node Express TypeScript API",
    version: "1.0.0",
    description: "Production ready Express.js API with TypeScript"
  },
  servers: [
    {
      url: "/api/v1"
    }
  ],
  tags: [
    {
      name: "Health",
      description: "Health check endpoints"
    }
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check endpoint",
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                example: {
                  success: true,
                  message: "Server is running"
                }
              }
            }
          }
        }
      }
    }
  }
};

export const setupSwagger = (app: Express): void => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
