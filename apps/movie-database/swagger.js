import swagger_autogen from "swagger-autogen";

const swaggerAutogen = swagger_autogen();

const doc = {
  info: {
    title: "Devtoberfest Movie Database",
    description: "Movie Database for SAP Devtoberfest 2023",
  },
  host: null,
  schemes: null,
  consumes: ["application/json"],
  produces: ["application/json"],
  definitions: {
    Movie: {
      id: "1",
      title: "A Movie Title",
      year: 2000,
      revenue: 1000000000,
    },
    MovieDetails: {
      id: "1",
      year: 2000,
      title: "A Movie Title",
      revenue: 2923706026,
      actors: [
        {
          name: "Actor Name",
          character: "Character Name",
        },
      ],
      summary: "Lorem ipsum dolor sit...",
      rating: 3.7,
    },
    Review: {
      name: "Reviewer Name",
      $rating: 5,
      comment: "Text Comment",
      timestamp: "2023-01-01T14:00:00Z",
    },
    Error: {
      error: "Error Description",
    },
  },
};
const outputFile = "./swagger.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
