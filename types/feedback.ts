import { BaseResponse } from "./baseResponse";
import { Pagination } from "./pagination";
import { Rate } from "./rate";

export interface FeedbackRequest {
    author: string,
    description: string,
    rate: Rate,
    goodId: string,
}

interface Feedback extends BaseResponse, FeedbackRequest {
    date: string
}

export interface Feedbacks extends Pagination {
    totalFeedbacks: number,
    feedbacks: Feedback[]
}