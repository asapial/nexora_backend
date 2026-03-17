export interface IRegisterData {
    name: string;
    email: string;
    password: string;
    image?: string;
    callbackURL?: string;
}


export interface ILoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
    callbackURL?: string;
}