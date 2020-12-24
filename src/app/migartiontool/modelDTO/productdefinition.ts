class ProductDTO {
    assembyDefinition: AssemblyDefinition;
    featureCode: string;
    siteName: string;
    siteContact:string;
    supplierCompanyName: string;
    supplierCompanyContactName: string;
    supplierCompanyContactEmail: string;
    productFamily: string;
    prodDescription: string;
    prodWeight: any;
    prodDimension: Dimension
    fragilityLevel: number;
    notes: string;
}
class AssemblyDefinition {
    assemblyDefinitionType: string;
    machineType: string;
    machineModel: string;
    partNumber: string;
}
class Dimension {
    //any type because we need to store floating point numbers
    depth: any;
    width: any;
    length: any;
}
export { ProductDTO, AssemblyDefinition,Dimension };