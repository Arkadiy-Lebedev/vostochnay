
export interface ILoginUser {
    phone: string,
    password: string | null
}

export interface IbaseUser {
    phone: string,
    name: string,
    surname: string,
    family: string,    
    street:'',
    house: number | null
}

export interface IUserLogin extends IbaseUser {
    password: string | null,
    repeatPassword: string | null,
    startCount: number | null,
}

export interface IUser extends IbaseUser {
    role: string,
}