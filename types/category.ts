import { BaseResponse } from "./baseResponse";
import { Pagination } from "./pagination";

interface Category extends BaseResponse {
    name: "Футболки та сорочки" | "Штани та джинси" | "Верхній одяг" | "Топи та майки" | "Сукні та спідниці" | "Домашній та спортивний одяг" | "Худі та кофти" | "Інше",
    image: string
}

export interface Categories extends Pagination {
    totalCategories: number,
    categories: Category[]
}