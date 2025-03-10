/**
 * @testenv-recycler-count 2
 */

import {
  stackCreateSucceeded,
  stackDeleteSucceeded,
} from "../../src/commands/common"
import { executeBootstrapTargetsCommand } from "../../src/commands/targets/bootstrap-targets"
import { executeTeardownTargetsCommand } from "../../src/commands/targets/tear-down-targets"

const projectDir = `${process.cwd()}/integration-test/configs/deployment-targets/simple`

describe("Bootstrapping", () => {
  test("Bootstrap all", () =>
    executeBootstrapTargetsCommand({
      projectDir,
      configFile: "targets-4.yml",
    })
      .expectCommandToSucceed()
      .expectResults({
        deploymentGroupPath: "Example",
        targetResults: [
          {
            name: "two",
            success: true,
            status: "SUCCESS",
            configSetResults: [
              {
                configSet: "logs2",
                commandPathResults: [
                  {
                    commandPath: "/logs-2.yml",
                    stackResults: [
                      stackCreateSucceeded({
                        stackPath: "/logs-2.yml/eu-west-1",
                        stackName: "logs-2",
                      }),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })
      .assert())

  test("Tear down all", () =>
    executeTeardownTargetsCommand({
      configFile: "targets-4.yml",
      projectDir,
    })
      .expectCommandToSucceed()
      .expectResults({
        deploymentGroupPath: "Example",
        targetResults: [
          {
            name: "two",
            success: true,
            status: "SUCCESS",
            configSetResults: [
              {
                configSet: "logs2",
                commandPathResults: [
                  {
                    commandPath: "/logs-2.yml",
                    stackResults: [
                      stackDeleteSucceeded({
                        stackPath: "/logs-2.yml/eu-west-1",
                        stackName: "logs-2",
                      }),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })
      .assert())
})
