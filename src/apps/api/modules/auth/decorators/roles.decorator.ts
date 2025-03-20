import { SetMetadata } from '@nestjs/common';
import { EUserRoles } from '../../users/types';
import { EMetadataKeys } from 'src/common/types/metadata-keys.enum';

export const UseRoles = (roles: EUserRoles[]) =>
  SetMetadata(EMetadataKeys.ROLES, roles);
