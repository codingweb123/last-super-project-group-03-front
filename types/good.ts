import { BaseResponse } from "./baseResponse";
import { Color } from "./color";
import { Pagination } from "./pagination";
import { Rate } from "./rate";
import { Size } from "./size";

interface Price {
    value: number,
    currency: "грн"
}

export interface Good extends BaseResponse {
    name: string,
    image: string,
    category: string,
    prevDescription: string,
    colors: Color[],
    sizes: Size[],
    gender: "men" | "women" | "unisex",
    description: string,
    price: Price,
    feedbacks: string[],
    stars: Rate,
    characteristics: string[]
}

export interface Goods extends Pagination {
    totalGoods: number,
    goods: Good[]
}