import { createStacksSchemas } from "../../src/takomo-stacks-schema"
import { expectNoValidationError, expectValidationErrors } from "../assertions"

const { hookResult } = createStacksSchemas({
  regions: [],
})

const valid = ["success", "failed", "skipped", "cancelled"]

const invalid = [
  [
    "",
    '"value" is not allowed to be empty',
    '"value" must be one of [success, failed, cancelled, skipped]',
  ],
  ["whenever", '"value" must be one of [success, failed, cancelled, skipped]'],
]

describe("hook name validation", () => {
  test.each(invalid)(
    "fails when '%s' is given",
    expectValidationErrors(hookResult),
  )

  test.each(valid)(
    "succeeds when '%s' is given",
    expectNoValidationError(hookResult),
  )
})
