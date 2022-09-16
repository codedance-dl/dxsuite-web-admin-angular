import { Injectable } from "@angular/core";
import { EmployeesService, UserService } from "@api";

@Injectable({providedIn: 'root'})
export class EmployeesSubService {
    constructor(
        public user: UserService,
        public employees: EmployeesService,
    ) {}
}
