import { CloudFormationStackSummary } from "../../../takomo-aws-model"
import { StacksConfigRepository } from "../../../takomo-stacks-context"
import {
  InternalStack,
  InternalStacksContext,
  StackOperationType,
  StackResult,
} from "../../../takomo-stacks-model"
import { Timer, TkmLogger } from "../../../takomo-util"
import { StacksOperationListener } from "../common/model"
import { executeSteps } from "../common/steps"
import { DeployStacksIO, DeployState } from "./model"
import { InitialDeployStackState } from "./states"
import { createDeployStackTransitions } from "./transitions"

const logStackConfig = (
  logger: TkmLogger,
  stack: InternalStack,
  confidentialValuesLoggingEnabled: boolean,
): void => {
  const filterFn = confidentialValuesLoggingEnabled
    ? () => stack
    : () => ({ ...stack, credentials: "*****" })
  logger.debugObject("Stack config:", () => stack, filterFn)
}

export const deployStack = async (
  timer: Timer,
  ctx: InternalStacksContext,
  io: DeployStacksIO,
  state: DeployState,
  stack: InternalStack,
  dependencies: Promise<StackResult>[],
  operationType: StackOperationType,
  configRepository: StacksConfigRepository,
  stacksOperationListener: StacksOperationListener,
  expectNoChanges: boolean,
  currentStack?: CloudFormationStackSummary,
): Promise<StackResult> => {
  const logger = io.childLogger(stack.path)

  if (currentStack) {
    logger.info(`Stack status: ${currentStack.status}`)
  } else {
    logger.info(`Stack status: PENDING`)
  }

  logStackConfig(logger, stack, ctx.confidentialValuesLoggingEnabled)

  const variables = {
    ...ctx.variables,
    hooks: {},
  }

  const initialState: InitialDeployStackState = {
    io,
    stack,
    variables,
    logger,
    dependencies,
    operationType,
    state,
    currentStack,
    ctx,
    configRepository,
    stacksOperationListener,
    expectNoChanges,
    stackExistedBeforeOperation: currentStack !== undefined,
    totalTimer: timer.startChild(stack.path),
    transitions: createDeployStackTransitions(),
  }

  return executeSteps(initialState)
}
