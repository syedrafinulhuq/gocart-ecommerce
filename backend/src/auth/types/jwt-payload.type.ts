import { Role } from '../../common/constants/roles.enum';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  vendorId?: string | null;
};
