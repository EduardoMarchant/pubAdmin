import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ESTRUCTURA_MENU } from '../../core/menu-estructura';
import { AuthService } from '../../core/services/auth.service';
import { PermisosService } from '../../core/services/permisos.service';

interface MenuLink {
  label: string;
  path: string;
}

interface MenuItem {
  label: string;
  path?: string;
  children?: MenuLink[];
  icon?: 'box' | 'calendar' | 'people' | 'shield';
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly permisosService = inject(PermisosService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;

  private readonly menuItemsCompletos: MenuItem[] = ESTRUCTURA_MENU.map((grupo) => ({
    label: grupo.etiqueta,
    icon: grupo.icon,
    children: grupo.hijos.map((hijo) => ({ label: hijo.etiqueta, path: hijo.path })),
  }));

  readonly menuItems = computed<MenuItem[]>(() => {
    const rol = this.currentUser()?.rol;
    const clavesPorLabel = new Map(ESTRUCTURA_MENU.map((g) => [g.etiqueta, g]));

    return this.menuItemsCompletos
      .filter((item) => this.permisosService.estaHabilitado(clavesPorLabel.get(item.label)!.clave, rol))
      .map((item) => {
        const grupo = clavesPorLabel.get(item.label)!;
        return {
          ...item,
          children: item.children?.filter((_, i) =>
            this.permisosService.estaHabilitado(grupo.hijos[i].clave, rol),
          ),
        };
      });
  });

  private readonly expandedMenus = signal<Set<string>>(
    new Set(
      this.menuItemsCompletos
        .filter((item) => item.children?.some((child) => this.router.url.startsWith(child.path)))
        .map((item) => item.label),
    ),
  );

  ngOnInit(): void {
    const rol = this.currentUser()?.rol;
    if (rol) {
      this.permisosService.cargar(rol).subscribe();
    }
  }

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
