class PalletConfiguration {
    qtyOfSingleUnitPacksPerPallet: number;
    palletSizeAndType: string;
    palletWeightInKG: any;
    palletDimensionsInMM: Dimension;
    palletizedUnitLoadOutDimensionsInMM: Dimension;
    unitLoadWtIncludingPalletInKG: any;
    safeStackingHeightQty: number;
    safeStackingHeightMeasuredIn: string;
}

class PackageAssemblyDetails {
    geosTagged: string;
    packageAssemblyDescription: string;
    standardShipConfiguration: string;
    packageBillOfMaterial: string;
    singleUnitPackagedProductDimensionsInMM: Dimension;
    singleUnitPackagedProductWtInKG: any;
    palletizedConfigDetails: PalletConfiguration;
    selectPowerPackSize: string;
}

class PackageDetailsDTO {
    isSamePackageUsedForMultiGeos: boolean;
    packageAssemblyDetails: any; //either a PackageAssemblyDetails object or array of PackageAssemblyDetails
}

interface Dimension {
    //any type because we need to store floating point numbers
    depth: any;
    width: any;
    length: any;
}
export { PalletConfiguration, PackageDetailsDTO, PackageAssemblyDetails };