"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var user_module_1 = require("./user/user.module");
var inspection_module_1 = require("./inspection/inspection.module");
var evaluation_point_module_1 = require("./evaluation-point/evaluation-point.module");
var evaluation_module_1 = require("./evaluation/evaluation.module");
var config_1 = require("@nestjs/config");
var user_entity_1 = require("./user/entities/user.entity");
var inspection_entity_1 = require("./inspection/entites/inspection.entity");
var evaluation_point_entity_1 = require("./evaluation-point/entities/evaluation-point.entity");
var evaluation_entity_1 = require("./evaluation/entities/evaluation.entity");
var inspection_unit_module_1 = require("./inspection-unit/inspection-unit.module");
var inspection_unit_entity_1 = require("./inspection-unit/entities/inspection-unit.entity");
var institution_module_1 = require("./institution/institution.module");
var bloc_module_1 = require("./bloc/bloc.module");
var institution_entity_1 = require("./institution/entities/institution.entity");
var bloc_entity_1 = require("./bloc/entities/bloc.entity");
var admin_seed_1 = require("./admin.seed");
var zone_entity_1 = require("./zone/entities/zone.entity");
var zone_module_1 = require("./zone/zone.module");
var sous_traitant_module_1 = require("./sous-traitant/sous-traitant.module");
var contrat_module_1 = require("./contrat/contrat.module");
var sous_traitant_entity_1 = require("./sous-traitant/entities/sous-traitant.entity");
var contrat_entity_1 = require("./contrat/entities/contrat.entity");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env'
                }),
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    autoLoadEntities: true,
                    entities: [user_entity_1.UserEntity, inspection_entity_1.InspectionEntity, evaluation_point_entity_1.EvaluationPointEntity,
                        evaluation_entity_1.EvaluationEntity, inspection_unit_entity_1.InspectionUnitEntity, institution_entity_1.InstitutionEntity, bloc_entity_1.BlocEntity, zone_entity_1.ZoneEntity, sous_traitant_entity_1.SousTraitantEntity, contrat_entity_1.Contrat],
                    //__dirname + '/**/*.entity{.ts,.js}'
                    synchronize: true,
                    debug: false
                }),
                user_module_1.UserModule,
                inspection_module_1.InspectionModule,
                evaluation_point_module_1.EvaluationPointModule,
                evaluation_module_1.EvaluationModule,
                inspection_unit_module_1.InspectionUnitModule,
                institution_module_1.InstitutionModule,
                bloc_module_1.BlocModule,
                zone_module_1.ZoneModule,
                sous_traitant_module_1.SousTraitantModule,
                contrat_module_1.ContratModule
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService, admin_seed_1.AdminSeed]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
