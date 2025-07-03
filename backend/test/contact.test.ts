import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { web } from "../src/applications/web";
import supertest from "supertest";
import { logger } from "../src/applications/logger";
import { createTestUser, removeAllTestContact, removeTestUser } from "./utils";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set({
        authorization: "token",
      })
      .send({
        first_name: "rayzor",
        last_name: "dev",
        email: "example@example.com",
        phone: "08123456789",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("rayzor");
    expect(result.body.data.last_name).toBe("dev");
    expect(result.body.data.email).toBe("example@example.com");
    expect(result.body.data.phone).toBe("08123456789");
  });

  it("should reject if request body is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set({
        authorization: "token",
      })
      .send({});

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request body firstname and phone is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set({
        authorization: "token",
      })
      .send({
        first_name: "",
        last_name: "dev",
        email: "example@example.com",
        phone: "123123213123123321312231123",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
