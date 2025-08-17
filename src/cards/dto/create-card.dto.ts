import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {
    @ApiProperty({ nullable: false })
    code: string;

    @ApiProperty({ nullable: false })
    type: string;

    @ApiProperty({ nullable: false })
    quantity: number;
}
