import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
      },
      {
        path: 'inventario/nuevo',
        loadComponent: () =>
          import('./features/inventario/nuevo/nuevo.component').then((m) => m.NuevoComponent),
      },
      {
        path: 'inventario/historico',
        loadComponent: () =>
          import('./features/inventario/historico/historico.component').then((m) => m.HistoricoComponent),
      },
      {
        path: 'inventario/plantillas',
        loadComponent: () =>
          import('./features/inventario/plantillas/plantillas.component').then((m) => m.PlantillasComponent),
      },
      {
        path: 'eventos/ingreso',
        loadComponent: () =>
          import('./features/eventos/ingreso/ingreso.component').then((m) => m.IngresoComponent),
      },
      {
        path: 'eventos/evaluacion',
        loadComponent: () =>
          import('./features/eventos/evaluacion/evaluacion.component').then((m) => m.EvaluacionComponent),
      },
      {
        path: 'eventos/configuracion',
        loadComponent: () =>
          import('./features/eventos/configuracion/configuracion.component').then((m) => m.ConfiguracionComponent),
      },
      {
        path: 'recursos-humanos/equipo',
        loadComponent: () =>
          import('./features/recursos-humanos/equipo/equipo.component').then((m) => m.EquipoComponent),
      },
      {
        path: 'recursos-humanos/contratos',
        loadComponent: () =>
          import('./features/recursos-humanos/contratos/contratos.component').then((m) => m.ContratosComponent),
      },
      {
        path: 'recursos-humanos/asistencia',
        loadComponent: () =>
          import('./features/recursos-humanos/asistencia/asistencia.component').then((m) => m.AsistenciaComponent),
      },
      {
        path: 'recursos-humanos/permisos',
        loadComponent: () =>
          import('./features/recursos-humanos/permisos/permisos.component').then((m) => m.PermisosComponent),
      },
      {
        path: 'recursos-humanos/horarios',
        loadComponent: () =>
          import('./features/recursos-humanos/horarios/horarios.component').then((m) => m.HorariosComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
