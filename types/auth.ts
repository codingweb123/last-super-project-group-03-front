export interface LoginRequest {
  phone: string,
  password: string
}

export interface RegisterRequest extends LoginRequest {
  firstName: string
}