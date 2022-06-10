type TestArguments = {
  it: (name: string, test: () => void) => void
  describe: (
    description: string,
    suite: (options: TestArguments) => void
  ) => void
  beforeEach: (fn: () => void) => void
  expect: ExpectChecker
}

type TestRunnerInfo = {
  name: string
  test: TestRunnerCallback
}

type TestSuiteCallback = (args: TestArguments) => Promise<void> | void
type BeforeEachCallback = () => void
type TestRunnerCallback = () => Promise<void> | void
type GenericObject = { [k: string | symbol | number]: any }

function deepEqual<T extends GenericObject>(source: T, target: T) {
  const sourceKeys = Object.keys(source)
  const targetKeys = Object.keys(target)

  if (sourceKeys.length !== targetKeys.length) {
    return false
  }

  for (const key of sourceKeys) {
    if (typeof source[key] === 'object') {
      if (!deepEqual(source[key], target[key])) {
        return false
      }

      continue
    }

    if (source[key] !== target[key]) {
      return false
    }
  }
}

const expect = {
  toBe<T>(actual: T, expected: T) {
    if (actual !== expected) {
      throw new Error(`Expected ${actual} to be ${expected}`)
    }
  },
  toStrictEqual<T>(actual: T, expected: T) {
    if (actual !== expected) {
      throw new Error(`Expected ${actual} to be strictly equal to ${expected}`)
    }
  },
  toDeepEqual<T>(actual: T, expected: T) {
    if (typeof actual !== 'object') {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be deeply equal to ${expected}`)
      }
    }

    if (!deepEqual(actual, expected)) {
      throw new Error(`Expected ${actual} to be deeply equal to ${expected}`)
    }
  },
}

type ExpectChecker = typeof expect

let tabs = -1

const padLog = (...args: any[]) => {
  const outputTabs = ''.padStart(tabs, '\t')

  console.log(outputTabs, ...args)
}

const padLogSuccess = (...args: any[]) => {
  const outputTabs = ''.padStart(tabs, '\t')

  console.log(outputTabs, '\u001b[32m✓\u001b[0m', ...args)
}

const padLogError = (...args: any[]) => {
  const outputTabs = ''.padStart(tabs, '\t')

  console.log(outputTabs, '\u001b[31m✗\u001b[0m', ...args)
}

const describe = async (description: string, suite: TestSuiteCallback) => {
  tabs++
  padLog(description)

  const tests: TestRunnerInfo[] = []
  const beforeEachCallbacks: BeforeEachCallback[] = []

  const it = (name: string, test: TestRunnerCallback) => {
    tests.push({
      name,
      test,
    })
  }

  const beforeEach = (fn: BeforeEachCallback) => {
    beforeEachCallbacks.push(fn)
  }

  suite({
    it,
    describe,
    beforeEach,
    expect,
  })

  tabs++

  for (const { name, test } of tests) {
    try {
      beforeEachCallbacks.forEach((fn) => fn())
      test()
      padLogSuccess(`\u001b[38;5;60m${name}\u001b[0m`)
    } catch (err) {
      padLogError(`\u001b[38;5;60m${name}\u001b[0m`)
    }
  }

  tabs--
  tabs--
}

export default describe
