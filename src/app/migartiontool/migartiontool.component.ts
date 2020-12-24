import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as XLSX from 'xlsx';
import { AssemblyDefinition, ProductDTO, Dimension } from './modelDTO/productdefinition';
import { MasterDTO } from './modelDTO/masterDTO';
import { MpppformService } from '../mpppform.service';
import { PackageAssemblyDetails, PackageDetailsDTO, PalletConfiguration } from './modelDTO/packagedetails';
import { BleachingResticationsCorrugated, BleachingRestrictionsPaper, EnvReportCardDTO, Material, SVHC, RecycledFiberContentCorrugated, RecycledFiberContentPaper, SNUR } from './modelDTO/environmentalreport';
import { Attachments, FileAttachmentsDTO } from './modelDTO/fileattachments';
import { EUDirectiveDTO } from './modelDTO/eudirective';
import { UserofApplication, UsersofAdminForm } from './modelDTO/newUser';
@Component({
  selector: 'app-migartiontool',
  templateUrl: './migartiontool.component.html',
  styleUrls: ['./migartiontool.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MigartiontoolComponent implements OnInit {
  productDTO: ProductDTO;
  masterDTO: MasterDTO;
  packageDTO: PackageDetailsDTO;
  envReportcardDTO: EnvReportCardDTO;
  fileattachmentsDTO: FileAttachmentsDTO;
  euDirectDTO: EUDirectiveDTO;
  usersofadminDTO: UsersofAdminForm;
  svhcJsonData;
  followFocus = true;
  cacheActive = false;
  isNavigation = true;
  attachmentsplit;
  mpppfile = new Set();
  userfile = new Set();
  title = "Import data to cloudant"
  description = "only allow xls file"
  buttonText = "Add file"
  buttonType = "primary";
  accept = [".xls", ".xlsx"];
  multiple = false;
  skeleton = false;
  size = "normal";
  disabled = false;
  fileName: File;
  fileStatus;
  snurJsonData;
  jsonData;
  constructor(private mservice: MpppformService) { }
  ngOnInit() {

  }
  //Users for Admin form mIgartion story

  usersforAdminUpload() {
    try {
      if (this.userfile.size > 0) {
        this.userfile.forEach(file => {
          this.fileName = file.file;
          this.fileStatus = file;
        })
        var reader = new FileReader()
        reader.readAsArrayBuffer(this.fileName)
        reader.onload = () => {
          var data = reader.result;
          var workbook = XLSX.read(data, { type: 'array' })
          var sheet1 = workbook.SheetNames[0];
          var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet1]);
          console.log(Object.values(jsonData))
          for (let i = 0; i < jsonData.length; i++) {
            var rowData = jsonData[i];
            this.constructUsersforAdminDTO(rowData);

          }
        }
      }
    } catch (err) {
      console.error("Exception occured" + err)
    }

  }
  // consturcting the json for users for admin form

  constructUsersforAdminDTO(rowData) {
    if (!this.fileStatus.uploaded) {
      this.fileStatus.state = "upload";
      var applicationName = this.formatEmptyDataWithSpace(rowData.Application).split(',');
      var applicationId = this.formatData(rowData.ApplicationID).split(',');
      for (let i = 0; i < applicationName.length; i++) {
        if (applicationName[i] == UserofApplication.application && applicationId[i] == UserofApplication.applicationId) {
          this.usersofadminDTO = new UsersofAdminForm();
          this.usersofadminDTO.idp = "ibmid";
          this.usersofadminDTO.idpIdentity = this.formatData(rowData.MailAddress);
          this.usersofadminDTO.role = "author";
          this.usersofadminDTO.companyName = this.formatData(rowData.CompanyName);
          this.usersofadminDTO.companyNumber = this.formatData(rowData.CompanyNumber);
          this.usersofadminDTO.userName = this.formatData(rowData.FirstName) + " " + this.formatData(rowData.LastName);
          if (this.usersofadminDTO.companyName != "IBM") {
            this.usersofadminDTO.supplierId = this.formatData(rowData.FullName_1);
          }
          this.mservice.postUsersofAdminform(this.usersofadminDTO).then(res => {

            this.fileStatus.state = "complete";
            this.fileStatus.uploaded = true;

            console.log(res);
          })
        }

      }
    }
  }

//This is method for MPPP Migration

  async mpppFormUpload() {
    try {
      if (this.mpppfile.size > 0) {
        this.mpppfile.forEach(file => {
          this.fileName = file.file;
          this.fileStatus = file;
        })
        var reader = new FileReader()
        reader.readAsArrayBuffer(this.fileName)
        reader.onload = () => {
          var data = reader.result;
          var workbook = XLSX.read(data, { type: 'array' })
          this.jsonData = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet2);
          this.svhcJsonData = XLSX.utils.sheet_to_json(workbook.Sheets.SVHCREP_2);
          this.snurJsonData = XLSX.utils.sheet_to_json(workbook.Sheets.SNURREP_3)
          console.log(this.jsonData, this.svhcJsonData)
          for (let i = 0; i < this.jsonData.length; i++) {
            var rowData = this.jsonData[i];
            this.constructMasterDTO(rowData, i + 1);

          }
        }
      }
    } catch (err) {
      console.error("Exception occured" + err)
    }

  }

  //Construct the MasterDTO for Mpppform

  async constructMasterDTO(rowData, currentIndex) {
    this.masterDTO = new MasterDTO();
    this.productDTO = new ProductDTO();
    this.fileattachmentsDTO = new FileAttachmentsDTO();
    await this.constructFileAttachmentDTO(rowData);
    this.constructProductdefinationDTO(rowData, this.productDTO);
    this.constructPackageDetailsDTO(rowData);
    this.envReportcardDTO = new EnvReportCardDTO();
    this.constructEnvReportCardDTO(rowData);
    this.euDirectDTO = new EUDirectiveDTO();
    this.constructEuDirectiveDTO(rowData);
    this.masterDTO.productDTO = this.productDTO;
    this.masterDTO.packageDTO = this.packageDTO;
    this.masterDTO.envReportDTO = this.envReportcardDTO;
    this.masterDTO.euDirectiveDTO = this.euDirectDTO;
    this.masterDTO.attachmentsDTO = this.fileattachmentsDTO;
    try {
      await this.postMpppRecordsToDB(this.fileStatus, currentIndex)
    } catch (err) {
      console.log("cloudant exception", err)
    }
  }

  //Construct the ProductDTO of MPPPform

  constructProductdefinationDTO(rowData, productDTO) {
    var assemblyDefination = new AssemblyDefinition();
    assemblyDefination.assemblyDefinitionType = this.formatData(rowData.Assembly_def);
    if (assemblyDefination.assemblyDefinitionType == 'Machine Type') {
      assemblyDefination.machineType = this.formatData(rowData.MachineType);
      assemblyDefination.machineModel = this.formatData(rowData.Model);
    }
    else if (assemblyDefination.assemblyDefinitionType == 'Part Number') {
      assemblyDefination.partNumber = this.formatData(rowData.PartNumber);
    }
    productDTO.assembyDefinition = assemblyDefination;
    productDTO.featureCode = this.formatData(rowData.FeatureCode)
    productDTO.siteName = this.formatData(rowData.Site);
    productDTO.siteContact = this.formatData(rowData.IBMRep);
    productDTO.supplierCompanyName = this.formatData(rowData.OEMSupplierName);
    productDTO.supplierCompanyContactName = this.formatData(rowData.SupContactName);
    productDTO.supplierCompanyContactEmail = this.formatData(rowData.SupContactEmail);
    productDTO.productFamily = this.formatData(rowData.ProdFam);
    productDTO.prodDescription = this.formatData(rowData.Prod_Desc);
    productDTO.prodWeight = this.formatData(rowData.Prod_Wt);
    var prodDimension = new Dimension();
    prodDimension.width = this.formatData(rowData.P_W);
    prodDimension.depth = this.formatData(rowData.P_D);
    prodDimension.length = this.formatData(rowData.P_L);
    productDTO.prodDimension = prodDimension;
  }

  //Construct the PackageDTO of MPPPForm

  constructPackageDetailsDTO(rowData) {
    this.packageDTO = new PackageDetailsDTO();
    let isMultiGeo = rowData.IsMultiGeo;
    var arrGeoIndex = this.getGeoIndexes(isMultiGeo);
    this.packageDTO.packageAssemblyDetails = [];
    this.packageDTO.isSamePackageUsedForMultiGeos = this.toBoolean(this.formatData(isMultiGeo));
    for (let i = 0; i < arrGeoIndex.length; i++) {
      var packageAssemblyDetails = new PackageAssemblyDetails();
      var geoIndex = arrGeoIndex[i];
      let geoKey;
      let packkey;
      if (geoIndex == 0) {
        geoKey = "IndGeos";
        packkey = "PD_0"
      }
      else {
        geoKey = "Geography_" + geoIndex;
        packkey = "Pd_" + geoIndex;
      }
      if (rowData[geoKey] != undefined) {
        packageAssemblyDetails.geosTagged = rowData[geoKey];
        let standship = "StndShipConfig_" + geoIndex;
        let pbmaterial = "PB_" + geoIndex;
        let powerpack = "PPSize_" + geoIndex;
        let singleunitlength = "L_" + geoIndex;
        let singleunitwidth = "W_" + geoIndex;
        let singleunitdepth = "D_" + geoIndex
        let singleunitperpallet = "SUPP_" + geoIndex;
        let palletsizeandtype = "PalletSNT_" + geoIndex;
        let palletwtinkgs = "CPWt_" + geoIndex;
        let paldimlength = "CPDms_" + geoIndex;
        let paldimwidth = "CPWd_" + geoIndex;
        let paldimheight = "CPDt_" + geoIndex;
        let palunitloaddimlength = "UL_" + geoIndex;
        let palunitloaddimwidth = "UW_" + geoIndex;
        let palunitloaddimdepth = "UD_" + geoIndex;
        let unitloadwtpalletkg = "ULW_" + geoIndex;
        let safestackheightqty = "SH_" + geoIndex;
        let safestackheightmeasure = "SU_" + geoIndex;
        let singleunitpackproduct = "PW_" + geoIndex;


        packageAssemblyDetails.packageAssemblyDescription = rowData[packkey];
        packageAssemblyDetails.standardShipConfiguration = rowData[standship];
        packageAssemblyDetails.packageBillOfMaterial = rowData[pbmaterial];
        packageAssemblyDetails.selectPowerPackSize = rowData[powerpack];


        let singleUnitPackagedProductDimensionsInMM = { depth: undefined, width: undefined, length: undefined };
        singleUnitPackagedProductDimensionsInMM.length = rowData[singleunitlength];
        singleUnitPackagedProductDimensionsInMM.width = rowData[singleunitwidth];
        singleUnitPackagedProductDimensionsInMM.depth = rowData[singleunitdepth];
        packageAssemblyDetails.singleUnitPackagedProductDimensionsInMM = singleUnitPackagedProductDimensionsInMM;

        let palletizedConfigDetails = new PalletConfiguration();
        palletizedConfigDetails.qtyOfSingleUnitPacksPerPallet = rowData[singleunitperpallet];
        palletizedConfigDetails.palletSizeAndType = rowData[palletsizeandtype];
        palletizedConfigDetails.palletWeightInKG = rowData[palletwtinkgs];

        let palletDimensionsInMM = { depth: undefined, width: undefined, length: undefined };
        palletDimensionsInMM.length = rowData[paldimlength];
        palletDimensionsInMM.width = rowData[paldimwidth];
        palletDimensionsInMM.depth = rowData[paldimheight];
        palletizedConfigDetails.palletDimensionsInMM = palletDimensionsInMM;

        let palletizedUnitLoadOutDimensionsInMM = { depth: undefined, width: undefined, length: undefined };
        palletizedUnitLoadOutDimensionsInMM.depth = rowData[palunitloaddimdepth];
        palletizedUnitLoadOutDimensionsInMM.width = rowData[palunitloaddimwidth];
        palletizedUnitLoadOutDimensionsInMM.length = rowData[palunitloaddimlength];
        palletizedConfigDetails.palletizedUnitLoadOutDimensionsInMM = palletizedUnitLoadOutDimensionsInMM;

        palletizedConfigDetails.unitLoadWtIncludingPalletInKG = rowData[unitloadwtpalletkg]
        palletizedConfigDetails.safeStackingHeightQty = rowData[safestackheightqty];
        palletizedConfigDetails.safeStackingHeightMeasuredIn = rowData[safestackheightmeasure];
        packageAssemblyDetails.palletizedConfigDetails = palletizedConfigDetails;
        packageAssemblyDetails.singleUnitPackagedProductWtInKG = rowData[singleunitpackproduct];

        this.packageDTO.packageAssemblyDetails.push(packageAssemblyDetails);
      }
    }
    console.log(JSON.stringify(this.packageDTO))
  }
  getGeoIndexes(isMultiGeoPresent) {
    var arrGeoIndexes = [];
    if (isMultiGeoPresent) {
      arrGeoIndexes[0] = 0;
    } else {
      arrGeoIndexes[0] = 1;
      arrGeoIndexes[1] = 2;
      arrGeoIndexes[2] = 3;
    }
    return arrGeoIndexes;
  }
  // Construct the EnvReportcardDTO of MPPP form

  constructEnvReportCardDTO(rowData) {
    this.envReportcardDTO = new EnvReportCardDTO();
    this.envReportcardDTO.material = [];
    var materialsplit = this.formatEmptyDataWithSpace(rowData.EnvMaterials).split(',')
    if (materialsplit) {
      for (let i = 0; i < materialsplit.length; i++) {
        //logic for svhc and snur and totalweight and recycle percentage
        var materialtemp = new Material();
        if (materialsplit[i] == 'Corrugated(20)') {
          materialtemp.bleachingRestrictionsCorrugated = this.getBleachingRestrictionsCorrugated(rowData);
          materialtemp.recycledFiberContentCorrugated = this.getRecycledFiberContentCorrugated(rowData);
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_0, this.svhcJsonData[i].SVHCWt_0, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_0, this.snurJsonData[i].SNURWt_0, materialtemp)
            }
          }
          materialtemp.name = "Corrugated(20)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.COR_0, rowData.COR_1, rowData.COR_2, rowData.COR_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCCOR_0, rowData.RCCOR_1, rowData.RCCOR_2, rowData.RCCOR_3)
        }

        else if (materialsplit[i] == 'Paper(22)') {
          materialtemp.bleachingRestrictionsPaper = this.getBleachingRestrictionsPaper(rowData);
          materialtemp.recycledFiberContentPaper = this.getRecycledFiberContentPaper(rowData);
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_1, this.svhcJsonData[i].SVHCWt_1, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_1, this.snurJsonData[i].SNURWt_1, materialtemp)
            }
          }
          materialtemp.name = "Paper(22)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.PA_0, rowData.PA_1, rowData.PA_2, rowData.PA_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCPA_0, rowData.RCPA_1, rowData.RCPA_2, rowData.RCPA_3)
        }

        else if (materialsplit[i] == 'Processed Wood(Plywood/Masonite/OSB/etc)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_2, this.svhcJsonData[i].SVHCWt_2, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_2, this.snurJsonData[i].SNURWt_2, materialtemp)
            }
          }
          materialtemp.name = "Processed wood(plywood/masonite/OSB/etc)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.WP_0, rowData.WP_1, rowData.WP_2, rowData.WP_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCWP_0, rowData.RCWP_1, rowData.RCWP_2, rowData.RCWP_3)

        }
        else if (materialsplit[i] == 'Wood(50)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_3, this.svhcJsonData[i].SVHCWt_3, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_3, this.snurJsonData[i].SNURWt_3, materialtemp)
            }
          }
          materialtemp.name = "Wood(50)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.WD_0, rowData.WD_1, rowData.WD_2, rowData.WD_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCWD_0, rowData.RCWD_1, rowData.RCWD_2, rowData.RCWD_3)
        }
        else if (materialsplit[i] == 'High Density Polyethylene HDPE(2)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_4, this.svhcJsonData[i].SVHCWt_4, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_4, this.snurJsonData[i].SNURWt_4, materialtemp)
            }
          }
          materialtemp.name = "High density polyethylene HDPE(2)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.HD_0, rowData.HD_1, rowData.HD_2, rowData.HD_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCHD_0, rowData.RCHD_1, rowData.RCHD_2, rowData.RCHD_3)
        }
        else if (materialsplit[i] == 'Low Density Polyethylene LDPE(4)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_5, this.svhcJsonData[i].SVHCWt_5, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_5, this.snurJsonData[i].SNURWt_5, materialtemp)
            }
          }
          materialtemp.name = "Low density polyethylene LDPE(4)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.LD_0, rowData.LD_1, rowData.LD_2, rowData.LD_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCLD_0, rowData.RCLD_1, rowData.RCLD_2, rowData.RCLD_3)
        }

        else if (materialsplit[i] == 'Expanded Polyethylene EPE(4)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_6, this.svhcJsonData[i].SVHCWt_6, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_6, this.snurJsonData[i].SNURWt_6, materialtemp)
            }
          }
          materialtemp.name = "Expanded polyethylene EPE(4)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.EPE_0, rowData.EPE_1, rowData.EPE_2, rowData.EPE_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCEPE_0, rowData.RCEPE_1, rowData.RCEPE_2, rowData.RCEPE_3)
        }

        else if (materialsplit[i] == 'Expanded Polypropylene EPP(5)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_7, this.svhcJsonData[i].SVHCWt_7, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_7, this.snurJsonData[i].SNURWt_7, materialtemp)
            }
          }
          materialtemp.name = "Expanded polypropylene EPP(5)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.EPP_0, rowData.EPP_1, rowData.EPP_2, rowData.EPP_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCEPP_0, rowData.RCEPP_1, rowData.RCEPP_2, rowData.RCEPP_3)
        }

        else if (materialsplit[i] == 'Polypropylene PP(5)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_8, this.svhcJsonData[i].SVHCWt_8, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_8, this.snurJsonData[i].SNURWt_8, materialtemp)
            }
          }
          materialtemp.name = "Polypropylene PP(5)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.Pp_0, rowData.Pp_1, rowData.Pp_2, rowData.Pp_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCPP_0, rowData.RCPP_1, rowData.RCPP_2, rowData.RCPP_3)
        }

        else if (materialsplit[i] == 'Expanded Polystyrene/ Arcel EPS(6)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_9, this.svhcJsonData[i].SVHCWt_9, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_9, this.snurJsonData[i].SNURWt_9, materialtemp)
            }
          }
          materialtemp.name = "Expanded polystyrene/ arcel EPS(6)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.EPS_0, rowData.EPS_1, rowData.EPS_2, rowData.EPS_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCEPS_0, rowData.RCEPS_1, rowData.RCEPS_2, rowData.RCEPS_3)
        }

        else if (materialsplit[i] == 'Polyurethane PU(7)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_10, this.svhcJsonData[i].SVHCWt_10, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_10, this.snurJsonData[i].SNURWt_10, materialtemp)
            }
          }
          materialtemp.name = "Polyurethane PU(7)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.PU_0, rowData.PU_1, rowData.PU_2, rowData.PU_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCPU_0, rowData.RCPU_1, rowData.RCPU_2, rowData.RCPU_3)
        }

        else if (materialsplit[i] == 'Metal') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_11, this.svhcJsonData[i].SVHCWt_11, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_11, this.snurJsonData[i].SNURWt_11, materialtemp)
            }
          }
          materialtemp.name = "Metal"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.M_0, rowData.M_1, rowData.M_2, rowData.M_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCM_0, rowData.RCM_1, rowData.RCM_2, rowData.RCM_3)
        }

        else if (materialsplit[i] == 'Rubber') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_12, this.svhcJsonData[i].SVHCWt_12, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_12, this.snurJsonData[i].SNURWt_12, materialtemp)
            }
          }
          materialtemp.name = "Rubber"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.R_0, rowData.R_1, rowData.R_2, rowData.R_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCR_0, rowData.RCR_1, rowData.RCR_2, rowData.RCR_3)
        }

        else if (materialsplit[i] == 'Cloth/Fabric') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_13, this.svhcJsonData[i].SVHCWt_13, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_13, this.snurJsonData[i].SNURWt_13, materialtemp)
            }
          }
          materialtemp.name = "Cloth/fabric"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.C_0, rowData.C_1, rowData.C_2, rowData.C_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCC_0, rowData.RCC_1, rowData.RCC_2, rowData.RCC_3)
        }

        else if (materialsplit[i] == 'Polyethylene Terephthalate PET(1)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_14, this.svhcJsonData[i].SVHCWt_14, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_14, this.snurJsonData[i].SNURWt_14, materialtemp)
            }
          }
          materialtemp.name = "Polyethylene terephthalate PET(1)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.PET_0, rowData.PET_1, rowData.PET_2, rowData.PET_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCPET_0, rowData.RCPET_1, rowData.RCPET_2, rowData.RCPET_3)
        }

        else if (materialsplit[i] == 'Composite (includes ESD bags)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_15, this.svhcJsonData[i].SVHCWt_15, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_15, this.snurJsonData[i].SNURWt_15, materialtemp)
            }
          }
          materialtemp.name = "Composite-ESD bags";
          materialtemp.compositePackagingValues = this.formatData(rowData.Material);
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.COM_0, rowData.COM_1, rowData.COM_2, rowData.COM_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCCOM_0, rowData.RCCOM_1, rowData.RCCOM_2, rowData.RCCOM_3)
        }

        else if (materialsplit[i] == 'Composite (non includes ESD bags)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_16, this.svhcJsonData[i].SVHCWt_16, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_16, this.snurJsonData[i].SNURWt_16, materialtemp)
            }
          }
          materialtemp.name = "Composite-non ESD bags";
          materialtemp.compositePackagingValues = this.formatData(rowData.Material);
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.COMN_0, rowData.COMN_1, rowData.COMN_2, rowData.COMN_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCCOMN_0, rowData.RCCOMN_1, rowData.RCCOMN_2, rowData.RCCOMN_3)
        }

        else if (materialsplit[i] == 'Soy Based Urethane') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_17, this.svhcJsonData[i].SVHCWt_17, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_17, this.snurJsonData[i].SNURWt_17, materialtemp)
            }
          }
          materialtemp.name = "Soy based urethane"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.SOY_0, rowData.SOY_1, rowData.SOY_2, rowData.SOY_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCSOY_0, rowData.RCSOY_1, rowData.RCSOY_2, rowData.RCSOY_3)
        }

        else if (materialsplit[i] == 'PLA (Corn Based Plastic)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_18, this.svhcJsonData[i].SVHCWt_18, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_18, this.snurJsonData[i].SNURWt_18, materialtemp)
            }
          }
          materialtemp.name = "PLA (corn based plastic)"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.PLA_0, rowData.PLA_1, rowData.PLA_2, rowData.PLA_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCPLA_0, rowData.RCPLA_1, rowData.RCPLA_2, rowData.RCPLA_3)
        }

        else if (materialsplit[i] == 'Starch Based Foam') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_19, this.svhcJsonData[i].SVHCWt_19, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_19, this.snurJsonData[i].SNURWt_19, materialtemp)
            }
          }
          materialtemp.name = "Starch based foam"
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.SBF_0, rowData.SBF_1, rowData.SBF_2, rowData.SBF_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCSBF_0, rowData.RCSBF_1, rowData.RCSBF_2, rowData.RCSBF_3)
        }
        else if (materialsplit[i] == 'Other Eco Materials (Please provide details below)') {
          if (rowData.SVHCRep_UNID) {
            for (let i = 0; i < this.svhcJsonData.length; i++) {
              if (rowData.SVHCRep_UNID == this.svhcJsonData[i].UNID)
                materialtemp.svhc = this.svhcCastypeForMaterial(this.svhcJsonData[i].SVHC_20, this.svhcJsonData[i].SVHCWt_20, materialtemp)
            }
          }
          if (rowData.SNURRep_UNID) {
            for (let i = 0; i < this.snurJsonData.length; i++) {
              if (rowData.SNURRep_UNID == this.snurJsonData[i].UNID)
                materialtemp.snur = this.snurCastypeForMaterial(this.snurJsonData[i].SNUR_20, this.snurJsonData[i].SNURWt_20, materialtemp)
            }
          }
          materialtemp.name = "Other eco materials";
          materialtemp.otherEcoMaterialReason = this.formatData(rowData.OtherEcoMaterialsDetails)
          materialtemp.totalWeight = this.getTotalweightforMaterial(rowData.OECO_0, rowData.OECO_1, rowData.OECO_2, rowData.OECO_3)
          materialtemp.recyclePercentage = this.getRecyclePercentageforMaterial(rowData.RCOECO_0, rowData.RCOECO_1, rowData.RCOECO_2, rowData.RCOECO_3)
        }
        this.envReportcardDTO.material.push(materialtemp);
      }
    }

  }
  //Construct the eudirectiveDTO of MPPPform

  constructEuDirectiveDTO(rowData) {
    this.euDirectDTO = new EUDirectiveDTO();
    this.euDirectDTO.criticalFactors = rowData.EUDir;
    this.euDirectDTO.reasoningForCriticalFactor = rowData.EUDirWhy;
    this.euDirectDTO.recommendedActions = rowData.EUDirRec;
  }
  //Construct the fileattachmentsDTO of MPPPform

  async constructFileAttachmentDTO(rowData) {
    if (rowData.Attachments != null) {
      var result = await this.mservice.storeToCloudObject(this.formatEmptyDataWithSpace(rowData.Attachments).split(','));
      this.attachmentsplit = result;
      for (let i = 0; i < this.attachmentsplit.length; i++) {
        var attachments = new Attachments();
        attachments.bucket = "esi-packagingapp-rewrite"
        attachments.key = this.attachmentsplit[i]
        this.fileattachmentsDTO.attachments.push(attachments)
      }
    }
  }

  //This is method for passing MasterDTO to cloudant

  async postMpppRecordsToDB(file, currentIndex) {
    var stringJsonDTO = JSON.stringify(this.masterDTO);
    if (!file.uploaded) {
      file.state = "upload";
      const a = await this.mservice.postMpppRecordToDB(stringJsonDTO);
      if (currentIndex == this.jsonData.length) {
        file.state = "complete";
        file.uploaded = true;
      }
    }
  }

  //This is method for excel cell data is null it return empty string other wise space removing
  
  formatData(data) {
    var returnData;
    if (data == null || data == 'null') {
      returnData = "";
    } else {
      returnData = data + "";
    }
    if (returnData) {
      returnData = returnData.replace(/  +/g, ' ').trim();
      //returnData = returnData.replace(/\s*,\s*/g, ",");
    }
    return returnData;
  }

  //This is method for space removing after comma in excel data
  formatEmptyDataWithSpace(data) {
    var returnData;
    if (data == null || data == 'null') {
      returnData = " ";
    } else {
      returnData = data;
      returnData = returnData.replace(/\s*,\s*/ig, ',');
    }
    return returnData;
  }
  
  toBoolean(value) {
    if (value) {
      switch (value.toLowerCase().trim()) {
        case "true": case "t": case "yes": case "y": case "1": return true;
        case "false": case "f": case "no": case "n": case "0": case null: return false;
        default: return Boolean(value);
      }

    } else {
      return false;
    }
  }

  //bleachingRestictions for corrugated
  getBleachingRestrictionsCorrugated(rowData) {
    var temp = new BleachingResticationsCorrugated();
    temp.isAllUnbleached = this.formatData(rowData.fldUnbleached);
    temp.definitionsApplyForBleached = this.formatData(rowData.fldBleached)
    return temp;
  }

  //recyclefibercontent for corg
  getRecycledFiberContentCorrugated(rowData) {
    var temp = new RecycledFiberContentCorrugated();
    temp.isPackageMaterialMeetEPAGL = this.formatData(rowData.fldEPATreq);
    temp.explanationForUnableToMeetEPAGL = this.formatData(rowData.fldExplanation_1)
    return temp
  }
  //bleachingrestictions for paper
  getBleachingRestrictionsPaper(rowData) {
    var temp = new BleachingRestrictionsPaper();
    temp.isAllUnbleached = this.formatData(rowData.fldpaperUnbleached);
    temp.definitionsApplyForBleached = this.formatData(rowData.fldpaperBleached)
    return temp;
  }
  //recyclefiber for paper
  getRecycledFiberContentPaper(rowData) {
    var temp = new RecycledFiberContentPaper();
    temp.isPackageMaterialMeetEPAGL = this.formatData(rowData.fldEPA);
    temp.explanationForUnableToMeetEPAGL = this.formatData(rowData.fldEPAExplanation)
    return temp;
  }

  //This is method for svhccastype and svhccasweight
  svhcCastypeForMaterial(svhccastype, svhcweightvalue, materialtemp) {
    var svhccassplit = this.formatData(svhccastype).split(',');
    var svhccasweight = this.formatData(svhcweightvalue).split(',')
    for (let i in svhccassplit) {
      var temp = new SVHC();
      temp.type = svhccassplit[i];
      temp.weight = svhccasweight[i];
      materialtemp.svhc.push(temp);
    }
    return materialtemp.svhc;
  }

  //This is the method for snurcastype and snurcasweight
  snurCastypeForMaterial(snurcastype, snurcasweight, materialtemp) {
    var snurcassplit = this.formatData(snurcastype).split(',')
    var snurcasweightsplit = snurcasweight.split(',')
    for (let i in snurcassplit) {
      var temp = new SNUR();
      temp.type = snurcassplit[i];
      temp.weight = snurcasweightsplit[i];
      materialtemp.snur.push(temp);
    }
    return materialtemp.snur;
  }

  //This is method for totalweight

  getTotalweightforMaterial(totalweight_0, totalweight_1, totalweight_2, totalweight_3) {
    let totalWeight;
    if (this.formatData(totalweight_0)) {
      totalWeight = this.formatData(totalweight_0);
    }
    else if (this.formatData(totalweight_1)) {
      totalWeight = this.formatData(totalweight_1);
    }
    else if (this.formatData(totalweight_2)) {
      totalWeight = this.formatData(totalweight_2)
    }
    else if (this.formatData(totalweight_3)) {
      totalWeight = this.formatData(totalweight_3)
    }
    return totalWeight;
  }

  //This is the method for recyclepercentage
  getRecyclePercentageforMaterial(recyclepercentage_0, recyclepercentage_1, recyclepercentage_2, recyclepercentage_3) {
    let recyclePercentage;
    if (this.formatData(recyclepercentage_0)) {
      recyclePercentage = this.formatData(recyclepercentage_0)
    }
    else if (this.formatData(recyclepercentage_1)) {
      recyclePercentage = this.formatData(recyclepercentage_1)
    }
    else if (this.formatData(recyclepercentage_2)) {
      recyclePercentage = this.formatData(recyclepercentage_2)
    }
    else if (this.formatData(recyclepercentage_3)) {
      recyclePercentage = this.formatData(recyclepercentage_3)
    }
    return recyclePercentage;
  }
}