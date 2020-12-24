export class EnvReportCardDTO {
    material = [];
}
export class Material {
    name: string;
    totalWeight: number;
    bleachingRestrictionsCorrugated: BleachingResticationsCorrugated;
    recycledFiberContentCorrugated: RecycledFiberContentCorrugated
    recyclePercentage: number;
    svhc = [];
    snur = [];
    bleachingRestrictionsPaper: BleachingRestrictionsPaper
    recycledFiberContentPaper: RecycledFiberContentPaper;
    otherEcoMaterialReason: string;;
    compositePackagingValues: string;
    
}
export class BleachingResticationsCorrugated {
    isAllUnbleached: string;
    definitionsApplyForBleached: any;
}
export class RecycledFiberContentCorrugated {
    isPackageMaterialMeetEPAGL: string
    explanationForUnableToMeetEPAGL: string;
    EPFATOptionalCriteria:string;
}

export class BleachingRestrictionsPaper {
    isAllUnbleached: string;
    definitionsApplyForBleached: any;
}
export class RecycledFiberContentPaper {
    isPackageMaterialMeetEPAGL: string
    explanationForUnableToMeetEPAGL: string;
}
export class SVHC {
    type: string;
    weight: number;
}
export class SNUR {
    type: string;
    weight: number;
}


export const materiallist = ["Corrugated(20)",
    "Paper(22)",
    "Processed wood(plywood/masonite/OSB/etc)",
    "Wood(50)",
    "High density polyethylene HDPE(2)",
    "Low density polyethylene LDPE(4)",
    "Expanded polyethylene EPE(4)",
    "Expanded polypropylene EPP(5)",
    "Polypropylene PP(5)",
    "Expanded polystyrene/ arcel EPS(6)",
    "Polyurethane PU(7)",
    "Metal",
    "Rubber",
    "Cloth/fabric",
    "Polyethylene terephthalate PET(1)",
    "Composite-ESD bags",
    "Composite-non ESD bags",
    "Soy based urethane",
    "PLA (corn based plastic)",
    "Starch based foam",
    "Other eco materials"
]