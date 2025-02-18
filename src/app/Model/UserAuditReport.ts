export interface SearchData {
    UserId?: number,
    Action?: string,
    Keyword?: string,
    CreatedOn: Date
}

export interface ProjectData {
    UserId?: number,
    ModelMartId?: string,
    ProgramName?: string,
    Action?: string,
    CreatedOn: Date
}

export interface CompareData {
    UserId: number,
    CompareId:number,
    ModelMartId: string,
    ProgramName: string,
    CreatedOn: Date
}