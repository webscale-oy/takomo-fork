import { mock } from "jest-mock-extended"
import Joi from "joi"
import { CommandContext } from "../../src/takomo-core"
import { createFileContentsResolverProvider } from "../../src/takomo-stacks-resolvers/file-contents-resolver"
import { defaultSchema } from "../../src/takomo-stacks-resolvers/resolver-registry"
import { expectNoValidationError, expectValidationErrors } from "../assertions"

const provider = createFileContentsResolverProvider()

const schema = provider.schema!({
  ctx: mock<CommandContext>(),
  joi: Joi.defaults((schema) => schema),
  base: defaultSchema("file-contents"),
})

describe("FileContentsResolverProvider", () => {
  test("#name should be file-contents", () => {
    expect(provider.name).toBe("file-contents")
  })
  describe("#schema validation", () => {
    test("should succeed when a valid configuration is given", () => {
      expectNoValidationError(schema)({
        file: "/test.txt",
      })
    })

    test("should fail when a configuration with missing file is given", () => {
      expectValidationErrors(schema)({}, '"file" is required')
    })

    test("should fail when a configuration with command with invalid type is given", () => {
      expectValidationErrors(schema)({ file: 100 }, '"file" must be a string')
    })

    test("should succeed when confidential property is given", () => {
      expectNoValidationError(schema)({
        file: "/file",
        confidential: true,
      })
    })

    test("should succeed when immutable property is given", () => {
      expectNoValidationError(schema)({
        file: "/file",
        immutable: true,
      })
    })

    test("should succeed when all supported properties are given", () => {
      expectNoValidationError(schema)({
        file: "/file",
        immutable: true,
        confidential: false,
      })
    })
  })
})
