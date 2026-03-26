import { Request } from 'express'

export interface UserPayload {
  id: string
  email: string
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload
}

export interface RegisterInput {
  email: string
  password: string
  name?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface FavoriteCityInput {
  cityId: string
  cityName: string
  country?: string
  lat: number
  lon: number
}