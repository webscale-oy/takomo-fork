import { SSMClient } from "@takomo/aws-clients"
import { StackPath } from "@takomo/core"
import { Resolver, ResolverInput, SecretName } from "@takomo/stacks-model"

export class SecretResolver implements Resolver {
  private readonly stack: StackPath | null
  private readonly secret: SecretName

  constructor(props: any) {
    this.stack = props.stack
    this.secret = props.secret
  }

  confidential = (): boolean => true

  dependencies = (): StackPath[] => (this.stack ? [this.stack] : [])

  resolve = async ({ ctx, stack }: ResolverInput): Promise<any> => {
    const [referencedStack, ...rest] = this.stack
      ? ctx.getStacksByPath(this.stack)
      : [stack]

    if (!referencedStack) {
      // TODO: We should be able to detect this earlier - when the configuration is being built
      throw new Error(`Stack not found with path: ${this.stack}`)
    }

    if (rest.length > 0) {
      // TODO: We should be able to detect this earlier - when the configuration is being built
      throw new Error(`More than one stack found with path: ${this.stack}`)
    }

    const ssm = new SSMClient({
      credentialProvider: referencedStack.getCredentialProvider(),
      region: referencedStack.getRegion(),
      logger: ctx.getLogger(),
    })

    const secret = referencedStack.getSecrets().get(this.secret)
    if (!secret) {
      throw new Error(
        `Stack ${stack.getPath()} does not have secret: ${this.secret}`,
      )
    }

    return ssm.getEncryptedParameter(secret.ssmParameterName)
  }
}