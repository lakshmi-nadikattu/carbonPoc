import { PackageDetailsDTO } from './packagedetails';
import {ProductDTO} from './productdefinition';
import {EnvReportCardDTO} from './environmentalreport';
import{EUDirectiveDTO} from './eudirective'
import{FileAttachmentsDTO} from './fileattachments'
import{ProfileMetaData}from './metaprofile'
export class MasterDTO{
    _id?: string;
    _rev? :string;
    productDTO: ProductDTO;
    packageDTO: PackageDetailsDTO;
    envReportDTO: EnvReportCardDTO;
    euDirectiveDTO:EUDirectiveDTO;
    attachmentsDTO:FileAttachmentsDTO;
    profileMetaData:ProfileMetaData
    
}