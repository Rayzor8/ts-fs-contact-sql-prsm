import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { web } from "../src/applications/web";
import supertest from "supertest";
import { logger } from "../src/applications/logger";
import {
  createTestAddress,
  createTestContact,
  createTestUser,
  getTestAddress,
  getTestContact,
  removeAllTestAddress,
  removeAllTestContact,
  removeTestUser,
} from "./utils";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddress();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can create new address", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .post(`/api/contacts/${testContact?.id}/addresses`)
      .set({
        authorization: "token",
      })
      .send({
        street: "street 1",
        city: "city 1",
        province: "province 1",
        country: "country 1",
        postal_code: "12345",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("street 1");
    expect(result.body.data.city).toBe("city 1");
    expect(result.body.data.province).toBe("province 1");
    expect(result.body.data.country).toBe("country 1");
    expect(result.body.data.postal_code).toBe("12345");
  });

  it("should reject if request body is invalid", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .post(`/api/contacts/${testContact?.id}/addresses`)
      .set({
        authorization: "token",
      })
      .send({
        street: "street 1", // street is optional
        city: "city 1", // city is optional
        province: "province 1", // province is optional
        country: "", // country is required
        postal_code: "", // postal code is required
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if contact not found", async () => {
    const result = await supertest(web)
      .post(`/api/contacts/${Math.random() * 100}/addresses`)
      .set({
        authorization: "token",
      })
      .send({
        street: "street 1",
        city: "city 1",
        province: "province 1",
        country: "country 1",
        postal_code: "12345",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Contact is not found");
  });
});

describe("GET /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddress();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should can get address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/${testContact?.id}/addresses/${testAddress?.id}`)
      .set({
        authorization: "token",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testAddress?.id);
    expect(result.body.data.street).toBe(testAddress?.street);
    expect(result.body.data.city).toBe(testAddress?.city);
    expect(result.body.data.province).toBe(testAddress?.province);
    expect(result.body.data.country).toBe(testAddress?.country);
    expect(result.body.data.postal_code).toBe(testAddress?.postal_code);
  });

  it("should reject if contact id is invalid", async () => {
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/${Math.random() * 100}/addresses/${testAddress?.id}`)
      .set({
        authorization: "token",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Contact is not found");
  });

  it("should reject if address id is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${testContact?.id}/addresses/${Math.random() * 100}`)
      .set({
        authorization: "token",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Address is not found");
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddress();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should be able to update existing address", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put(`/api/contacts/${testContact?.id}/addresses/${testAddress?.id}`)
      .set({
        authorization: "token",
      })
      .send({
        street: "street updated",
        city: "city updated",
        province: "province updated",
        country: "country updated",
        postal_code: "1999",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testAddress?.id);
    expect(result.body.data.street).toBe("street updated");
    expect(result.body.data.city).toBe("city updated");
    expect(result.body.data.province).toBe("province updated");
    expect(result.body.data.country).toBe("country updated");
    expect(result.body.data.postal_code).toBe("1999");
  });

  it("should reject if contact id is invalid", async () => {
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/${Math.random() * 100}/addresses/${testAddress?.id}`)
      .set({
        authorization: "token",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Contact is not found");
  });

  it("should reject if address id is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${testContact?.id}/addresses/${Math.random() * 100}`)
      .set({
        authorization: "token",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Address is not found");
  });

  it("should reject if request body is invalid", async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();
    const result = await supertest(web)
      .put(`/api/contacts/${testContact?.id}/addresses/${testAddress?.id}`)
      .set({
        authorization: "token",
      })
      .send({
        street: "street updated", // street is optional
        city: "city 1 updated", // city is optional
        province: "", // province is optional
        country: "", // country is required
        postal_code: "", // postal code is required
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddress();
    await removeAllTestContact();
    await removeTestUser();
  });

  it("should be able to delete existing address", async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete(`/api/contacts/${testContact?.id}/addresses/${testAddress?.id}`)
      .set({
        authorization: "token",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Success remove address");

    testAddress = await getTestAddress();
    expect(testAddress).toBeNull();
  });

  it("should reject if contact id is invalid", async () => {
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/${Math.random() * 100}/addresses/${testAddress?.id}`)
      .set({
        authorization: "token",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Contact is not found");
  });

  it("should reject if address id is invalid", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${testContact?.id}/addresses/${Math.random() * 100}`)
      .set({
        authorization: "token",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBe("Address is not found");
  });
});
