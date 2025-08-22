import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {
    @ApiProperty({ nullable: false })
    code: string;

    @ApiProperty({ nullable: false })
    name: string;

    @ApiProperty({ nullable: false })
    type: string;

    @ApiProperty({ nullable: false })
    quantity: number;

    @ApiProperty({ nullable: false })
    image: string;
}
