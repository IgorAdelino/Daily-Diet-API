import { expect, beforeAll, afterAll, describe, it, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "node:child_process";

beforeAll(async () => {
  await app.ready();
});
afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  execSync("npm run knex migrate:rollback --all");
  execSync("npm run knex migrate:latest");
});

describe("UserRoutes", async () => {
  it("should be able to create one user", async () => {
    await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" })
      .expect(201);
  });
  it("should be able to list all users", async () => {
    const userResponse = await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" });
    const cookies = userResponse.get("Set-Cookie");

    const listAllTheUsers = await request(app.server)
      .get("/user")
      .set("Cookie", cookies)
      .expect(200);

    expect(listAllTheUsers.body.userList).toEqual([
      expect.objectContaining({ name: "Igor Adelino" }),
    ]);
  });
  it("should be able to list an unique user", async () => {
    const userResponse = await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" });
    const cookies = userResponse.get("Set-Cookie");

    const listAllTheUsers = await request(app.server)
      .get("/user")
      .set("Cookie", cookies)
      .expect(200);

    const userId = listAllTheUsers.body.userList[0].id;

    const listAUniqueUser = await request(app.server)
      .get(`/user/${userId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(listAUniqueUser.body.user).toEqual(
      expect.objectContaining({ name: "Igor Adelino" })
    );
  });
  it("should be able to update an unique user", async () => {
    const userResponse = await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" });
    const cookies = userResponse.get("Set-Cookie");

    const listAllTheUsers = await request(app.server)
      .get("/user")
      .set("Cookie", cookies)
      .expect(200);

    const userId = listAllTheUsers.body.userList[0].id;

    const updateAnUser = await request(app.server)
      .patch(`/user/${userId}`)
      .set("Cookie", cookies)
      .send({ name: "Igor Adelino Gomes" });

    const listAUniqueUser = await request(app.server)
      .get(`/user/${userId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(listAUniqueUser.body.user).toEqual(
      expect.objectContaining({ name: "Igor Adelino Gomes" })
    );
  });
  it("should be able delete an unique user", async () => {
    const userResponse = await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" });
    const cookies = userResponse.get("Set-Cookie");

    const listAllTheUsers = await request(app.server)
      .get("/user")
      .set("Cookie", cookies)
      .expect(200);

    const userId = listAllTheUsers.body.userList[0].id;

    const DeleteAnUser = await request(app.server)
      .delete(`/user/${userId}`)
      .set("Cookie", cookies);

    const listAUniqueUser = await request(app.server)
      .get(`/user/${userId}`)
      .set("Cookie", cookies)
      .expect(404);

    expect(listAUniqueUser.body.user).toEqual(expect.objectContaining({}));
  });
});

describe("DietRoutes", async () => {
  it("should be able to create one meal", async () => {
    const userResponse = await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" })
      .expect(201);
    const cookies = userResponse.get("Set-Cookie");
    const mealResponse = await request(app.server)
      .post("/user/meals")
      .set("Cookie", cookies)
      .send({ meal: "Meat", description: "100g", onDiet: "yes" })
      .expect(201);
  });

  it("should be able to list all meals", async () => {
    const userResponse = await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" })
      .expect(201);
    const cookies = userResponse.get("Set-Cookie");
    const mealResponse = await request(app.server)
      .post("/user/meals")
      .set("Cookie", cookies)
      .send({ meal: "Meat", description: "100g", onDiet: "yes" });

    const listAllMeals = await request(app.server)
      .get("/user/meals")
      .set("Cookie", cookies)
      .expect(200);

    expect(listAllMeals.body.mealList).toEqual([
      expect.objectContaining({ Meal: "Meat" }),
    ]);
  });

  it("should be able to list an unique meal", async () => {
    const userResponse = await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" })
      .expect(201);
    const cookies = userResponse.get("Set-Cookie");
    const mealResponse = await request(app.server)
      .post("/user/meals")
      .set("Cookie", cookies)
      .send({ meal: "Meat", description: "100g", onDiet: "yes" });

    const listAllMeals = await request(app.server)
      .get("/user/meals")
      .set("Cookie", cookies)
      .expect(200);

    const mealId = listAllMeals.body.mealList[0].id;

    const listAMeal = await request(app.server)
      .get(`/user/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(listAMeal.body.meal).toEqual(
      expect.objectContaining({ Meal: "Meat" })
    );
  });
  it("should be able to update an unique meal", async () => {
    const userResponse = await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" })
      .expect(201);
    const cookies = userResponse.get("Set-Cookie");
    const mealResponse = await request(app.server)
      .post("/user/meals")
      .set("Cookie", cookies)
      .send({ meal: "Meat", description: "100g", onDiet: "yes" });

    const listAllMeals = await request(app.server)
      .get("/user/meals")
      .set("Cookie", cookies)
      .expect(200);

    const mealId = listAllMeals.body.mealList[0].id;

    const updateAMeal = await request(app.server)
      .patch(`/user/meals/${mealId}`)
      .set("Cookie", cookies)
      .send({ meal: "ice cream", description: "200g", onDiet: "no" });

    const listAMeal = await request(app.server)
      .get(`/user/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(listAMeal.body.meal).toEqual(
      expect.objectContaining({
        Meal: "ice cream",
        Description: "200g",
        onDiet: "no",
      })
    );
  });
  it("should be able to delete an unique meal", async () => {
    const userResponse = await request(app.server)
      .post("/user")
      .send({ name: "Igor Adelino" })
      .expect(201);
    const cookies = userResponse.get("Set-Cookie");
    const mealResponse = await request(app.server)
      .post("/user/meals")
      .set("Cookie", cookies)
      .send({ meal: "Meat", description: "100g", onDiet: "yes" });

    const listAllMeals = await request(app.server)
      .get("/user/meals")
      .set("Cookie", cookies)
      .expect(200);

    const mealId = listAllMeals.body.mealList[0].id;

    const updateAMeal = await request(app.server)
      .delete(`/user/meals/${mealId}`)
      .set("Cookie", cookies);

    const listAMeal = await request(app.server)
      .get(`/user/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(404);

    expect(listAMeal.body.meal).toEqual(expect.objectContaining({}));
  });
});
