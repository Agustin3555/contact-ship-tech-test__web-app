export enum Role {
  USER = 'user',
  AGENT = 'agent',
}

export interface Timestamp {
  role: Role
  content: string
  start: number
  end: number
}
