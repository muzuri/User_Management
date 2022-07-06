import { IsEmail, IsEnum, IsNotEmpty, IsNumber, isString, IsString, MinLength} from "class-validator"
export class UserDto{

   first_name: string
   @IsString()
   last_name: string

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @MinLength(4, {
      message: 'Password is too short',
    })
    password: string

    @IsNotEmpty()
    @IsString()
    gender: string

    @IsNotEmpty()
    @IsNumber()
    age: number

    @IsNotEmpty()
    martalStatus: string

    emailToken: string

    isEmailVerified: boolean

    @IsNotEmpty()
    @IsString()
    nationality: string

    nationalIdNumber: string
    profile_image: string
    doc_image: string
    passwordToken: string
    accountStatus: string
    birthDate: Date
}