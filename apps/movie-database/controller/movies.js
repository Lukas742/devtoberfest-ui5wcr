import { Router } from "express";
import { readFileSync } from "node:fs";
import { readMovieReviewForId } from "../util.js";

const router = Router();

const movies = JSON.parse(readFileSync("movies.json").toString());

router.get("/", (req, res) => {
  // #swagger.summary = 'List of all movies'
  // #swagger.responses[200] = { schema: { $ref: '#/definitions/Movie' } }
  res.json(
    movies.map((mov) => ({
      id: mov.id,
      title: mov.title,
      year: mov.year,
      revenue: mov.revenue,
    })),
  );
});

router.get("/:id", (req, res) => {
  // #swagger.summary = 'Details of a given movie'
  // #swagger.responses[200] = { schema: { $ref: '#/definitions/MovieDetails' } }
  // #swagger.responses[404] = { schema: { $ref: '#/definitions/Error' } }
  const movieId = req.params.id;
  const movie = movies.find((mov) => mov.id === movieId);
  if (movie) {
    const reviews = readMovieReviewForId(movieId);
    const rating =
      reviews.reduce((acc, val) => acc + val.rating, 0) / reviews.length;
    movie.rating = Math.round(rating * 10) / 10;
    res.json(movie);
  } else {
    res.status(404).json({
      error: `Movie with ID ${movieId} not found`,
    });
  }
});

export default router;
