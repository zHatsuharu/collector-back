import { ApiProperty } from "@nestjs/swagger";

export class UpdateCardDto {
    @ApiProperty({ nullable: false })
    code: string;

    @ApiProperty({ nullable: false })
    quantity: number;
}
