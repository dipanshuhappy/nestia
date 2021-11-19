/**
 * @packageDocumentation
 * @module api.functional.misc.health_check
 */
//================================================================
import { AesPkcs5 } from "./../../../__internal/AesPkcs5";
import { Fetcher } from "./../../../__internal/Fetcher";
import { Primitive } from "./../../../Primitive";
import type { IConnection } from "./../../../IConnection";




/**
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller HealthCheckController.get()
 * @path GET /misc/health-check/
 */
export function get
    (
        connection: IConnection
    ): Promise<void>
{
    return Fetcher.fetch
    (
        connection,
        {
            input_encrypted: false,
            output_encrypted: false
        },
        "GET",
        `/misc/health-check/`
    );
}

/**
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller HealthCheckController.sleep_for()
 * @path GET /misc/health-check/sleep-for/:ms
 */
export function sleep_for
    (
        connection: IConnection,
        ms: number
    ): Promise<void>
{
    return Fetcher.fetch
    (
        connection,
        {
            input_encrypted: false,
            output_encrypted: false
        },
        "GET",
        `/misc/health-check/sleep-for/${ms}`
    );
}



//---------------------------------------------------------
// TO PREVENT THE UNUSED VARIABLE ERROR
//---------------------------------------------------------
AesPkcs5;
Fetcher;
Primitive;