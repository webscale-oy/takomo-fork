import { executeDeployStacksCommand } from "../src/commands/stacks"

const projectDir = `${process.cwd()}/integration-test/configs/template-validation-error`

describe("Template validation error", () => {
  test("Is caught", () =>
    executeDeployStacksCommand({
      projectDir,
    })
      .expectCommandToFail("Failed")
      .expectStackCreateFail({
        stackPath: "/stack.yml/eu-central-1",
        stackName: "stack",
        errorMessage:
          "Template format error: Unrecognized resource types: [AWS::TypoHere::VPC]",
      })
      .assert())
})
