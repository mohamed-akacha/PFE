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
exports.LoginCredentialsDto = void 0;

var swagger_1 = require("@nestjs/swagger");

var class_validator_1 = require("class-validator");

var LoginCredentialsDto =
/** @class */
function () {
  function LoginCredentialsDto() {}

  __decorate([swagger_1.ApiProperty({
    description: 'The email of the user',
    format: 'email',
    minLength: 5,
    maxLength: 255,
    example: 'user@example.com'
  }), class_validator_1.IsNotEmpty(), class_validator_1.IsEmail()], LoginCredentialsDto.prototype, "email");

  __decorate([swagger_1.ApiProperty({
    description: 'The password of the user',
    minLength: 8,
    maxLength: 20,
    example: 'password123'
  }), class_validator_1.IsNotEmpty()], LoginCredentialsDto.prototype, "password");

  return LoginCredentialsDto;
}();

exports.LoginCredentialsDto = LoginCredentialsDto;