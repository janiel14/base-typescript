export class Logger {
  public static error(code: string, message: string, error: Error): void {
    console.error(`${code}: ${message}`, error)
  }

  public static info(code: string, message: string): void {
    console.info(`${code}: ${message}`)
  }
}
