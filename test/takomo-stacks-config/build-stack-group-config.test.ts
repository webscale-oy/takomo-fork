import { mock } from "jest-mock-extended"
import { AwsClientProvider } from "../../src/takomo-aws-clients"
import { TagKey } from "../../src/takomo-aws-model"
import { CommandContext, TakomoProjectConfig } from "../../src/takomo-core"
import { buildStackGroupConfig } from "../../src/takomo-stacks-config"
import { RawTagValue } from "../../src/takomo-stacks-model"

const emptyStackGroupConfig = {
  commandRole: undefined,
  data: {},
  hooks: [],
  project: undefined,
  regions: [],
  accountIds: undefined,
  tags: new Map(),
  templateBucket: undefined,
  timeout: undefined,
  capabilities: undefined,
  ignore: undefined,
  obsolete: undefined,
  terminationProtection: undefined,
  stackPolicy: undefined,
  stackPolicyDuringUpdate: undefined,
  schemas: undefined,
  inheritTags: true,
}

const ctx: CommandContext = {
  confidentialValuesLoggingEnabled: false,
  variables: {
    env: {},
    context: {
      projectDir: "/tmp",
    },
    var: {},
  },
  resetCache: false,
  logLevel: "info",
  regions: [],
  autoConfirmEnabled: true,
  projectDir: "/tmp",
  statisticsEnabled: false,
  iamGeneratePoliciesInstructionsEnabled: false,
  credentials: undefined,
  projectConfig: mock<TakomoProjectConfig>(),
  awsClientProvider: mock<AwsClientProvider>(),
  quiet: false,
  outputFormat: "text",
}

describe("#buildStackGroupConfig", () => {
  test("returns an empty object when an empty object is given", () => {
    expect(buildStackGroupConfig(ctx, {})._unsafeUnwrap()).toStrictEqual(
      emptyStackGroupConfig,
    )
  })

  test("returns a correctly created object a non-empty file is given", () => {
    expect(
      buildStackGroupConfig(ctx, {
        project: "example-project",
        regions: "eu-west-1",
        timeout: {
          update: 10,
          create: 5,
        },
        tags: {
          first: 1,
          second: "b",
        },
      })._unsafeUnwrap(),
    ).toStrictEqual({
      commandRole: undefined,
      data: {},
      hooks: [],
      project: "example-project",
      regions: ["eu-west-1"],
      accountIds: undefined,
      tags: new Map<TagKey, RawTagValue>([
        ["first", 1],
        ["second", "b"],
      ]),
      inheritTags: true,
      templateBucket: undefined,
      terminationProtection: undefined,
      stackPolicy: undefined,
      stackPolicyDuringUpdate: undefined,
      schemas: undefined,
      timeout: {
        update: 10,
        create: 5,
      },
      capabilities: undefined,
      ignore: undefined,
      obsolete: undefined,
    })
  })
})
