import { faker } from '@faker-js/faker';

const pick = (from: string[]) => from[Math.floor((Math.random() * 10) % from.length)];
const createImagePool = () => {
  const avatar = Array.from({ length: 20 }).map(() => faker.image.avatar());
  const animals = Array.from({ length: 20 }).map(() => faker.image.animals());

  return avatar.concat(animals);
};

const imagePool = createImagePool();
export const getMockImage = () => pick(imagePool);

export const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris semper enim sed quam faucibus ultrices. In sit amet velit tortor. Praesent eget tincidunt libero. Sed id volutpat eros, eget suscipit diam. Nullam sed justo orci. Pellentesque et turpis erat. Maecenas eget nisl nec ligula euismod efficitur et vel lectus. Sed eu neque tristique, elementum elit quis, lacinia enim. Integer at convallis ipsum. Mauris ac libero dignissim, volutpat dui a, imperdiet massa. In vitae erat sit amet magna laoreet rutrum et lobortis felis. In quam tortor, congue in porta et, malesuada et leo. Suspendisse potenti. Vivamus dictum nisi sit amet sem bibendum pharetra. Etiam venenatis turpis quis lacus fermentum dictum. Vivamus sollicitudin ligula ex, venenatis bibendum metus rhoncus sed.';
