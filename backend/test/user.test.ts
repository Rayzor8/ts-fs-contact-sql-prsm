import { afterEach, describe, expect, it } from "@jest/globals";
import { web } from "../src/applications/web";
import supertest from "supertest";
import prisma from "../src/applications/database";
import { logger } from "../src/applications/logger";

describe("POST /api/users", () => {
  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        username: "rayzor",
      },
    });
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
