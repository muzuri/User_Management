import { IsEmail, IsEnum, IsNotEmpty, IsNumber, isString, IsString, MinLength} from "class-validator"


export enum AllowedMartalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export enum AccountStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED'
}
export class CreateUserDto{
   
   @IsNotEmpty()
   @IsString()
   first_name: string
   @IsString()
   last_name: string

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    // @MinLength(4, {
    //   message: 'Password is too short',
    // })
    password: string

    @IsNotEmpty()
    @IsString()
    gender: string

    @IsNotEmpty()
    @IsNumber()
    age: number

    //@IsNotEmpty()
    //@IsEnum(AllowedMartalStatus)
    martalStatus: string

    emailToken: string

    isEmailVerified: boolean

    @IsNotEmpty()
    @IsString()
    nationality: string

    profile_image: string
    doc_image: string
    passwordToken: string
    // @IsEnum(AccountStatus)
    accountStatus: string
    birthDate: Date
 

}
