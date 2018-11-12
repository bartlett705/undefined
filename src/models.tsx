export enum CLIResponseType {
  Error = 'ERROR',
  Info = 'INFO',
  Standard = 'STANDARD',
  StartPost = 'POST',
  Success = 'SUCCESS'
}

export interface CLIResponse {
  type: CLIResponseType
  content: string[]
  payload?: Payload
}

export type Payload = PostPayload

export enum PayloadType {
  Posts
}

interface PostPayload {
  type: PayloadType.Posts
  body: Post[]
}

export interface Post {
  createdAt: string
  message: string
  userID: string
  username: string
}

export interface CLIRequestBody {
  input: string
  language: string
  referrer: string
  userAgent: string
}
