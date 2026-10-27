export interface User {
    id:string;
    name:string;
    email:string;
    
}

export interface AuthResponse {
    accessToken:string
    user:User
}

export interface LoginCredentials {
    email:string
    password:string

}

export interface RegisterCredentials extends LoginCredentials{
    firstName:string
    lastName:string
}