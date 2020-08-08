export interface NodeMailerResponse {
  messageId: string
}

export interface NodeMailerAttachment {
  filename: string
  content: Buffer | string
  contentType: string
  path: string
  encoding: string
  raw: string
}
