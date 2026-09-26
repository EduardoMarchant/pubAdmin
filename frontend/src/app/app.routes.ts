import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permisoGuard } from './core/guards/permiso.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'roles-usuarios/usuarios',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/roles-usuarios/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
      },
      {
        path: 'roles-usuarios/roles',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/roles-usuarios/roles/roles.component').then((m) => m.RolesComponent),
      },
      {
        path: 'inventario/nuevo',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/inventario/nuevo/nuevo.component').then((m) => m.NuevoComponent),
      },
      {
        path: 'inventario/historico',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/inventario/historico/historico.component').then((m) => m.HistoricoComponent),
      },
      {
        path: 'inventario/plantillas',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/inventario/plantillas/plantillas.component').then((m) => m.PlantillasComponent),
      },
      {
        path: 'eventos/ingreso',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/eventos/ingreso/ingreso.component').then((m) => m.IngresoComponent),
      },
      {
        path: 'eventos/evaluacion',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/eventos/evaluacion/evaluacion.component').then((m) => m.EvaluacionComponent),
      },
      {
        path: 'eventos/configuracion',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/eventos/configuracion/configuracion.component').then((m) => m.ConfiguracionComponent),
      },
      {
        path: 'recursos-humanos/equipo',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/recursos-humanos/equipo/equipo.component').then((m) => m.EquipoComponent),
      },
      {
        path: 'recursos-humanos/contratos',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/recursos-humanos/contratos/contratos.component').then((m) => m.ContratosComponent),
      },
      {
        path: 'recursos-humanos/asistencia',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/recursos-humanos/asistencia/asistencia.component').then((m) => m.AsistenciaComponent),
      },
      {
        path: 'recursos-humanos/permisos',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/recursos-humanos/permisos/permisos.component').then((m) => m.PermisosComponent),
      },
      {
        path: 'recursos-humanos/horarios',
        canActivate: [permisoGuard],
        loadComponent: () =>
          import('./features/recursos-humanos/horarios/horarios.component').then((m) => m.HorariosComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
