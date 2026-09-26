import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { clavePorPath } from '../menu-estructura';
import { AuthService } from '../services/auth.service';
import { PermisosService } from '../services/permisos.service';

export const permisoGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const permisosService = inject(PermisosService);
  const router = inject(Router);

  const clave = clavePorPath(state.url.split('?')[0]);
  if (!clave) {
    return true;
  }

  const rol = authService.currentUser()?.rol;
  if (!rol) {
    return router.createUrlTree(['/login']);
  }

  return permisosService.cargar(rol).pipe(
    map(() => {
      if (permisosService.estaHabilitado(clave, rol)) {
        return true;
      }
      return router.createUrlTree(['/dashboard']);
    }),
  );
};
