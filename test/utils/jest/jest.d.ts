declare namespace jest {
  // eslint-disable-next-line
  interface Matchers<R> {
    toThrowUnauthorized: (expected: string) => jest.CustomMatcherResult
    toThrowBadRequest: (expected: string) => jest.CustomMatcherResult
    toThrowConflict: (expected: string) => jest.CustomMatcherResult
    toThrowInternalError: (expected: string) => jest.CustomMatcherResult
    toThrowNotFound: (expected: string) => jest.CustomMatcherResult
    isSorted: <T, U>(extractor: (x: T) => U | T, descending: boolean) => jest.CustomMatcherResult
  }

  interface Expect {
    toThrowUnauthorized: (expected: string) => jest.CustomMatcherResult
    toThrowBadRequest: (expected: string) => jest.CustomMatcherResult
    toThrowConflict: (expected: string) => jest.CustomMatcherResult
    toThrowInternalError: (expected: string) => jest.CustomMatcherResult
    toThrowNotFound: (expected: string) => jest.CustomMatcherResult
    isSorted: <T, U>(extractor: (x: T) => U | T, descending: boolean) => jest.CustomMatcherResult
  }
}
