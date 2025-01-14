import { CommandContext } from "../../takomo-core"
import {
  FilePath,
  parseYaml,
  readFileContents,
  renderTemplate,
  TemplateEngine,
  TkmLogger,
} from "../../takomo-util"

export const parseConfigFile = async (
  ctx: CommandContext,
  logger: TkmLogger,
  templateEngine: TemplateEngine,
  pathToFile: FilePath,
): Promise<Record<string, unknown>> => {
  const { confidentialValuesLoggingEnabled, variables } = ctx

  const contents = await readFileContents(pathToFile)

  const filterFn = confidentialValuesLoggingEnabled
    ? (obj: any) => obj
    : (obj: any) => {
        return {
          ...obj,
          env: "*****",
        }
      }

  logger.traceText("Raw deployment groups config file:", () => contents)
  logger.traceObject(
    `Render deployment groups config file using variables:`,
    () => variables,
    filterFn,
  )

  const rendered = await renderTemplate(
    templateEngine,
    pathToFile,
    contents,
    variables,
  )

  logger.traceText(
    "Final rendered deployment groups config file:",
    () => rendered,
  )

  return parseYaml(pathToFile, rendered) ?? {}
}
