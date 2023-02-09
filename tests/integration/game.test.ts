import app from "../../src/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import { createConsole } from "../factories/console.factory";
import { createGame, generateGame } from "../factories/game.factory";

beforeAll(async () => {
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("/GET games", () => {
  it("should respond with status 200 and list of games", async () => {
    const console = await createConsole();
    const game = await createGame(console.id);

    const response = await server.get("/games");

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: game.id,
        title: game.title,
        consoleId: game.consoleId,
        Console: {
          id: console.id,
          name: console.name,
        },
      }),
    ]);
  });
});

describe("/POST games", () => {
  it("should respond with status 409 if game already exists", async () => {
    const console = await createConsole();
    const game = await createGame(console.id);

    const body = {
      title: game.title,
      consoleId: game.consoleId,
    };

    const response = await server.post("/games").send(body);

    expect(response.status).toEqual(httpStatus.CONFLICT);
  });

  it("should respond with status 409 console not exists", async () => {
    const body = await generateGame(9999);

    const response = await server.post("/games").send(body);

    expect(response.status).toEqual(httpStatus.CONFLICT);
  });

  it("should respond with status 201 when game created", async () => {
    const console = await createConsole();
    const body = await generateGame(console.id);

    const response = await server.post("/games").send(body);

    expect(response.status).toEqual(httpStatus.CREATED);
  });
});
