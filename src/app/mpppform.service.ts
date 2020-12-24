import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class MpppformService {

  constructor(private http: Http) { }

  //
  async postMpppRecordToDB(jsonDTO) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    let options = new RequestOptions({ headers: headers });
    console.log(jsonDTO)
    var status={ code: 0, message: "" }
    var result = await this.http.post('api/postRecord', jsonDTO,options).toPromise().then(res=>{
    status = { code: 200, message: res.text() }
    }).catch(err => {
      status = { code: 400, message: "" };
    });
    return status;

  }

  // users of admin form
  async postUsersofAdminform(userjsonDTO) {
    let usersofadminDTO = JSON.stringify(userjsonDTO);
    console.log(usersofadminDTO);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    let options = new RequestOptions({ headers: headers });
    var status;
    let a = await this.http.post('api/createNewUser', userjsonDTO, options).toPromise().then(res => {
      console.log("res from create user service", res.text());
      status = { code: 200, message: res.text() }
    }).catch(err => {
      status = { code: 400, message: "" };
    });
    return status;
  }
//storing the file in object storage
async  storeToCloudObject(filedto)
{
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('X-Requested-With', 'XMLHttpRequest');
  let options = new RequestOptions({ headers: headers });
  var result = await this.http.post('api/fileUPloadCloud',  filedto,options).toPromise();
  return result.json();
}

}