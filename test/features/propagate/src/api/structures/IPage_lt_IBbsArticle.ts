import type { IBbsArticle } from "./IBbsArticle";
import type { IPage } from "./IPage";

export type ISummary_gt_ = {
    data: Array<IBbsArticle.ISummary>;
    pagination: IPage.IPagination;
}
export namespace IPage_lt_IBbsArticle {
    export type ISummary_gt_ = {
        data: Array<IBbsArticle.ISummary>;
        pagination: IPage.IPagination;
    }
}