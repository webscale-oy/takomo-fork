import { join } from "path"
import { loadProjectConfig } from "../../src/takomo-config-repository-fs/project/config"
import {
  defaultFeatures,
  DEFAULT_REGIONS,
  InternalTakomoProjectConfig,
} from "../../src/takomo-core"
import { FilePath } from "../../src/takomo-util"

const doLoadProjectConfig = (
  projectDir: FilePath,
  pathToFile: FilePath,
): Promise<InternalTakomoProjectConfig> =>
  loadProjectConfig(projectDir, pathToFile, {})

describe("#loadProjectConfig", () => {
  test("with empty file", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs`,
      `${process.cwd()}/test/takomo-config-repository-fs/project-config-01.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: undefined,
      deploymentTargets: undefined,
      regions: DEFAULT_REGIONS,
      resolvers: [],
      helpers: [],
      helpersDir: [],
      partialsDir: [],
      schemasDir: [],
      varFiles: [],
      features: defaultFeatures(),
    }

    expect(config).toStrictEqual(expected)
  })

  test("with a single region", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs`,
      `${process.cwd()}/test/takomo-config-repository-fs/project-config-02.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: undefined,
      deploymentTargets: undefined,
      regions: ["eu-west-1"],
      resolvers: [],
      helpers: [],
      helpersDir: [],
      partialsDir: [],
      schemasDir: [],
      varFiles: [],
      features: defaultFeatures(),
    }

    expect(config).toStrictEqual(expected)
  })

  test("with multiple regions", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs`,
      `${process.cwd()}/test/takomo-config-repository-fs/project-config-03.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: undefined,
      deploymentTargets: undefined,
      regions: ["eu-central-1", "eu-north-1", "us-east-1"],
      resolvers: [],
      helpers: [],
      helpersDir: [],
      partialsDir: [],
      schemasDir: [],
      varFiles: [],
      features: defaultFeatures(),
    }

    expect(config).toStrictEqual(expected)
  })

  test("with resolvers", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs`,
      `${process.cwd()}/test/takomo-config-repository-fs/project-config-04.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: undefined,
      deploymentTargets: undefined,
      regions: ["eu-central-1", "us-east-1"],
      helpers: [],
      helpersDir: [],
      partialsDir: [],
      schemasDir: [],
      varFiles: [],
      features: defaultFeatures(),
      resolvers: [
        {
          package: "@takomo/my-example-resolver",
        },
        {
          package: "another-resolver",
          name: undefined,
        },
        {
          package: "another-resolver-v2",
          name: "a-better-name",
        },
      ],
    }

    expect(config).toStrictEqual(expected)
  })

  test("with helpers", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs`,
      `${process.cwd()}/test/takomo-config-repository-fs/project-config-05.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: undefined,
      deploymentTargets: undefined,
      regions: ["eu-central-1", "us-east-1"],
      resolvers: [],
      varFiles: [],
      features: defaultFeatures(),
      helpers: [
        {
          package: "@takomo/my-example-helper",
        },
        {
          package: "another-helper",
          name: undefined,
        },
        {
          package: "another-helper-v2",
          name: "a-better-name",
        },
      ],
      helpersDir: [],
      partialsDir: [],
      schemasDir: [],
    }

    expect(config).toStrictEqual(expected)
  })

  test("with var files", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs`,
      `${process.cwd()}/test/takomo-config-repository-fs/project-config-06.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: undefined,
      deploymentTargets: undefined,
      regions: DEFAULT_REGIONS,
      resolvers: [],
      helpers: [],
      helpersDir: [],
      partialsDir: [],
      schemasDir: [],
      varFiles: [
        join(`${process.cwd()}/test/takomo-config-repository-fs`, "file1.json"),
        join(`${process.cwd()}/test/takomo-config-repository-fs`, "file2.yml"),
      ],
      features: defaultFeatures(),
    }

    expect(config).toStrictEqual(expected)
  })

  test("with helper dirs and partials", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs`,
      `${process.cwd()}/test/takomo-config-repository-fs/project-config-07.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: undefined,
      deploymentTargets: undefined,
      regions: DEFAULT_REGIONS,
      resolvers: [],
      helpers: [],
      helpersDir: ["/tmp/custom"],
      partialsDir: [
        join(`${process.cwd()}/test/takomo-config-repository-fs`, "one", "two"),
        "/other",
      ],
      schemasDir: [],
      varFiles: [],
      features: defaultFeatures(),
    }

    expect(config).toStrictEqual(expected)
  })

  test("with extends", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs`,
      `${process.cwd()}/test/takomo-config-repository-fs/project-config-08.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: ">1.0.0 || >=5.0.0-alpha.0",
      deploymentTargets: undefined,
      regions: ["eu-central-1", "eu-west-1", "us-east-1"],
      resolvers: [],
      helpers: [],
      helpersDir: [
        join(`${process.cwd()}/test/takomo-config-repository-fs`, "my-helpers"),
      ],
      partialsDir: [],
      schemasDir: [],
      varFiles: [],
      features: defaultFeatures(),
    }

    expect(config).toStrictEqual(expected)
  })

  test("extends with complex file hierarchies", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs/config-file-hierarchy/aaa`,
      `${process.cwd()}/test/takomo-config-repository-fs/config-file-hierarchy/aaa/one.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: undefined,
      deploymentTargets: undefined,
      regions: DEFAULT_REGIONS,
      resolvers: [],
      helpers: [],
      helpersDir: [
        `${process.cwd()}/test/takomo-config-repository-fs/config-file-hierarchy/my-helpers`,
      ],
      partialsDir: [],
      schemasDir: [],
      varFiles: [
        `${process.cwd()}/test/takomo-config-repository-fs/config-file-hierarchy/bbb/example.yml`,
        `${process.cwd()}/test/takomo-config-repository-fs/other.yml`,
      ],
      features: defaultFeatures(),
    }

    expect(config).toStrictEqual(expected)
  })

  test("with schemas dir", async () => {
    const config = await doLoadProjectConfig(
      `${process.cwd()}/test/takomo-config-repository-fs`,
      `${process.cwd()}/test/takomo-config-repository-fs/project-config-09.yml`,
    )

    const expected: InternalTakomoProjectConfig = {
      requiredVersion: undefined,
      deploymentTargets: undefined,
      regions: DEFAULT_REGIONS,
      resolvers: [],
      helpers: [],
      helpersDir: [],
      partialsDir: [],
      schemasDir: ["/tmp"],
      varFiles: [],
      features: defaultFeatures(),
    }

    expect(config).toStrictEqual(expected)
  })
})
