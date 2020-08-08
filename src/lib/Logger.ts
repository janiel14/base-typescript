export class Logger {
  public static error(code: string, message: string, error: Error): void {
    console.error(`${code}: ${message}`, error)
  }

  public static info(code: string, message: string): void {
    console.info(`${code}: ${message}`)
  }

  public static log(code: string, message: string, data: any): void {
    console.log(`${code}: ${message}`, data)
  }
}
