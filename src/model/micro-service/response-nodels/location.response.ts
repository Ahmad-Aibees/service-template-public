import {ApiProperty} from "@nestjs/swagger";

export class ApiStateListRs {
    @ApiProperty()
    english: string;

    @ApiProperty()
    persian: string;

    @ApiProperty()
    id: string;

    constructor(input: {[key: string]: any}) {
        this.english = input.english;
        this.persian = input.persian;
        this.id = input.id;
    }
}

export class ApiCityListRs {
    @ApiProperty()
    english: string;

    @ApiProperty()
    persian: string;

    @ApiProperty()
    id: string;

    @ApiProperty({ type: ApiStateListRs })
    state: ApiStateListRs;

    @ApiProperty()
    areaCodes: number[];

    @ApiProperty()
    default: boolean;

    constructor(input: {[key: string]: any}) {
        this.english = input.english;
        this.persian = input.persian;
        this.id = input.id;
        this.state = new ApiStateListRs(input.state);
        this.areaCodes = input.areaCodes;
        this.default = input.default;
    }
}
