import { exec } from "child_process"
import { prepareAwsEnvVariables } from "../../../src/takomo-aws-clients"
import { parseYamlString } from "../../../src/takomo-util"
import { assertRecursively } from "../assertions"
import { CustomNodeJsGlobal } from "../global"

// Make references to global namespace work
declare const global: CustomNodeJsGlobal

interface CliAssertions {
  readonly expectJson: (expected: unknown) => CliAssertions
  readonly expectYaml: (expected: unknown) => CliAssertions
  readonly assert: () => void
}

type CliAssertion = (stdout: string) => void

interface CreateCliAssertionsProps {
  readonly executor: () => Promise<string>
  readonly assertions: ReadonlyArray<CliAssertion>
}

const createCliAssertions = (
  props: CreateCliAssertionsProps,
): CliAssertions => {
  const expectJson = (expected: unknown): CliAssertions => {
    const assertion = (stdout: string) => {
      console.log(`stdout:\n${stdout}`)
      const actual = JSON.parse(stdout)
      assertRecursively(actual, expected)
    }

    return createCliAssertions({
      ...props,
      assertions: [...props.assertions, assertion],
    })
  }

  const expectYaml = (expected: unknown): CliAssertions => {
    const assertion = (stdout: string) => {
      console.log(`stdout:\n${stdout}`)
      const actual = parseYamlString(stdout)
      assertRecursively(actual, expected)
    }

    return createCliAssertions({
      ...props,
      assertions: [...props.assertions, assertion],
    })
  }

  const assert = async (): Promise<void> => {
    const stdout = await props.executor()
    props.assertions.forEach((assertion) => assertion(stdout))
  }

  return {
    expectJson,
    expectYaml,
    assert,
  }
}

export const executeWithCli = (command: string): CliAssertions => {
  const credentials = global.reservation.credentials

  const vars = global.reservation
    ? global.reservation.accounts
        .map((slot, index) => ` --var ACCOUNT_${index + 1}_ID=${slot.id}`)
        .join("")
    : ""

  const env = prepareAwsEnvVariables({ credentials, env: process.env })

  const executor = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      exec(`${command}${vars}`, { env }, (err, stdout, stderr) => {
        if (err) {
          console.log("Stderr:\n" + stderr)
          console.log("Stdout:\n" + stdout)
          console.log("Got error:", err)
          reject(err)
        }

        resolve(stdout)
      })
    })
  }

  return createCliAssertions({ executor, assertions: [] })
}
