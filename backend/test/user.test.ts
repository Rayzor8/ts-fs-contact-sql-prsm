import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { web } from "../src/applications/web";
import supertest from "supertest";
import { logger } from "../src/applications/logger";
import { createTestUser, getTestUser, removeTestUser } from "./utils";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "rayzor",
      password: "secret",
      name: "Rayzordev",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("rayzor");
    expect(result.body.data.name).toBe("Rayzordev");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request body is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already exist", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "rayzor",
      password: "secret",
      name: "Rayzordev",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("rayzor");
    expect(result.body.data.name).toBe("Rayzordev");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "rayzor",
      password: "secret",
      name: "Rayzordev",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "rayzor",
      password: "secret",
    });

    logger.info(result.body, "token");

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("token");
  });

  it("should reject if request body is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username or password wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "rayzor",
      password: "wrong",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can get current user", async () => {
    const result = await supertest(web).get("/api/users/current").set({
      authorization: "token",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("rayzor");
    expect(result.body.data.name).toBe("Rayzordev");
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web).get("/api/users/current").set({
      authorization: "invalid-token",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should can update current user name and password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set({
        authorization: "token",
      })
      .send({
        username: "rayzor",
        name: "updated name",
        password: "updated password",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("rayzor");
    expect(result.body.data.name).toBe("updated name");

    const user = await getTestUser();
    const userPassword = user!.password;
    expect(await bcrypt.compare("updated password", userPassword)).toBe(true);
  });

  it("should can update user name only", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set({
        authorization: "token",
      })
      .send({
        username: "rayzor",
        name: "updated name",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("rayzor");
    expect(result.body.data.name).toBe("updated name");
  });

  it("should can update user password only", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set({
        authorization: "token",
      })
      .send({
        username: "rayzor",
        password: "updated password",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("rayzor");
    const user = await getTestUser();
    const userPassword = user!.password;
    expect(await bcrypt.compare("updated password", userPassword)).toBe(true);
  });

  it("should reject if request body is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set({
        authorization: "token",
      })
      .send({});

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if token is invalid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set({
        authorization: "invalid-token",
      })
      .send({
        username: "rayzor",
        name: "updated name",
        password: "updated password",
      });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  });
});
