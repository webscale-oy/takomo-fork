import { StackName } from "../../takomo-aws-model"
import { Project } from "../../takomo-core"
import { StackPath } from "../../takomo-stacks-model"

export const makeStackName = (
  stackPath: StackPath,
  project?: Project,
): StackName => {
  const prefix = project ? `${project}-` : ""
  const cleanedStackPath = stackPath.substr(1)
  return `${prefix}${cleanedStackPath}`
    .replace(/\//g, "-")
    .replace(/\.yml$/, "")
}
