/** 区块状态枚举 */
export enum FSChunkType {
    EmptyChunkIndex = 0,
    SuperChunkIndex = 1,
    DataChunkIndex = 2,
    NormalChunkIndex = 3,
    DeletedChunkIndex = 4,
}

