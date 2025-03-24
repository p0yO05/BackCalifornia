import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RoleGuardGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; //  usuario disponible?

    // Verifica si el usuario tiene un rol permitido
    if (!user || user.role !== 'Dictador') {
      throw new UnauthorizedException('Access denied: Buen Intento Esclavo');
    }

    return true; // Acceso permitido solo si el rol es válido
  }
}