import { defaultCapabilities } from "@takomo/stacks-model"
import uuid from "uuid"
import { StackOperationStep } from "../../common/steps"
import { UpdateStackHolder } from "../states"

/**
 * @hidden
 */
export const initiateStackUpdate: StackOperationStep<UpdateStackHolder> = async (
  state,
) => {
  const {
    stack,
    parameters,
    tags,
    templateS3Url,
    templateBody,
    terminationProtectionUpdated,
    transitions,
  } = state

  const clientToken = uuid.v4()
  const templateLocation = templateS3Url || templateBody
  const templateKey = templateS3Url ? "TemplateURL" : "TemplateBody"
  const capabilities = stack.capabilities?.slice() || defaultCapabilities

  const hasChanges = await stack.getCloudFormationClient().updateStack({
    Capabilities: capabilities,
    ClientRequestToken: clientToken,
    Parameters: parameters.map((p) => ({
      ParameterKey: p.key,
      ParameterValue: p.value,
      UsePreviousValue: false,
    })),
    Tags: tags.map((t) => ({ Key: t.key, Value: t.value })),
    StackName: stack.name,
    [templateKey]: templateLocation,
  })

  if (hasChanges) {
    return transitions.waitStackCreateOrUpdateToComplete({
      ...state,
      clientToken,
    })
  }

  if (terminationProtectionUpdated) {
    return transitions.executeAfterDeployHooks({
      ...state,
      message: "Stack update succeeded",
      status: "SUCCESS",
      events: [],
      success: true,
    })
  }

  return transitions.executeAfterDeployHooks({
    ...state,
    message: "No changes",
    status: "SUCCESS",
    events: [],
    success: true,
  })
}