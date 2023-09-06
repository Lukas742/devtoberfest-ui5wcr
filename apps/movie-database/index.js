import express from "express";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import swaggerFile from "./swagger.json" assert { type: "json" };
import moviesController from "./controller/movies.js";
import reviewController from "./controller/reviews.js";
import cors from "cors";

const jsonParser = bodyParser.json();

const app = express();
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get("/", (req, res) => {
  // #swagger.ignore = true
  res.redirect("/api-docs");
});

app.use(jsonParser);

app.use("/api/v1/movies", moviesController);
app.use("/api/v1/movies", reviewController);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Movie Database listening in localhost:${PORT}`);
});
