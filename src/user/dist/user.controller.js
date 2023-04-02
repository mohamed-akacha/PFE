"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UserController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
var r_les_guard_1 = require("./guards/r\u00F4les.guard");
var roles_decorator_1 = require("src/decorators/roles.decorator");
var user_decorator_1 = require("src/decorators/user.decorator");
var swagger_1 = require("@nestjs/swagger");
var UserController = /** @class */ (function () {
    function UserController(userService) {
        this.userService = userService;
    }
    //afficher tous les utilisateurs
    UserController.prototype.findAll = function (userReq) {
        return __awaiter(this, void 0, Promise, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.findAll(userReq)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: 'Une erreur est survenue lors de la récupération des utilisateurs.'
                        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //afficher tous les utilisateurs
    UserController.prototype.findById = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.getUserById(userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        throw new common_1.HttpException({
                            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                            error: "Une erreur est survenue lors de la récupération de l'utilisateur."
                        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //modification
    UserController.prototype.updateUser = function (userReq, userData, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.updateUser(userId, userData, userReq)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        throw new common_1.InternalServerErrorException('Erreur lors de la modification de l\'utilisateur.', error_3.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //désactivation d'un utilisateur(soft delete)
    UserController.prototype.softDeleteUser = function (userReq, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.softDeleteUser(userReq, userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4 instanceof common_1.HttpException) {
                            throw error_4;
                        }
                        else {
                            throw new common_1.InternalServerErrorException("Une erreur est survenue lors de la suppression de l'utilisateur.");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //récupération d'un utilisateur désactivé (soft delete)
    UserController.prototype.restoreUser = function (userReq, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.restoreUser(userReq, userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5 instanceof common_1.HttpException) {
                            throw error_5;
                        }
                        throw new common_1.InternalServerErrorException('Une erreur est survenue lors de la restauration de l\'utilisateur.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //suppression définitive d'un utilisateur
    UserController.prototype.deleteUser = function (userReq, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.deleteUser(userReq, userId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        if (error_6 instanceof common_1.HttpException) {
                            throw error_6;
                        }
                        throw new common_1.InternalServerErrorException('Une erreur est survenue lors de la suppression de l\'utilisateur.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.Get(''),
        swagger_1.ApiOperation({ summary: 'Liste de tous les utilisateur, saufs les soft deleted' }),
        roles_decorator_1.Roles('admin'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, r_les_guard_1.RoleGuard),
        __param(0, user_decorator_1.User())
    ], UserController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        swagger_1.ApiOperation({ summary: 'Trouver un utilisateur par son ID' }),
        roles_decorator_1.Roles('admin', 'user'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, r_les_guard_1.RoleGuard),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], UserController.prototype, "findById");
    __decorate([
        common_1.Put(':id'),
        swagger_1.ApiOperation({ summary: 'Modifier un utilisateur' }),
        roles_decorator_1.Roles('admin', 'user'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, r_les_guard_1.RoleGuard),
        __param(0, user_decorator_1.User()), __param(1, common_1.Body()),
        __param(2, common_1.Param('id', common_1.ParseIntPipe))
    ], UserController.prototype, "updateUser");
    __decorate([
        roles_decorator_1.Roles('admin'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, r_les_guard_1.RoleGuard),
        common_1.Patch('softdelete/:id'),
        swagger_1.ApiOperation({ summary: 'Désactiver un utilisateur, (soft delete)' }),
        __param(0, user_decorator_1.User()),
        __param(1, common_1.Param('id', common_1.ParseIntPipe))
    ], UserController.prototype, "softDeleteUser");
    __decorate([
        common_1.Patch('restore/:id'),
        swagger_1.ApiOperation({ summary: 'Activer un utilisateur' }),
        roles_decorator_1.Roles('admin'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, r_les_guard_1.RoleGuard),
        __param(0, user_decorator_1.User()), __param(1, common_1.Param('id', common_1.ParseIntPipe))
    ], UserController.prototype, "restoreUser");
    __decorate([
        common_1.Delete(':id'),
        swagger_1.ApiOperation({ summary: 'Suppression définitive d\'un utilisateur' }),
        roles_decorator_1.Roles('admin'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, r_les_guard_1.RoleGuard),
        __param(0, user_decorator_1.User()),
        __param(1, common_1.Param('id', common_1.ParseIntPipe))
    ], UserController.prototype, "deleteUser");
    UserController = __decorate([
        swagger_1.ApiTags("Users"),
        swagger_1.ApiBearerAuth(),
        common_1.Controller('users'),
        common_1.UseInterceptors(common_1.ClassSerializerInterceptor)
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
