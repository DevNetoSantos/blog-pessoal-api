import { RolesBuilder } from "nest-access-control";

export enum UserRoles {
  Admin = 'Admin',
  User = 'User'
}

export const roles: RolesBuilder = new RolesBuilder();

roles.grant(UserRoles.User)
  .readAny(['post'])
  .grant(UserRoles.Admin)
  .extend(UserRoles.User)
  .updateAny(['post'])
  .createAny(['post'])
  .deleteAny(['post'])
  