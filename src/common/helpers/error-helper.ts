import {
    BadRequestException,
    ConflictException,
    ForbiddenException, InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

export class ErrorHelper {
    /**
     * Raises error 400. Use this for validation errors
     * @param error
     */
    public static badRequest(error: unknown | unknown[]): null {
        throw new BadRequestException(error);
    }

    /**
     * Raises error 404. Use this when the resource(s) are not available
     * @param error
     */
    public static notFound(error: unknown | unknown[]): null {
        throw new NotFoundException(error);
    }

    /**
     * Raises error 409. Use this when you see a conflict in data integration
     * @param error
     */
    public static conflict(error: unknown | unknown[]): null {
        throw new ConflictException(error);
    }

    /**
     * Raises error 401. Use this only when user credentials are wrong and you suspect harm to server
     * @param error
     */
    public static unauthorized(error: unknown | unknown[]): null {
        throw new UnauthorizedException(error);
    }

    /**
     * Raises error 403. Use this in guards
     * @param error
     */
    public static forbidden(error: unknown | unknown[]): null {
        throw new ForbiddenException(error);
    }

    /**
     * Raises error 406. Use when value be not acceptable
     * @param error
     */
    public static notAcceptable(error: unknown | unknown[]): null {
        throw new NotAcceptableException(error);
    }

    public static createMsError(error: { statusCode: number, error: string, message: string }): Error {
        const message = error.error ?? error.message ?? 'something_went_wrong';
        switch (error.statusCode) {
            case 400:
                return new BadRequestException(message);
            case 404:
                return new NotFoundException(message);
            case 409:
                return new ConflictException(message);
            default:
                return new InternalServerErrorException(message);
        }
    }
}
