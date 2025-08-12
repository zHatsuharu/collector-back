import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ nullable: false })
    username: string;

    @ApiProperty({ nullable: false, uniqueItems: true })
    @IsEmail()
    email: string;

    @ApiProperty({ nullable: false })
    password: string;

    @ApiProperty({ nullable: false })
    confirmPassword: string;

    @ApiProperty({ nullable: true, default: false })
    entreprise: boolean;
}
