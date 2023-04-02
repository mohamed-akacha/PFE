import { UserRoleEnum } from "src/enums/user-role.enum";
import { UserEntity } from "./entities/user.entity";


export const isAdmin=(user: UserEntity): boolean=> {
    return user.role === UserRoleEnum.ADMIN;
}
// Méthode privée pour vérifier si l'utilisateur est bien le propriétaire de l'inspection
export const isOwner=(user: UserEntity, objet): boolean =>{
    return (objet.user && objet.user.id === user.id);
}
