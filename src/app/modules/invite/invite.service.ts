import { Injectable } from '@angular/core';
import { EmployeesService, UserAuthService, UserService } from '@api';
@Injectable()
export class InviteService {
  constructor(public user: UserService, public userAuth: UserAuthService, public employee: EmployeesService) {};
}
