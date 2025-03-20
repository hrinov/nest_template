import { TTokensPair } from '../../tokens/types/tokens';
import { UserEntity } from '../../users/entities/user.entity';

export type TAuthResult = { tokens: TTokensPair; user: UserEntity };
