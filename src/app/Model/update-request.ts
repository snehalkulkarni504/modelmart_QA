export interface UpdateRequest {
    ModifiedBy?: string,
    SCTeamComments?: string,
    RequestHeaderId?: number,
    Status?: string,
    FilePath?:string,
    FolderLink?:string
}

export interface UpdateRequestbyAdmin {
    ModifiedBy?: string,
    SCTeamComments?: string,
    RequestHeaderId?: number,
    Status?: string,
}
