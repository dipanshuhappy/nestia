# Nestia
Automatic `SDK` and `Swagger` generator for the `NestJS`.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/samchon/nestia/blob/master/LICENSE) 
[![npm version](https://badge.fury.io/js/nestia.svg)](https://www.npmjs.com/package/nestia) 
[![Downloads](https://img.shields.io/npm/dm/nestia.svg)](https://www.npmjs.com/package/nestia) 
[![Build Status](https://github.com/samchon/nestia/workflows/build/badge.svg)](https://github.com/samchon/nestia/actions?query=workflow%3Abuild) 
[![Guide Documents](https://img.shields.io/badge/wiki-documentation-forestgreen)](https://github.com/samchon/nestia/wiki) 

  - Github: https://github.com/samchon/nestia
  - NPM: https://www.npmjs.com/packages/nestia
  - Guide Documents: https://github.com/samchon/nestia/wiki

```bash
# INSTALL NESTIA
npm install --save-dev nestia

# BUILDING SDK LIBRARY
npx nestia sdk "src/controller" --out "src/api"
npx nestia sdk "src/**/*.controller.ts" --out "src/api"
npx nestia sdk "src/controller" \ 
    --exclude "src/controller/test" \
    --out "src/api"

# BUILDING SWAGGER.JSON IS ALSO POSSIBLE
npx nestia swagger "src/controller" --out "swagger.json"
```

`nestia` is an evolved `SDK` and `Swagger` generator, which analyzes your `NestJS` server code in the compilation level. With `nestia`, you don't need to write any swagger or class-validator decorators. All you need to do is use the `nestia` CLI as shown above.

Reading below sections and looking at the example codes, feel how the "compilation level" makes `nestia` stronger.

```typescript
// IMPORT SDK LIBRARY GENERATED BY NESTIA
import api from "@samchon/shopping-api";
import { IPage } from "@samchon/shopping-api/lib/structures/IPage";
import { ISale } from "@samchon/shopping-api/lib/structures/ISale";
import { ISaleArticleComment } from "@samchon/shopping-api/lib/structures/ISaleArticleComment";
import { ISaleQuestion } from "@samchon/shopping-api/lib/structures/ISaleQuestion";

export async function trace_sale_question_and_comment
    (connection: api.IConnection): Promise<void>
{
    // LIST UP SALE SUMMARIES
    const index: IPage<ISale.ISummary> = await api.functional.shoppings.sales.index
    (
        connection,
        "general",
        { limit: 100, page: 1 }
    );

    // PICK A SALE
    const sale: ISale = await api.functional.shoppings.sales.at
    (
        connection, 
        index.data[0].id
    );
    console.log("sale", sale);

    // WRITE A QUESTION
    const question: ISaleQuestion = await api.functional.shoppings.sales.questions.store
    (
        connection,
        "general",
        sale.id,
        {
            title: "How to use this product?",
            body: "The description is not fully enough. Can you introduce me more?",
            files: []
        }
    );
    console.log("question", question);

    // WRITE A COMMENT
    const comment: ISaleArticleComment = await api.functional.shoppings.sales.comments.store
    (
        connection,
        "general",
        sale.id,
        question.id,
        {
            body: "p.s) Can you send me a detailed catalogue?",
            anonymous: false
        }
    );
    console.log("comment", comment);
}
```




## Demonstrations
Components | `nestia`::SDK | `nestia`::swagger | `@nestjs/swagger`
-----------|---|---|---
DTO with pure interface | ✔ | ✔ | ❌
descriptions by comments | ✔ | ✔ | ❌
Simple structure | ✔ | ✔ | ✔
Generic typed structure | ✔ | ✔ | ❌
Union typed structure | ✔ | ✔ | ▲
Intersection typed structure | ✔ | ✔ | ▲
Conditional typed structure | ✔ | ▲ | ❌
Auto completion | ✔ | ❌ | ❌
Type hints | ✔ | ❌ | ❌
2x faster `JSON.stringify()` | ✔ | ❌ | ❌
Ensure type safety | ✔ | ❌ | ❌ 

### Pure DTO Interface
`nestia` can utilize pure interface type as DTO.

Unlike `@nestjs/swagger` which requires the DTO class with decorators, `nestia` can use the pure interface type directly. Also, `nestia` can utilize the pure descriptive comments, instead of using the `description` property of the decorators. Furthermore, `nestia` can even support generic types, union/intersection types and even conditional types.

Look at the code below, you may see the difference between `nestia` and `@nestjs/swagger`, and thereby catch the meaning of the pure DTO interface.

  - Simple [`ISaleArticleComment`](https://github.com/samchon/nestia/tree/master/demo/simple/src/api/structures/ISaleArticleComment.ts)
  - Generic interfaces
    - grandparent interface, [`ISaleArticle<Content>`](https://github.com/samchon/nestia/tree/master/demo/generic/src/api/structures/ISaleArticle.ts)
    - parent interface, [`ISaleInquiry<Content>`](https://github.com/samchon/nestia/tree/master/demo/generic/src/api/structures/ISaleInquiry.ts)
    - 1st sub-type interface, [`ISaleQuestion`](https://github.com/samchon/nestia/tree/master/demo/generic/src/api/structures/ISaleQuestion.ts)
    - 2nd sub-type interface, [`ISaleReview`](https://github.com/samchon/nestia/tree/master/demo/generic/src/api/structures/ISaleReview.ts)
  - Union alias type [`ISaleEntireArticle`](https://github.com/samchon/nestia/tree/master/demo/union/src/api/structures/ISaleEntireArticle.ts)

> The below example code would be shown by clicking the arrow button or text.

<details>
    <summary>
        Pure DTO interface, of the <code>nestia</code>
    </summary>

```typescript
/**
 * Comment wrote on a sale related article.
 * 
 * When an article of a sale has been enrolled, all of the participants like consumers and
 * sellers can write a comment on that article. However, when the writer is a consumer, the
 * consumer can hide its name through the annoymous option. 
 * 
 * Also, writing a reply comment for a specific comment is possible and in that case, the 
 * {@link ISaleArticleComment.parent_id} property would be activated.
 * 
 * @author Jeongho Nam - https://github.com/samchon
 */
export interface ISaleArticleComment
{
    /**
     * Primary Key.
     */
    id: number;

    /**
     * Parent comment ID.
     * 
     * Only When this comment has been written as a reply.
     */
    parent_id: number | null;

    /**
     * Type of the writer.
     */
    writer_type: "seller" | "consumer";

    /**
     * Name of the writer.
     * 
     * When this is a type of anonymous comment, writer name would be hidden.
     */
    writer_name: string | null;

    /**
     * Contents of the comments.
     * 
     * When the comment writer tries to modify content, it would not modify the comment
     * content but would be accumulated. Therefore, all of the people can read how
     * the content has been changed.
     */
    contents: ISaleArticleComment.IContent[];

    /**
     * Creation time.
     */
    created_at: string;
}
export namespace ISaleArticleComment
{
    /**
     * Store info.
     */
    export interface IStore
    {
        /**
         * Body of the content.
         */
        body: string;

        /**
         * Whether to hide the writer name or not.
         */
        annonymous: boolean;
    }

    /**
     * Content info.
     */
    export interface IContent
    {
        /**
         * Primary Key.
         */
        id: string;

        /**
         * Body of the content.
         */
        body: string;

        /**
         * Creation time.
         */
        created_at: string;
    }
}
```
</details>

<details>
    <summary>
        Legacy DTO class, of the <code>@nestjs/swagger</code>
    </summary>

```typescript
export class SaleArticleComment
{
    @ApiProperty({
        description: 
`Comment wrote on a sale related article.

When an article of a sale has been enrolled, all of the participants like consumers and sellers can write a comment on that article. However, when the writer is a consumer, the consumer can hide its name through the annoymous option.

Also, writing a reply comment for a specific comment is possible and in that case, the ISaleArticleComment.parent_id property would be activated.`
    })
    id: number;

    @ApiProperty({
        type: "number",
        nullable: true,
        description:
`Parent comment ID.

Only When this comment has been written as a reply.`
    })
    parent_id: number | null;

    @ApiProperty({
        type: "string",
        description: "Type of the writer."
    })
    writer_type: "seller" | "consumer";

    @ApiProperty({
        type: "string",
        nullable: true,
        description:
`Name of the writer.

When this is a type of anonymous comment, writer name would be hidden.`
    })
    writer_name: string | null;

    @ApiProperty({
        type: "array",
        items: {
            schema: { $ref: getSchemaPath(SaleArticleComment.Content) }
        },
        description:
`Contents of the comments.

When the comment writer tries to modify content, it would not modify the comment content but would be accumulated Therefore, all of the people can read how the content has been changed.`
    })
    contents: SaleArticleComment.Content[];

    @ApiProperty({
        description: "Creation time."
    })
    created_at: string;
}
```
</details>




### Advanced Controller Class
Controller also can use the generic arguments.

In the previous [Pure DTO Interface](#pure-dto-interface) corner, we've learned that `nestia` can use the pure interface type as DTO. Also, we've learned that utilizing generic, union/intersection and even conditional typed interfaces are also possible.

In the Controller case, it's same with the upper DTO story. With `nestia`, defining a generic typed controller class is also possible, too. By defining a generic typed controller class as a super-type class, you can reduce both duplicated code and description comments.

Look at the below code and feel how powerful `nestia` is. It should be stated that, `@nestjs/swagger` cannot construct such generic or union typed controller class.

  - Simple [`CustomerSaleArticleCommentsController`](https://github.com/samchon/nestia/blob/master/demo/simple/src/controllers/ConsumerSaleArticleCommentsController.ts)
  - Generic controllers
    - abstract controller, [`SaleInquiriesController<Content, Store, Json>`](https://github.com/samchon/nestia/tree/master/demo/generic/src/controllers/SaleInquiriesController.ts)
    - 1st sub-type controller, [`ConsumerSaleQuestionsController`](https://github.com/samchon/nestia/tree/master/demo/generic/src/controllers/ConsumerSaleQuestionsController.ts)
    - 2nd sub-type controller, [`ConsumerSaleQuestionsController`](https://github.com/samchon/nestia/tree/master/demo/generic/src/controllers/ConsumerSaleQuestionsController.ts)
  - Union controller, [`ConsumerSaleEntireArticlesController`](https://github.com/samchon/nestia/tree/master/demo/union/src/controllers/ConsumerSaleEntireArticlesController.ts)

> [typescript-is](https://github.com/woutervh-/typescript-is) can replace the class-validator with only one line.
> 
> ```typescript
> import * as nest from "@nestjs/common";
> import { assertType } from "typescript-is";
>
> @nest.Controller("consumers/:section/sales/:saleId/questions")
> export class SaleQuestionsController
>     extends SaleInquiriesController<
>         ISaleQuestion,
>         ISaleQuestion.IContent,
>         ISaleQuestion.IStore> 
> {
>     public constructor() 
>     {
>         super(input => assertType<ISaleQuestion.IStore>(input));
>     }
> }
> ```

```typescript
import * as express from "express";
import * as nest from "@nestjs/common";
import helper from "nestia-helper";

import { ISaleInquiry } from "@api/structures/ISaleInquiry";

export abstract class SaleInquiriesController<
        Content extends ISaleInquiry.IContent,
        Store extends ISaleInquiry.IStore,
        Json extends ISaleInquiry<Content>>
{
    /**
     * Constructor with type assert function.
     */
    protected constructor(private readonly assert: (input: Store) => void);

    /**
     * Store a new inquiry.
     * 
     * Write a new article inquirying about a sale.
     * 
     * @param request Instance of the Express.Request
     * @param section Code of the target section
     * @param saleId ID of the target sale
     * @param input Content to archive
     * @return Newly archived inquiry
     * 
     * @throw 400 bad request error when type of the input data is not valid
     * @throw 401 unauthorized error when you've not logged in yet
     */
    @nest.Post()
    public store
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("section", "string") section: string, 
            @helper.TypedParam("saleId", "string") saleId: string,
            @nest.Body() input: Store
        ): Promise<Json>;

    /**
     * Update an inquiry.
     * 
     * Update ordinary inquiry article. However, it would not modify the content reocrd
     * {@link ISaleInquiry.IContent}, but be accumulated into the {@link ISaleInquiry.contents}. 
     * Therefore, all of the poeple can read how the content has been changed.
     * 
     * @param request Instance of the Express.Request
     * @param section Code of the target section
     * @param saleId ID of the target sale
     * @param id ID of the target article to be updated
     * @param input New content to be overwritten
     * @return The newly created content record
     * 
     * @throw 400 bad request error when type of the input data is not valid
     * @throw 401 unauthorized error when you've not logged in yet
     * @throw 403 forbidden error when the article is not yours
     */
    @nest.Put(":id")
    public update
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("section", "string") section: string, 
            @helper.TypedParam("saleId", "string") saleId: string,
            @helper.TypedParam("id", "number") id: number,
            @nest.Body() input: Store
        ): Promise<Json>;
}
```




### Software Development Kit
> `Swagger` is torturing the client developers.
>
> If you're a backend developer and you deliver a `Swagger` to your companion client developers, the client developers should analyze the `Swagger` and implement duplicated router functions with DTO interfaces by themselves. During those jobs, if a client developer takes a mistake by mis-reading the `Swagger`, it becomes a critical runtime error directly.
>
> Why are you torturing the client developers such like that? If you deliver an SDK (Software Development Kit) instead of the `Swagger`, the client developers don't need to read the `Swagger` file. They never need to implement the duplicated DTO interfaces with router functions, either.
>
> Therefore, just build the SDK through this `nestia` and deliver the SDK. Your client developers would be anticipated from the long time torturing and become happy. Your solution would be much more reliable and efficient, too.

Looking at the SDK library file, generated by `nestia`, it is perfect.

Route method, path and parameters are well-formed and DTO structures are correctly imported. Also, descriptive comments are fully revived in the SDK library, regardless of where they are written.

Furthermore, there's not any problem even when a generic typed controller class comes. `nestia` will specialize the generic arguments exactly, by analyzing your `NestJS` server code, in the compilation level.

  - [simple/.../comments/index.ts](https://github.com/samchon/nestia/blob/master/demo/simple/src/api/functional/consumers/sales/articles/comments/index.ts)
  - [generic/.../questions/index.ts](https://github.com/samchon/nestia/tree/master/demo/generic/src/api/functional/consumers/sales/questions/index.ts)
  - [generic/.../reviews/index.ts](https://github.com/samchon/nestia/tree/master/demo/generic/src/api/functional/consumers/sales/reviews/index.ts)
  - [union/.../entire_articles/index.ts](https://github.com/samchon/nestia/tree/master/demo/union/src/api/functional/consumers/sales/entire_articles/index.ts)

```typescript
/**
 * @packageDocumentation
 * @module api.functional.consumers.sales.reviews
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher, Primitive } from "nestia-fetcher";
import type { IConnection } from "nestia-fetcher";
import { createStringifier } from "typescript-json";

import type { ISaleReview } from "./../../../../structures/ISaleReview";
import type { ISaleInquiry } from "./../../../../structures/ISaleInquiry";

/**
 * Store a new inquiry.
 * 
 * Write a new article inquirying about a sale.
 * 
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param request Instance of the Express.Request
 * @param section Code of the target section
 * @param saleId ID of the target sale
 * @param input Content to archive
 * @return Newly archived inquiry
 * @throw 400 bad request error when type of the input data is not valid
 * @throw 401 unauthorized error when you've not logged in yet
 * 
 * @controller ConsumerSaleReviewsController.store()
 * @path POST /consumers/:section/sales/:saleId/reviews
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function store
    (
        connection: IConnection,
        section: string,
        saleId: string,
        input: Primitive<store.Input>
    ): Promise<store.Output>
{
    return Fetcher.fetch
    (
        connection,
        store.ENCRYPTED,
        store.METHOD,
        store.path(section, saleId),
        input,
        store.stringify
    );
}
export namespace store
{
    export type Input = Primitive<ISaleReview.IStore>;
    export type Output = Primitive<ISaleInquiry<ISaleReview.IContent>>;

    export const METHOD = "POST" as const;
    export const PATH: string = "/consumers/:section/sales/:saleId/reviews";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(section: string, saleId: string): string
    {
        return `/consumers/${section}/sales/${saleId}/reviews`;
    }
    export const stringify = createStringifier<Input>();
}

/**
 * Update an inquiry.
 * 
 * Update ordinary inquiry article. However, it would not modify the content reocrd
 * {@link ISaleInquiry.IContent}, but be accumulated into the {@link ISaleInquiry.contents}. 
 * Therefore, all of the poeple can read how the content has been changed.
 * 
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param request Instance of the Express.Request
 * @param section Code of the target section
 * @param saleId ID of the target sale
 * @param id ID of the target article to be updated
 * @param input New content to be overwritten
 * @return The newly created content record
 * @throw 400 bad request error when type of the input data is not valid
 * @throw 401 unauthorized error when you've not logged in yet
 * @throw 403 forbidden error when the article is not yours
 * 
 * @controller ConsumerSaleReviewsController.update()
 * @path PUT /consumers/:section/sales/:saleId/reviews/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function update
    (
        connection: IConnection,
        section: string,
        saleId: string,
        id: number,
        input: Primitive<update.Input>
    ): Promise<update.Output>
{
    return Fetcher.fetch
    (
        connection,
        update.ENCRYPTED,
        update.METHOD,
        update.path(section, saleId, id),
        input,
        update.stringify
    );
}
export namespace update
{
    export type Input = Primitive<ISaleReview.IStore>;
    export type Output = Primitive<ISaleInquiry<ISaleReview.IContent>>;

    export const METHOD = "PUT" as const;
    export const PATH: string = "/consumers/:section/sales/:saleId/reviews/:id";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(section: string, saleId: string, id: number): string
    {
        return `/consumers/${section}/sales/${saleId}/reviews/${id}`;
    }
    export const stringify = createStringifier<Input>();
}
```




### Swagger
Building `Swagger` is also possible and even much powerful.

Looking at the [simple/swagger.json](https://editor.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsamchon%2Fnestia%2Fmaster%2Fdemo%2Fsimple%2Fswagger.json) file, generated by `nestia`, everything is perfect. Route method, path and parameters are well-formed. Also, schema definitions are exactly matched with the pure interface type `ISaleArticleComment`. Of course, descriptive comments are perfectly resurrected in the `description` properties of the `swagger.json` file.

Looking at the another file [generic/swagger.json](https://editor.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsamchon%2Fnestia%2Fmaster%2Fdemo%2Fgeneric%2Fswagger.json), you can find that there isn't any problem even when a generic typed DTO and controller come. The last file [union/swagger.json](https://editor.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsamchon%2Fnestia%2Fmaster%2Fdemo%2Funion%2Fswagger.json), there's no problem on the union type, either.

  - View in the `Swagger Editor`
    - [simple/swagger.json](https://editor.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsamchon%2Fnestia%2Fmaster%2Fdemo%2Fsimple%2Fswagger.json)
    - [generic/swagger.json](https://editor.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsamchon%2Fnestia%2Fmaster%2Fdemo%2Fgeneric%2Fswagger.json)
    - [union/swagger.json](https://editor.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsamchon%2Fnestia%2Fmaster%2Fdemo%2Funion%2Fswagger.json)

![Swagger Editor](https://github.com/samchon/nestia/wiki/images/swagger-editor-comment.png)




## Configuration
Components                   | `nestia.config.ts` | `CLI` | `@nestjs/swagger`
-----------------------------|--------------------|-------|------------------
Swagger Generation           | ✔  | ✔  | ✔
SDK Generation               | ✔  | ✔  | ❌
2x faster `JSON.stringify()` | ✔  | ❌ | ❌
Type check in runtime        | ✔  | ❌ | ❌
Custom compiler options      | ✔  | ❌ | ❌

`nestia` can configure generator options by two ways: CLI and configuration file.

At first, the CLI (Command Line Interface) is convenient, but does not support detailed options.

```sh
# BASIC COMMAND
npx nestia <sdk|swagger> <source_directories_or_patterns> \
    --exclude <exclude_directory_or_pattern> \
    --out <output_directory_or_file>

# EXAMPLES
npx nestia sdk "src/controllers" --out "src/api"
npx nestia swagger "src/**/*.controller.ts" --out "swagger.json"
npx nestia swagger "src/main/controllers" "src/sub/controllers" \
    --exclude "src/main/test" \
    --out "composite.swagger.json"

# ONLY WHEN NESTIA.CONFIG.TS EXISTS
npx nestia sdk
npx nestia swagger
```

Besides, the configuration file `nestia.config.ts` supports much detailed options. 

The detailed options are listed up to the `IConfiguration` interface. You can utilize the `IConfiguration` type like below. If you want to know more about those options, please check the [Guide Documents](https://github.com/samchon/nestia/wiki/Configuration).

<details>
    <summary> Read <code>IConfiguration</code> </summary>

```typescript
/**
 * Definition for the `nestia.config.ts` file.
 * 
 * @author Jeongho Nam - https://github.com/samchon
 */
export interface IConfiguration {
    /**
     * List of files or directories containing the `NestJS` controller classes.
     */
    input: string | string[] | IConfiguration.IInput;

    /**
     * Output directory that SDK would be placed in.
     * 
     * If not configured, you can't build the SDK library.
     */
    output?: string;

    /**
     * Compiler options for the TypeScript.
     * 
     * If you've omitted this property or the assigned property cannot fully cover the
     * `tsconfig.json`, the properties from the `tsconfig.json` would be assigned to here.
     * Otherwise, this property has been configured and it's detailed values are different 
     * with the `tsconfig.json`, this property values would be overwritten.
     * 
     * ```typescript
     * import ts from "typescript";
     * 
     * const tsconfig: ts.TsConfig;
     * const nestiaConfig: IConfiguration;
     * 
     * const compilerOptions: ts.CompilerOptions = {
     *     ...tsconfig.compilerOptions,
     *     ...(nestiaConfig.compilerOptions || {})
     * }
     * ```
     */
    compilerOptions?: ts.CompilerOptions;

    /**
     * Whether to assert parameter types or not.
     * 
     * If you configure this property to be `true`, all of the function parameters would be
     * checked through the [typescript-is](https://github.com/woutervh-/typescript-is). This
     * option would make your SDK library slower, but would be much safer in the type level
     * even in the runtime environment.
     */
    assert?: boolean;

    /**
     * Whether to optimize JSON string conversion 2x faster or not.
     * 
     * If you configure this property to be `true`, the SDK library would utilize the
     * [typescript-json](https://github.com/samchon/typescript-json) and the JSON string
     * conversion speed really be 2x faster.
     */
    json?: boolean;

    /**
     * Building `swagger.json` is also possible.
     * 
     * If not specified, you can't build the `swagger.json`.
     */
    swagger?: IConfiguration.ISwagger;
}
export namespace IConfiguration
{
    /**
     * List of files or directories to include or exclude to specifying the `NestJS` 
     * controllers.
     */
    export interface IInput {
        /**
         * List of files or directories containing the `NestJS` controller classes.
         */
        include: string[];

        /**
         * List of files or directories to be excluded.
         */
        exclude?: string[];
    }

    /**
     * Building `swagger.json` is also possible.
     */
    export interface ISwagger {
        /**
         * Output path of the `swagger.json`.
         * 
         * If you've configured only directory, the file name would be the `swagger.json`. 
         * Otherwise you've configured the full path with file name and extension, the 
         * `swagger.json` file would be renamed to it.
         */
        output: string;
    }
}
```
</details>

```typescript
import type { IConfiguration } from "nestia";

export const NESTIA_CONFIG: IConfiguration = {
    input: "./src/controllers",
    output: "./src/api",
    json: true,
    swagger: {
        output: "./public/swagger.json"
    }
};
export default NESTIA_CONFIG;
```




## Appendix
### Dependencies of the SDK
An SDK library generated by `nestia` requires [nestia-fetcher](https://github.com/samchon/nestia-fetcher) module. Also, [typescript-is](https://github.com/woutervh-/typescript-is) and [typescript-json](https://github.com/samchon/typescript-json) modules can be required following your `nestia.config.ts` configuration file.

The `npx nestia install` command installs those dependencies with the `package.json` configuration.

```bash
# MOVE TO THE DISTRIBUTION DIRECTORY
cd packages/api

# INSTALL DEPENDENCIES OF THE SDK
npx nestia install
```

### Template Repository
https://github.com/samchon/backend

I support template backend project using this `nestia` library, `samchon/backend`.

Reading the README content of the backend template repository, you can find lots of example backend projects who've been generated from the backend. Furthermore, those example projects guide how to generate SDK library from `nestia` and how to distribute the SDK library thorugh the NPM module.

Therefore, if you're planning to compose your own backend project using this `nestia`, I recommend you to create the repository and learn from the `samchon/backend` template project.

### Archidraw
https://www.archisketch.com/

I have special thanks to the Archidraw, where I'm working for.

The Archidraw is a great IT company developing 3D interior editor and lots of solutions based on the 3D assets. Also, the Archidraw is the first company who had adopted this nestia on their commercial backend project, even this nestia was in the alpha level.

> 저희 회사 "아키드로우" 에서, 삼촌과 함께 일할 프론트 개발자 분들을, 최고의 대우로 모십니다.
>
> "아키드로우" 는 3D (인테리어) 에디터 및 이에 관한 파생 솔루션들을 만드는 회사입니다. 다만 저희 회사의 주력 제품이 3D 에디터라 하여, 반드시 3D 내지 랜더링에 능숙해야 하는 것은 아니니, 일반적인 프론트 개발자 분들도 망설임없이 지원해주십시오.
>
> 그리고 저희 회사는 분위기가 다들 친하고 즐겁게 지내는 분위기입니다. 더하여 위 `nestia` 나 [typescript-json](https://github.com/samchon/typescript-json) 및 [payments](https://github.com/archidraw/payments) 등, 제법 합리적(?)이고 재미난 프로젝트들을 다양하게 체험해보실 수 있습니다.
>
> - 회사소개서: [archidraw.pdf](https://github.com/archidraw/payments/files/7696710/archidraw.pdf)
> - 기술 스택: React + TypeScript
> - 이력서: 자유 양식
> - 지원처: samchon@archisketch.com
