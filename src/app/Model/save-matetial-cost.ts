
export class SaveMatetialCost {
    SaveMatetialCostHeader!: SaveMatetialCostHeader[];
    SaveMatetialCostDetails!: SaveMatetialCostDetails[];
    SaveProcessDetails!: SaveProcessDetails[];
    updatemodeldata!: updatemodeldata[];
}

export interface SaveMatetialCostHeader {
    CSHeaderId?: number,
    CSDetailsId?: number,
    header?: any,
    value_existing?: number,
    value_updated?: number,
    Cost_Spec: any,
    Version: any,
    percent_updated: number
}

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
    UnitScrapRate?: number,
    MaterialScrapRate?: number,
    UpdateMaterialRate?: number,
    UpdateMaterialCost?: number,
    Created_By?: number,
    SupplyLevel: string,
    Casting: number,
    UpdatenetWeightKG: number
}

export interface SaveProcessDetails {
    PartNumber?: any,
    ManufacturingProcessName?: any,
    ManufacturingCost?: any,
    UpdateManufacturingCost?: any,
    SupplyLevel?: any,
    ProcessStatus?: any
}

export interface updatemodeldata {
    csheaderid?: any,
    partnumber?: any,
    programname?: any,
    projecttype?: any,
    potentialsupplier?: any,
    businessunit?: any,
    annualvolume?: any,
    enginedisplacement?: any,
    supplierquote?: any
}