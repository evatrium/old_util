
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const getRandomOneOf = (arr) => arr[getRandomInt(0, arr.length - 1)];

