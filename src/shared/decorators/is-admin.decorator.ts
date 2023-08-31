import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards';

export const IsAdmin = () => UseGuards(AdminGuard);
