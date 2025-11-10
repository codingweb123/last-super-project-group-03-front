import { BaseResponse } from "./baseResponse";

export interface OrderUserData {
  firstName: string,
  lastName: string,
  phone: string,
  city: string,
  postalOffice: number
}

export interface User extends BaseResponse, OrderUserData {
  avatar: string,
  avatar_id: string,
  role: "user" | "admin"
};
