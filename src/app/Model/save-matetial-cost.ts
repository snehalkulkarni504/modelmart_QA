 
export class SaveMatetialCost {
    SaveMatetialCostHeader!: SaveMatetialCostHeader[];   
    SaveMatetialCostDetails!: SaveMatetialCostDetails[];
}

export interface SaveMatetialCostHeader {
    CSHeaderId?: number,
    CSDetailsId?: number,
    header?: any,
    value_existing?: number,
    value_updated?: number,
    Cost_Spec:any,
    Version :any,
    percent_updated:number,
}

// export interface SaveMatetialCostHeader {
//     CSHeaderId?: number,
//     CSDetailsId?: number,
//     CSUpdateId?: number,
//     DirectMaterialCost_USD?: number,
//     BoughtoutFinishCost_USD?: number,
//     DirectLaborCost_USD?: number,
//     ProcessOverheadCost_USD?: number,
//     SurfaceTreatmentsCost_USD?: number,
//     SGA_USD?: number,
//     Profit_USD?: number,
//     Packaging_USD?: number,
//     FreightLogistics_USD?: number,
//     DirectedBuyCost_USD?: number,
//     HandlingCharges_USD?: number,
//     ICC_USD?: number,
//     Rejection_USD?: number,
//     SupplierCost?: number,
//     DeltaValue?: number,
//     DeltaPercent?: number,
//     CreatedBy?: number,
//     SupplyLevel?: string,
//     CostSummaryLevel?: number,
//     Tier2Cost?: number,
//     CastingCost?: number,
//     ForgingCost?: number,
//     RoughPartCost_USD?: number,
//     SuppliedMaterialCost?: number,
//     TotalManufacturingCost?: number,
//     TotalCost?: number,
// }

export interface SaveMatetialCostDetails {

    CSHeaderId?: number,
    CSUpdateId?: number,
    MaterialType: string,
    MaterialCost?: number,
    PartFinishWeight?: number,
    GrossWeightKG?: number,
    UnitMaterialRate?: number,
    NetWeightKG?: number,
    GrossNetWeightKG?: number,
    ScrapRate?: number,
    UnitScrapRate?:number,
    MaterialScrapRate?: number,
    UpdateMaterialRate?: number,
    UpdateMaterialCost?: number,
    Created_By?: number,
    SupplyLevel:string,
    Casting:number,
}
