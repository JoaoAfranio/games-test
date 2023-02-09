import { faker } from "@faker-js/faker";
import prisma from "../../src/config/database";

export async function createGame(consoleId: number) {
  return await prisma.game.create({
    data: {
      title: faker.random.word(),
      consoleId,
    },

    include: {
      Console: true,
    },
  });
}

export async function generateGame(consoleId: number) {
  return {
    title: faker.random.word(),
    consoleId,
  };
}
