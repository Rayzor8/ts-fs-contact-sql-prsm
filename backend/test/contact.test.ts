import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { web } from "../src/applications/web";
import supertest from "supertest";
import { logger } from "../src/applications/logger";
import {
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestContact,
  removeTestUser,
} from "./utils";

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

describe("GET /api/contacts/:id", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can get contact", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get(`/api/contacts/${testContact?.id}`)
      .set({
        authorization: "token",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact?.id);
    expect(result.body.data.first_name).toBe(testContact?.first_name);
    expect(result.body.data.last_name).toBe(testContact?.last_name);
    expect(result.body.data.email).toBe(testContact?.email);
    expect(result.body.data.phone).toBe(testContact?.phone);
  });

  it("should reject if id is invalid", async () => {
    const result = await supertest(web)
      .get(`/api/contacts/${Math.random() * 100}`)
      .set({
        authorization: "token",
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Contact is not found");
  });
});

describe("PUT /api/contacts/:id", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should be able to update existing contact", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .put(`/api/contacts/${testContact?.id}`)
      .set({
        authorization: "token",
      })
      .send({
        first_name: "rayzor updated",
        last_name: "dev updated",
        email: "example-updated@example.com",
        phone: "08123123123",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact?.id);
    expect(result.body.data.first_name).toBe("rayzor updated");
    expect(result.body.data.last_name).toBe("dev updated");
    expect(result.body.data.email).toBe("example-updated@example.com");
    expect(result.body.data.phone).toBe("08123123123");
  });

  it("should reject if request body is invalid", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .put(`/api/contacts/${testContact?.id}`)
      .set({
        authorization: "token",
      })
      .send({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if contact is not found", async () => {
    const result = await supertest(web)
      .put(`/api/contacts/${Math.random() * 100}`)
      .set({
        authorization: "token",
      })
      .send({
        first_name: "rayzor updated",
        last_name: "dev updated",
        email: "example-updated@example.com",
        phone: "08123123123",
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Contact is not found");
  });
});
