import { UserRoles } from "../enums/user.enum";

export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    displayName: string;
    userRole: UserRoles;
    email: string;
    phoneNumber: string;
}
