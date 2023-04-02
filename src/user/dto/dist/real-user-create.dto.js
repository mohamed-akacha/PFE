"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserRSubscribeDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var user_role_enum_1 = require("src/enums/user-role.enum");
var UserRSubscribeDto = /** @class */ (function () {
    function UserRSubscribeDto() {
    }
    __decorate([
        swagger_1.ApiProperty({
            description: 'The email address of the user',
            format: 'email',
            example: 'john.doe@example.com'
        }),
        class_validator_1.IsEmail(),
        class_validator_1.IsNotEmpty(),
        swagger_1.ApiPropertyOptional()
    ], UserRSubscribeDto.prototype, "email");
    __decorate([
        swagger_1.ApiProperty({
            description: 'The role of the user',
            "enum": user_role_enum_1.UserRoleEnum,
            example: user_role_enum_1.UserRoleEnum.ADMIN
        }),
        class_validator_1.IsOptional(),
        class_validator_1.IsEnum(user_role_enum_1.UserRoleEnum),
        swagger_1.ApiPropertyOptional()
    ], UserRSubscribeDto.prototype, "role");
    return UserRSubscribeDto;
}());
exports.UserRSubscribeDto = UserRSubscribeDto;
