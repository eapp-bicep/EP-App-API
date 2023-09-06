import { Prisma } from '@prisma/client';
import { CloudinaryService } from 'src/dynamic-modules/cloudinary';

// export function PersonalProfileMiddleware<
//   T extends Prisma.BatchPayload = Prisma.BatchPayload,
// >(): Prisma.Middleware {
//   return async (
//     params: Prisma.MiddlewareParams,
//     next: (params: Prisma.MiddlewareParams) => Promise<T>,
//     cloudinary: CloudinaryService,
//   ): Promise<T> => {
   
//     if(params.model === "PersonalInfo") {
//       if (params.action === 'delete') {
//         params.args['']
//       }
//     }
//     return next(params);
//   };
// }
