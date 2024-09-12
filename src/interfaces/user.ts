export interface IUser {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
  phoneNumber?: string | null
  lastSignInAt?: Date | null
}

export interface ICreateUserRequest {
  name: string
  email: string
  role?: string
  phoneNumber?: string
}

export interface IUpdateUserRequest {
  id: string
  name?: string
  email?: string
  role?: string
  phoneNumber?: string
  lastSignInAt?: Date
}

export interface IUserResponse {
  id: string
  name: string
  email: string
  role: string
  phoneNumber?: string
  createdAt: Date
  updatedAt: Date
  lastSignInAt?: Date
}
