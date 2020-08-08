import { IncomingForm } from 'formidable'
import { UploadConfigs, UploadFiles, BaseUpload } from './types/utils/Upload'
import { RequestAuth } from './types/utils/RequestAuth'
import { Logger } from './Logger'

export class Upload {
  private form: IncomingForm
  private uploadDir = '/tmp'
  private multiples = false
  private maxFileSize = 200
  private maxFieldsSize = 20
  private maxFields = 1000
  private keepExtensions = true
  private encoding = 'utf-8'

  constructor(configs: UploadConfigs) {
    this.form = new IncomingForm()
    this.form.encoding = configs ? configs.options.encoding : this.encoding
    this.form.uploadDir = configs ? configs.options.uploadDir : this.uploadDir
    this.form.keepExtensions = configs ? configs.options.keepExtensions : this.keepExtensions
    this.form.maxFieldsSize = configs ? configs.options.maxFieldsSize : this.maxFieldsSize * 1024 * 1024
    this.form.maxFileSize = configs ? configs.options.maxFileSize : this.maxFileSize * 1024 * 1024
    this.form.maxFields = configs ? configs.options.maxFields : this.maxFields
    this.form.multiples = configs ? configs.options.multiples : this.multiples
  }

  public async getUploadedFile(req: RequestAuth): Promise<BaseUpload> {
    return new Promise((resolve, reject) => {
      this.form.parse(req, (error, fields, files) => {
        if (error) {
          Logger.error('UPLOAD_ERROR', `Uploads.getUploadedFile: `, error)
          reject(error)
        } else {
          const keys = Object.keys(files)
          const list: UploadFiles[] = []
          keys.forEach((k) => {
            const extension = files[k].name.substring(files[k].name.indexOf('.'), files[k].name.length)
            list.push({
              ...files[k],
              extension: extension
            })
          })
          const data: BaseUpload = {
            fields: fields,
            files: list
          }
          resolve(data)
        }
      })
    })
  }
}
