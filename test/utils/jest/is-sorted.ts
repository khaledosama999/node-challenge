function isSorted<T, U>(array: T[], extractor: (x: T) => U | T = (x) => x, descending = true) {
  for (let i = 1; i < array.length; i++) {
    const currentValue = extractor(array[i]);
    const previousValue = extractor(array[i - 1]);

    if (descending) {
      if (currentValue > previousValue) {
        return {
          message: () => `Element number ${i} is bigger than the previous element`,
          pass: false,
        };
      }
    } else if (currentValue < previousValue) {
      return {
        message: () => `Element number ${i} is smaller than the previous element`,
        pass: false,
      };
    }
  }

  return {
    message: () => 'Array is sorted',
    pass: true,
  };
}

expect.extend({
  isSorted,
});
