import { Router } from "express";
import { writeFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { readMovieReviewForId } from "../util.js";

const router = Router();

router.get("/:id/reviews", (req, res) => {
  // #swagger.summary = 'Reviews of a given movie'
  // #swagger.responses[200] = { schema: { $ref: '#/definitions/Review' } }
  // #swagger.responses[404] = { schema: { $ref: '#/definitions/Error' } }
  const movieId = req.params.id;
  try {
    const reviews = readMovieReviewForId(movieId);
    reviews.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    res.json(reviews);
  } catch {
    res.status(404).json({
      error: `No reviews for movie with ID ${movieId} not found`,
    });
  }
});

router.post("/:id/reviews", (req, res) => {
  // #swagger.summary = 'Create a new review'
  // #swagger.parameters['body'] = { in: 'body', description: 'Create a new review', schema: { $ref: '#/definitions/Review' } }
  // #swagger.responses[400] = { schema: { $ref: '#/definitions/Error' } }
  // #swagger.responses[500] = { schema: { $ref: '#/definitions/Error' } }
  const movieId = req.params.id;
  let existingReview;
  try {
    existingReview = readMovieReviewForId(movieId);
  } catch {
    res.status(400).json({
      error: `The Movie with ID ${movieId} does not exist`,
    });
    return;
  }

  const { name, rating, comment } = req.body;
  if (!rating) {
    res.status(400).json({
      error:
        "The rating field is required and must be a number between 1 and 5",
    });
    return;
  }

  const parsedRating = parseInt(rating);
  if (parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({
      error: "The rating field must be a number between 1 and 5",
    });
  }

  try {
    const newReview = {
      name: name || null,
      rating: parsedRating,
      comment: comment ?? null,
      timestamp: new Date().toISOString(),
    };

    writeFileSync(
      fileURLToPath(new URL(`../reviews/${movieId}.json`, import.meta.url)),
      JSON.stringify([...existingReview, newReview], null, 2),
    );

    res.status(204).end();
  } catch {
    res.status(500).json({
      error: `Failed to create review for movie with ID ${movieId}`,
    });
  }
});
export default router;
