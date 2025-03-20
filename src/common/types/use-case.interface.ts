export interface IUseCase<Command, Result> {
  execute(command: Command): Promise<Result>;
}
