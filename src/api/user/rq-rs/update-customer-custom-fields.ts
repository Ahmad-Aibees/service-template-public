import { ApiProperty } from '@nestjs/swagger';
import { Validator } from '../../../common/validator/validator';

export class ApiUpdateCustomerCustomFieldRq {
    @ApiProperty({ required: false, description: 'account manager id' })
    @Validator({ required: false, title: 'account manager id' })
    accountManagerId: string;

    @ApiProperty({ required: false, description: 'country name' })
    @Validator({ required: false, title: 'country name' })
    countryName: string;

    @ApiProperty({ required: false, description: 'company logo' })
    @Validator({ required: false, title: 'company logo' })
    companyLogo: string;

    @ApiProperty({ required: false, description: 'smartsheet link' })
    @Validator({ required: false, title: 'smartsheet link', check: { smartsheetLink: true } })
    smartsheetLink: string;
}
