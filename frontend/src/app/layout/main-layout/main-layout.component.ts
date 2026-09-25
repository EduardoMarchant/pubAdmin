import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface MenuLink {
  label: string;
  path: string;
}

interface MenuItem {
  label: string;
  path?: string;
  children?: MenuLink[];
  icon?: 'box' | 'calendar' | 'people';
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;

  readonly menuItems: MenuItem[] = [
    { label: 'Usuarios', path: '/usuarios' },
    {
      label: 'Inventario',
      icon: 'box',
      children: [
        { label: 'Nuevo inventario', path: '/inventario/nuevo' },
        { label: 'Histórico', path: '/inventario/historico' },
        { label: 'Plantillas', path: '/inventario/plantillas' },
      ],
    },
    {
      label: 'Eventos',
      icon: 'calendar',
      children: [
        { label: 'Ingreso de eventos', path: '/eventos/ingreso' },
        { label: 'Evaluación', path: '/eventos/evaluacion' },
        { label: 'Configuración', path: '/eventos/configuracion' },
      ],
    },
    {
      label: 'Recursos Humanos',
      icon: 'people',
      children: [
        { label: 'Contratos', path: '/recursos-humanos/contratos' },
        { label: 'Asistencia', path: '/recursos-humanos/asistencia' },
        { label: 'Permisos', path: '/recursos-humanos/permisos' },
        { label: 'Horarios', path: '/recursos-humanos/horarios' },
        { label: 'Configuración equipo', path: '/recursos-humanos/equipo' },
      ],
    },
  ];

  private readonly expandedMenus = signal<Set<string>>(
    new Set(
      this.menuItems
        .filter((item) => item.children?.some((child) => this.router.url.startsWith(child.path)))
        .map((item) => item.label),
    ),
  );

  toggleMenu(label: string): void {
    const next = new Set(this.expandedMenus());
    if (next.has(label)) {
      next.delete(label);
    } else {
      next.add(label);
    }
    this.expandedMenus.set(next);
  }

  isExpanded(label: string): boolean {
    return this.expandedMenus().has(label);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
