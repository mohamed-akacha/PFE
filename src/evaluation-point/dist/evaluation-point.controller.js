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
exports.EvaluationPointController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var roles_decorator_1 = require("src/decorators/roles.decorator");
var user_decorator_1 = require("src/decorators/user.decorator");
var jwt_auth_guard_1 = require("src/user/guards/jwt-auth.guard");
var r_les_guard_1 = require("src/user/guards/r\u00F4les.guard");
var EvaluationPointController = /** @class */ (function () {
    function EvaluationPointController(evaluationPointService) {
        this.evaluationPointService = evaluationPointService;
    }
    EvaluationPointController.prototype.createEvaluationPoint = function (user, addEvaluationPointDto) {
        return __awaiter(this, void 0, Promise, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.evaluationPointService.createEvaluationPoint(user, addEvaluationPointDto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        if (error_1 instanceof common_1.UnauthorizedException) {
                            throw error_1;
                        }
                        throw new common_1.NotFoundException(error_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EvaluationPointController.prototype.getAllEvaluationPoints = function () {
        return __awaiter(this, void 0, Promise, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.evaluationPointService.getAllEvaluationPoints()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        if (error_2 instanceof common_1.UnauthorizedException) {
                            throw error_2;
                        }
                        throw new common_1.NotFoundException(error_2.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EvaluationPointController.prototype.getEvaluationPointById = function (id, user) {
        return __awaiter(this, void 0, Promise, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.evaluationPointService.getEvaluationPointById(id, user)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        if (error_3 instanceof common_1.UnauthorizedException) {
                            throw error_3;
                        }
                        throw new common_1.NotFoundException(error_3.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EvaluationPointController.prototype.updateEvaluationPoint = function (user, id, updateEvaluationPointDto) {
        return __awaiter(this, void 0, Promise, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.evaluationPointService.updateEvaluationPoint(user, id, updateEvaluationPointDto)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4 instanceof common_1.UnauthorizedException) {
                            throw error_4;
                        }
                        throw new common_1.NotFoundException(error_4.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EvaluationPointController.prototype.softDeleteEvaluationPoint = function (user, evaluationPointId) {
        return __awaiter(this, void 0, Promise, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.evaluationPointService.softDeleteEvaluationPoint(user, evaluationPointId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5 instanceof common_1.UnauthorizedException) {
                            throw error_5;
                        }
                        throw new common_1.NotFoundException(error_5.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EvaluationPointController.prototype.restoreEvaluationPoint = function (user, evaluationPointId) {
        return __awaiter(this, void 0, Promise, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.evaluationPointService.restoreEvaluationPoint(user, evaluationPointId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        if (error_6 instanceof common_1.UnauthorizedException) {
                            throw error_6;
                        }
                        throw new common_1.NotFoundException(error_6.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EvaluationPointController.prototype.deleteEvaluationPoint = function (user, evaluationPointId) {
        return __awaiter(this, void 0, Promise, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.evaluationPointService.deleteEvaluationPoint(user, evaluationPointId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        if (error_7 instanceof common_1.UnauthorizedException) {
                            throw error_7;
                        }
                        throw new common_1.NotFoundException(error_7.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.Post(),
        roles_decorator_1.Roles('admin'),
        __param(0, user_decorator_1.User()),
        __param(1, common_1.Body())
    ], EvaluationPointController.prototype, "createEvaluationPoint");
    __decorate([
        common_1.Get(),
        roles_decorator_1.Roles('admin', 'user')
    ], EvaluationPointController.prototype, "getAllEvaluationPoints");
    __decorate([
        common_1.Get(':id'),
        roles_decorator_1.Roles('admin', 'user'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe)), __param(1, user_decorator_1.User())
    ], EvaluationPointController.prototype, "getEvaluationPointById");
    __decorate([
        common_1.Put(':id'),
        roles_decorator_1.Roles('admin'),
        __param(0, user_decorator_1.User()),
        __param(1, common_1.Param('id', common_1.ParseIntPipe)),
        __param(2, common_1.Body())
    ], EvaluationPointController.prototype, "updateEvaluationPoint");
    __decorate([
        common_1.Delete(':id'),
        roles_decorator_1.Roles('admin'),
        __param(0, user_decorator_1.User()), __param(1, common_1.Param('id', common_1.ParseIntPipe))
    ], EvaluationPointController.prototype, "softDeleteEvaluationPoint");
    __decorate([
        common_1.Put('restore/:id'),
        roles_decorator_1.Roles('admin'),
        __param(0, user_decorator_1.User()), __param(1, common_1.Param('id', common_1.ParseIntPipe))
    ], EvaluationPointController.prototype, "restoreEvaluationPoint");
    __decorate([
        common_1.Delete('force/:id'),
        roles_decorator_1.Roles('admin'),
        __param(0, user_decorator_1.User()), __param(1, common_1.Param('id', common_1.ParseIntPipe))
    ], EvaluationPointController.prototype, "deleteEvaluationPoint");
    EvaluationPointController = __decorate([
        swagger_1.ApiTags("Points d'evaluation"),
        swagger_1.ApiBearerAuth(),
        common_1.Controller('evaluation-points'),
        common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, r_les_guard_1.RoleGuard)
    ], EvaluationPointController);
    return EvaluationPointController;
}());
exports.EvaluationPointController = EvaluationPointController;
