import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meteo Hub API",
      version: "1.0.0",
      description: "Documentação da API do Meteo Hub",
      contact: {
        name: "Meteo Hub Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Servidor de Desenvolvimento",
      },
    ],
  },
  apis: ["./server/routes/*.ts", "./server/controllers/*.ts"], // Caminho para os arquivos com anotações JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);
