"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.UserSubscribeDto = void 0;

var swagger_1 = require("@nestjs/swagger");

var class_validator_1 = require("class-validator");

var user_role_enum_1 = require("src/enums/user-role.enum");

var UserSubscribeDto =
/** @class */
function () {
  function UserSubscribeDto() {}

  __decorate([swagger_1.ApiProperty({
    description: 'The username of the user',
    minLength: 8,
    maxLength: 20,
    example: 'Mohamed Akacha'
  }), class_validator_1.IsOptional(), class_validator_1.IsString(), swagger_1.ApiPropertyOptional()], UserSubscribeDto.prototype, "username");

  __decorate([swagger_1.ApiProperty({
    description: 'The email address of the user',
    format: 'email',
    example: 'john.doe@example.com'
  }), class_validator_1.IsEmail(), class_validator_1.IsNotEmpty(), swagger_1.ApiPropertyOptional()], UserSubscribeDto.prototype, "email");

  __decorate([swagger_1.ApiProperty({
    description: 'The telephone number of the user',
    minLength: 10,
    maxLength: 20,
    example: '+1-541-754-3010'
  }), class_validator_1.IsString() //@IsPhoneNumber()
  , class_validator_1.IsOptional(), swagger_1.ApiPropertyOptional()], UserSubscribeDto.prototype, "tel");

  __decorate([swagger_1.ApiProperty({
    description: 'The role of the user',
    "enum": user_role_enum_1.UserRoleEnum,
    example: user_role_enum_1.UserRoleEnum.ADMIN
  }), class_validator_1.IsOptional(), class_validator_1.IsEnum(user_role_enum_1.UserRoleEnum), swagger_1.ApiPropertyOptional()], UserSubscribeDto.prototype, "role");

  __decorate([swagger_1.ApiProperty({
    description: 'The password of the user',
    minLength: 8,
    maxLength: 20,
    example: 'Abcd1234!'
  }), class_validator_1.IsString(), class_validator_1.IsOptional(), swagger_1.ApiPropertyOptional()], UserSubscribeDto.prototype, "password");

  return UserSubscribeDto;
}();

exports.UserSubscribeDto = UserSubscribeDto;