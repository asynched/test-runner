import describe from '../lib/suite'

class Calculator {
  add(a: number, b: number): number {
    return a + b
  }

  subtract(a: number, b: number): number {
    return a - b
  }
}

describe('Calculator', ({ describe, it, expect }) => {
  const calculator = new Calculator()

  it('should be none', () => {
    expect.toBe(null, null)
  })

  describe('Calculator.add()', ({ it, expect }) => {
    it('should add two numbers', () => {
      expect.toBe(calculator.add(1, 2), 3)
    })
  })

  describe('Calculator.subtract()', ({ it, expect }) => {
    it('should subtract two numbers', () => {
      expect.toBe(calculator.subtract(1, 2), 0)
    })
  })
})
