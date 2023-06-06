import { UserRoles } from "../../../database/postgres/entity/user.entity";

export interface AuthSignUpRequest {

    firstName: string;
    lastName: string;
    displayName: string
    phoneNumber: string;
    email: string;
    password: string
}

export interface AuthResponse {
    displayName: string;
    role: string;
}

export interface AuthSignInRequest{
    username: string;
    password: string;
}

export interface AuthRefreshTokensRequest{
    userName: string;
    refresh_token: string;
}