import { Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
    @ApiProperty({ description: "Url", nullable: false })
    @Matches(
        /https?:\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%\-\/]))?/,
        { message: 'Invalid URL' })
    url: string;
}
