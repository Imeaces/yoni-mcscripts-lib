//根据 https://github.com/type-challenges/type-challenges/issues/9814 改写
export type DumpTupleRecordEntriesToUnion<T> = {
  [id in keyof T]-?: T[id] extends [infer Event, infer EventOpt] ? T[id] : never
}[keyof T]

//来源：https://segmentfault.com/q/1010000042243980
//展开只是想知道这个东西干了什么
type UnionToIntersection<U> =
    (U extends any
        ? (a: (k: U) => void) => void
        : never
    ) extends (a: infer I) => void
        ? I
        : never;

type UnionLast<U> =
    UnionToIntersection<U> extends (a: infer I) => void
        ? I
        : never;

export type UnionToTuple<U> =
    [U] extends [never]
        ? []
        : [...UnionToTuple<
                Exclude<
                    U,
                    UnionLast<U>
                 >
            >,
            UnionLast<U>
        ];

//来源：https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
export type Equals<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;
