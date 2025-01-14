import { createAwsSchemas } from "../../src/takomo-aws-schema"
import { expectNoValidationError, expectValidationErrors } from "../assertions"

const { stackCapability } = createAwsSchemas({ regions: [] })

const valid = [
  "CAPABILITY_IAM",
  "CAPABILITY_NAMED_IAM",
  "CAPABILITY_AUTO_EXPAND",
]

const invalid = [
  [
    "",
    '"value" is not allowed to be empty',
    '"value" must be one of [CAPABILITY_IAM, CAPABILITY_NAMED_IAM, CAPABILITY_AUTO_EXPAND]',
  ],
  [
    "something else",
    '"value" must be one of [CAPABILITY_IAM, CAPABILITY_NAMED_IAM, CAPABILITY_AUTO_EXPAND]',
  ],
]

describe("stack capability validation", () => {
  test.each(invalid)(
    "fails when '%s' is given",
    expectValidationErrors(stackCapability),
  )
  test.each(valid)(
    "succeeds when '%s' is given",
    expectNoValidationError(stackCapability),
  )
})
