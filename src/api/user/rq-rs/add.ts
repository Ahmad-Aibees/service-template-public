import { ApiProperty } from '@nestjs/swagger';

export class ApiAddUserRs {
    @ApiProperty({ required: false, description: 'id' })
    id: string;
}
