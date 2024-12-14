export interface CostReport {
    id: number,
    partNumber: number,
    partName: string,
    totalShouldCost:number,
    totalToolingCost:number,
    suppManfLoc:string,
    isChecked:boolean,
    createdBy: string,
    createdDate: Date
}