"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var bcrypt = require("bcrypt");
var user_entity_1 = require("./entities/user.entity");
var shared_utils_1 = require("./shared.utils");
var UserService = /** @class */ (function () {
    //constructor
    function UserService(userRepository) {
        this.userRepository = userRepository;
    }
    //create first admin account
    UserService.prototype.seedUser = function (userData) {
        return __awaiter(this, void 0, Promise, function () {
            var user, _a, _b, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = this.userRepository.create(__assign({}, userData));
                        _a = user;
                        return [4 /*yield*/, bcrypt.genSalt()];
                    case 1:
                        _a.salt = _c.sent();
                        _b = user;
                        return [4 /*yield*/, bcrypt.hash(user.password, user.salt)];
                    case 2:
                        _b.password = _c.sent();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 4: return [2 /*return*/, _c.sent()];
                    case 5:
                        e_1 = _c.sent();
                        console.log(e_1.message);
                        if (e_1.errno === 1062) {
                            throw new common_1.ConflictException('Le username et le email doivent être unique');
                        }
                        throw new common_1.InternalServerErrorException();
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    //calculate the number of users
    UserService.prototype.usersCount = function () {
        return __awaiter(this, void 0, Promise, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userRepository.count()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw new common_1.InternalServerErrorException("Une erreur est survenue lors de la r\u00E9cup\u00E9ration des utilisateurs: " + error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.updateUser = function (id, updateUserDto, userReq) {
        var _a, _b, _c;
        return __awaiter(this, void 0, Promise, function () {
            var user, hashedPassword, _d, _e, _f, _g, e_2;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (!this.isAdmin(userReq)) {
                            throw new common_1.UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
                        }
                        return [4 /*yield*/, this.getUserById(id)];
                    case 1:
                        user = _h.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('Utilisateur non trouvé.');
                        }
                        if (userReq && this.isAdmin(userReq) && updateUserDto.role) {
                            user.role = updateUserDto.role;
                        }
                        if (!updateUserDto.oldpassword) return [3 /*break*/, 7];
                        return [4 /*yield*/, bcrypt.hash(updateUserDto.oldpassword, user.salt)];
                    case 2:
                        hashedPassword = _h.sent();
                        if (!(hashedPassword === user.password)) return [3 /*break*/, 6];
                        _d = user;
                        return [4 /*yield*/, bcrypt.genSalt()];
                    case 3:
                        _d.salt = _h.sent();
                        _e = user;
                        return [4 /*yield*/, bcrypt.hash(updateUserDto.password, user.salt)];
                    case 4:
                        _e.password = _h.sent();
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 5: return [2 /*return*/, _h.sent()];
                    case 6: throw new common_1.ConflictException('vous avez fourni un ancien mot de passe erroné');
                    case 7:
                        user.username = (_a = updateUserDto.username) !== null && _a !== void 0 ? _a : user.username;
                        user.email = (_b = updateUserDto.email) !== null && _b !== void 0 ? _b : user.email;
                        user.tel = (_c = updateUserDto.tel) !== null && _c !== void 0 ? _c : user.tel;
                        if (!updateUserDto.password) return [3 /*break*/, 10];
                        _f = user;
                        return [4 /*yield*/, bcrypt.genSalt()];
                    case 8:
                        _f.salt = _h.sent();
                        _g = user;
                        return [4 /*yield*/, bcrypt.hash(updateUserDto.password, user.salt)];
                    case 9:
                        _g.password = _h.sent();
                        _h.label = 10;
                    case 10:
                        _h.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 11: return [2 /*return*/, _h.sent()];
                    case 12:
                        e_2 = _h.sent();
                        if (e_2.errno === 1062) {
                            throw new common_1.ConflictException('Le username et le email doivent être unique');
                        }
                        throw new common_1.InternalServerErrorException();
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.findAll = function (userReq, options) {
        if (options === void 0) { options = null; }
        return __awaiter(this, void 0, Promise, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.isAdmin(userReq)) {
                            throw new common_1.UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
                        }
                        if (!options) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.userRepository.find(options)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.userRepository.find()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_2 = _a.sent();
                        throw new common_1.InternalServerErrorException("Une erreur est survenue lors de la r\u00E9cup\u00E9ration des utilisateurs: " + error_2);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUserById = function (idUser) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.createQueryBuilder('user')
                            .where('user.id = :id', { id: idUser })
                            .getOne()];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user || null];
                }
            });
        });
    };
    UserService.prototype.softDeleteUser = function (userReq, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.isAdmin(userReq)) {
                            throw new common_1.UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
                        }
                        return [4 /*yield*/, this.userRepository.softDelete({ id: userId })];
                    case 1:
                        result = _a.sent();
                        if (result.affected === 0) {
                            throw new common_1.NotFoundException("Impossible de trouver l'utilisateur avec l'ID " + userId + ".");
                        }
                        return [2 /*return*/, 'Utilisateur supprimé avec succès'];
                    case 2:
                        error_3 = _a.sent();
                        throw new common_1.InternalServerErrorException("Une erreur est survenue lors de la suppression de l'utilisateur.");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.restoreUser = function (userReq, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var result, restoredUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isAdmin(userReq)) {
                            throw new common_1.UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
                        }
                        return [4 /*yield*/, this.userRepository.restore({ id: userId })];
                    case 1:
                        result = _a.sent();
                        if (result.affected === 0) {
                            throw new common_1.NotFoundException("Impossible de restaurer l'utilisateur avec l'ID " + userId + ".");
                        }
                        return [4 /*yield*/, this.getUserById(userId)];
                    case 2:
                        restoredUser = _a.sent();
                        if (!restoredUser) {
                            throw new common_1.NotFoundException("Impossible de trouver l'utilisateur restaur\u00E9 avec l'ID " + userId + ".");
                        }
                        return [2 /*return*/, restoredUser];
                }
            });
        });
    };
    UserService.prototype.deleteUser = function (userReq, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Vérifier si l'utilisateur est autorisé à effectuer cette action
                        if (!this.isAdmin(userReq)) {
                            throw new common_1.UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
                        }
                        return [4 /*yield*/, this.userRepository["delete"](userId)];
                    case 1:
                        result = _a.sent();
                        // Vérifier si l'utilisateur a été supprimé
                        if (result.affected === 0) {
                            throw new common_1.NotFoundException("Impossible de trouver l'utilisateur avec l'ID " + userId + ".");
                        }
                        return [2 /*return*/, "L'utilisateur a \u00E9t\u00E9 supprim\u00E9e d\u00E9finitivement avec succ\u00E8s."];
                }
            });
        });
    };
    /**
     Ces méthodes sont utilisées pour vérifier si l'utilisateur actuel possède certains privilèges
     ou statut de propriétaire.
     isAdmin détermine si l'utilisateur a des privilèges administratifs, tandis que isOwner vérifie si
     l'utilisateur est le propriétaire d'une ressource spécifique. Ces méthodes sont conçues pour être utilisées dans la logique de contrôle d'accès
     afin de déterminer si un utilisateur doit être autorisé à accéder à certaines fonctionnalités ou données.
    */
    UserService.prototype.isAdmin = function (user) {
        return shared_utils_1.isAdmin(user);
    };
    // Méthode privée pour vérifier si l'utilisateur est bien le propriétaire de l'inspection
    UserService.prototype.isOwner = function (user, objet) {
        return shared_utils_1.isOwner(user, objet);
    };
    UserService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.UserEntity))
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
