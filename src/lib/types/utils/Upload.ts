import { File, Fields } from 'formidable'

export enum UploadEncoding {
  UTF8 = 'utf-8'
}

export interface Configs {
  uploadDir: string,
  multiples: boolean,
  maxFileSize: number,
  maxFieldsSize: number,
  maxFields: number,
  keepExtensions: boolean,
  encoding: UploadEncoding
}

export interface UploadConfigs {
  options: Configs | null
}

export interface UploadFiles extends File {
  extension: string
}

export interface BaseUpload {
  fields: Fields,
  files: UploadFiles[]
}
