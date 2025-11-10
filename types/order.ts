import { BaseResponse } from "./baseResponse";
import { Color } from "./color";
import { Size } from "./size";
import { OrderUserData } from "./user";

interface OrderProduct {
    id: string,
    amount: number,
    size: Size,
    color: Color
}

export interface OrderRequest {
    products: OrderProduct[],
    userId: string,
    comment: string,
    userData: OrderUserData
}

export interface Order extends BaseResponse, OrderRequest {
    sum: number,
    date: string,
    orderNum: number,
    status: "processing" | "packing" | "success" | "declined"
}