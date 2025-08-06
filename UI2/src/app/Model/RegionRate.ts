export interface CostReport {
    id: number,
    partNumber: number,
    partName: string,
    totalToolingCost:number,
    totalFinishWt:number,
    perKGRate:number,
    suppManfLoc:string,
    isChecked:boolean,
    createdBy: string,
    createdDate: Date
}