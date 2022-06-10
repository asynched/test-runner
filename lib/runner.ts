import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const main = async () => {
  const cwd = process.cwd()
  const allFiles = await fs.readdir(path.join(cwd, 'src'))
  const testFiles = allFiles.filter((file) => file.endsWith('.spec.ts'))

  const testFilesPath = testFiles.map((file) => path.join(cwd, 'src', file))

  for (const file of testFilesPath) {
    await import(file)
  }
}

main()
