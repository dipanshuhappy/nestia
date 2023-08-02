/**
 * @packageDocumentation
 * @module api.functional
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection, Primitive } from "@nestia/fetcher";

import type { IRequestDto } from "./../structures/IRequestDto";

export * as health from "./health";
export * as performance from "./performance";

/**
 * @controller RequestController.request()
 * @path POST /request
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function request(
    connection: IConnection,
    input: request.Input,
): Promise<request.Output> {
    return Fetcher.fetch(
        {
            ...connection,
            headers: {
                ...(connection.headers ?? {}),
                "Content-Type": "application/json",
            },
        },
        request.ENCRYPTED,
        request.METHOD,
        request.path(),
        input,
    );
}
export namespace request {
    export type Input = Primitive<IRequestDto>;
    export type Output = Primitive<IRequestDto>;

    export const METHOD = "POST" as const;
    export const PATH: string = "/request";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export const path = (): string => {
        return `/request`;
    }
}