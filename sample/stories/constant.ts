import { faker } from '@faker-js/faker';

const pick = (from: string[]) => from[Math.floor((Math.random() * 10) % from.length)];
const createImagePool = () => {
  const avatar = Array.from({ length: 20 }).map(() => faker.image.avatar());
  const animals = Array.from({ length: 20 }).map(() => faker.image.animals());

  return avatar.concat(animals);
};

const imagePool = createImagePool();
export const getMockImage = () => pick(imagePool);
