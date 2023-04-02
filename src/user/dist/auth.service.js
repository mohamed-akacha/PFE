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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("./entities/user.entity");
var bcrypt = require("bcrypt");
var shared_utils_1 = require("./shared.utils");
var AuthService = /** @class */ (function () {
    //constructor
    function AuthService(userRepository, jwtService, mailService, userService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.userService = userService;
    }
    //authentification
    AuthService.prototype.login = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, user, hashedPassword, payload, jwt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = credentials.email, password = credentials.password;
                        return [4 /*yield*/, this.userRepository
                                .createQueryBuilder("user")
                                .where("user.email = :email", { email: email })
                                .getOne()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.NotFoundException('Compte inexistant.');
                        return [4 /*yield*/, bcrypt.hash(password, user.salt)];
                    case 2:
                        hashedPassword = _a.sent();
                        if (!(hashedPassword === user.password)) return [3 /*break*/, 4];
                        payload = {
                            username: user.username,
                            email: user.email,
                            role: user.role
                        };
                        return [4 /*yield*/, this.jwtService.sign(payload)];
                    case 3:
                        jwt = _a.sent();
                        return [2 /*return*/, { "access_token": jwt }];
                    case 4: throw new common_1.NotFoundException('Mot de passe incorrect.');
                }
            });
        });
    };
    //Creation d'un utilisateur
    AuthService.prototype.createUser = function (userReq, userData) {
        return __awaiter(this, void 0, Promise, function () {
            var user, savedUser, saltRounds, userId, salt, hash, hashedId, hash_userId, encodedHash_userId, newUrl, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!shared_utils_1.isAdmin(userReq)) {
                            throw new common_1.UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
                        }
                        user = this.userRepository.create(__assign({}, userData));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        savedUser = _a.sent();
                        saltRounds = 10;
                        userId = savedUser.id.toString();
                        return [4 /*yield*/, bcrypt.genSalt(saltRounds)];
                    case 3:
                        salt = _a.sent();
                        return [4 /*yield*/, bcrypt.hash(userId, salt)];
                    case 4:
                        hash = _a.sent();
                        hashedId = hash.slice(7);
                        hash_userId = hashedId + "_" + userId;
                        encodedHash_userId = encodeURIComponent(hash_userId);
                        newUrl = "http://localhost:3000/auth/confirm/" + encodedHash_userId;
                        // Send email to the savedUser's email (via gmail.com)
                        return [4 /*yield*/, this.mailService.sendConfirmationEmail(savedUser.email, "New user", newUrl)];
                    case 5:
                        // Send email to the savedUser's email (via gmail.com)
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.log(e_1.message);
                        if (e_1.errno === 1062) {
                            throw new common_1.ConflictException('Le username et le email doivent être unique');
                        }
                        throw new common_1.InternalServerErrorException();
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Confirmation d'un compte
    AuthService.prototype.confirmAccount = function (id, updateUserDto) {
        return __awaiter(this, void 0, Promise, function () {
            var user, _a, _b, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserById(id)];
                    case 1:
                        user = _c.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('Utilisateur non trouvé.');
                        }
                        if (user.username || user.username.trim() == "") {
                            throw new common_1.NotFoundException('Compte déjà confirmé.');
                        }
                        user.username = updateUserDto.username;
                        user.role = user.role;
                        user.email = user.email;
                        user.tel = updateUserDto.tel;
                        _a = user;
                        return [4 /*yield*/, bcrypt.genSalt()];
                    case 2:
                        _a.salt = _c.sent();
                        _b = user;
                        return [4 /*yield*/, bcrypt.hash(updateUserDto.password, user.salt)];
                    case 3:
                        _b.password = _c.sent();
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6:
                        e_2 = _c.sent();
                        if (e_2.errno === 1062) {
                            throw new common_1.ConflictException('Le username et le email doivent être unique');
                        }
                        throw new common_1.InternalServerErrorException();
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuthService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.UserEntity))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
