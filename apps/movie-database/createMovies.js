import { readFileSync, writeFileSync } from "node:fs";
import { en, Faker } from "@faker-js/faker";

const faker = new Faker({ locale: [en] });

const movies = JSON.parse(readFileSync("movies.json").toString());

for (const movie of movies) {
  console.log(movie);

  movie.revenue = parseInt(movie.revenue.replace("$", "").replaceAll(",", ""));

  writeFileSync(`movies/${movie.id}.json`, JSON.stringify(movie, null, 2));

  // const reviews = []
  //
  // for (let i = 0; i < Math.floor(Math.random() * 11) + 4; i++) {
  //     const name = faker.person.firstName();
  //     const rating = faker.number.int({min: 1, max: 5});
  //     const comment = faker.lorem.paragraph({min: 1, max: 4})
  //     reviews.push({name, rating, comment })
  // }
  //
  // writeFileSync(`reviews/${movie.id}.json`, JSON.stringify(reviews, null, 2));
}
