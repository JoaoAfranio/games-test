import app from "../../src/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import { createConsole } from "../factories/console.factory";

beforeAll(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("/GET consoles", () => {
  it("should respond with status 200 and list of consoles", async () => {
    const console = await createConsole();

    const response = await server.get("/consoles");

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: console.id,
        name: console.name,
      }),
    ]);
  });
});

describe("/GET consoles/:id", () => {
  it("should respond with status 404 if console not exists", async () => {
    const response = await server.get("/consoles/99999");

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with status 200 if console exists and console data", async () => {
    const console = await createConsole();

    const response = await server.get(`/consoles/${console.id}`);

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual({
      id: console.id,
      name: console.name,
    });
  });
});
