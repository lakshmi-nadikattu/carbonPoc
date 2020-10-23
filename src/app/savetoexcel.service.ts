import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class SavetoexcelService {
  constructor(private http:Http){}
  //getURL="http://localhost:2000/api/getDoctorList";
  async getDoctorDetails() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    const a = await this.http.get('api/getDoctorList', options).toPromise();
    console.log("json data==>", a.json());
    return a.json()
  }
   masterdto;
async savepatientDetails(dto)
{
  this.masterdto={};
  this.masterdto._id="patient2";
  this.masterdto.patientdetails=dto
  JSON.stringify(dto);
  let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log(this.masterdto)
  const a = await this.http.post('api/savepatientdetais',JSON.stringify(this.masterdto), options).toPromise();
    console.log(a)
    return a;
}

}

  // fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  // fileExtension = '.xlsx';
  // constructor() { }
  // exportExcel(jsonData: any[], fileName: string)
  // {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    
  //   const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
  //   const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   this.saveExcelFile(excelBuffer, fileName);
  // }
  // private saveExcelFile(buffer: any, fileName: string): void {
  //   console.log("xxxxxxxxxxxxx")
  //   const data: Blob = new Blob([buffer], {type: this.fileType});
  //   FileSaver.saveAs(data, fileName + this.fileExtension);
  // }
   
