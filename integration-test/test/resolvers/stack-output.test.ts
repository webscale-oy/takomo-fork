import { executeDeployStacksCommand } from "../../src/commands/stacks"

const projectDir = `${process.cwd()}/integration-test/configs/resolvers/stack-output`

describe("Stack output resolvers", () => {
  test("Deploy", () =>
    executeDeployStacksCommand({ projectDir })
      .expectCommandToSucceed()
      .expectStackCreateSuccess({
        stackName: "vpc",
        stackPath: "/vpc.yml/eu-west-1",
      })
      .expectStackCreateSuccess({
        stackName: "security-groups",
        stackPath: "/security-groups.yml/eu-west-1",
      })
      .assert())
})
