export class EmployeeDTO {
		empName: string;
		empNo: string;
		empDesignation: string;
		empLocation: string;
		address: EmpAdress;
}
export class EmpAdress {

		H_No: string;
		street: string;
		cityName: string;
		pincode: number;
}
