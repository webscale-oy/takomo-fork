import { CommandContext } from "../../takomo-core"
import {
  createStackGroup,
  SchemaRegistry,
  StackGroup,
} from "../../takomo-stacks-model"
import { merge, mergeArrays, TkmLogger } from "../../takomo-util"
import { StackGroupConfigNode } from "./config-tree"
import { mergeStackGroupSchemas } from "./merge-stack-group-schemas"

export const populatePropertiesFromConfigFile = async (
  ctx: CommandContext,
  schemaRegistry: SchemaRegistry,
  logger: TkmLogger,
  variables: any,
  stackGroup: StackGroup,
  node: StackGroupConfigNode,
): Promise<StackGroup> => {
  const configFile = await node.getConfig(variables)

  if (!configFile) {
    return stackGroup
  }

  const props = stackGroup.toProps()

  if (configFile.project) {
    props.project = configFile.project
  }

  if (configFile.templateBucket) {
    props.templateBucket = configFile.templateBucket
  }

  if (configFile.regions.length > 0) {
    props.regions = configFile.regions
  }

  if (configFile.commandRole) {
    props.commandRole = configFile.commandRole
  }

  if (configFile.capabilities) {
    props.capabilities = configFile.capabilities
  }

  if (configFile.accountIds) {
    props.accountIds = configFile.accountIds
  }

  if (configFile.ignore !== undefined) {
    props.ignore = configFile.ignore
  }

  if (configFile.obsolete !== undefined) {
    props.obsolete = configFile.obsolete
  }

  if (configFile.terminationProtection !== undefined) {
    props.terminationProtection = configFile.terminationProtection
  }

  if (configFile.stackPolicy) {
    props.stackPolicy = configFile.stackPolicy
  }

  if (configFile.stackPolicyDuringUpdate) {
    props.stackPolicyDuringUpdate = configFile.stackPolicyDuringUpdate
  }

  if (configFile.timeout !== null) {
    props.timeout = configFile.timeout
  }

  if (configFile.inheritTags) {
    configFile.tags.forEach((value, key) => {
      props.tags.set(key, value)
    })
  } else {
    props.tags = configFile.tags
  }

  props.data = merge(stackGroup.data, configFile.data)
  props.hooks = mergeArrays({
    first: stackGroup.hooks,
    second: configFile.hooks,
    allowDuplicates: false,
    equals: (a, b) => a.name === b.name,
  })
  props.schemas = await mergeStackGroupSchemas(
    ctx,
    schemaRegistry,
    stackGroup,
    configFile.schemas,
  )

  return createStackGroup(props)
}
