import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario, UsuariosService } from './usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly fb = inject(FormBuilder);

  readonly roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'GARZON', label: 'Garzón' },
    { value: 'CAJERO', label: 'Cajero' },
    { value: 'COCINERO', label: 'Cocinero' },
    { value: 'BARTENDER', label: 'Bartender' },
    { value: 'ADMINISTRATIVO', label: 'Administrativo' },
  ];

  readonly usuarios = signal<Usuario[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly modalOpen = signal(false);
  readonly editingUsuario = signal<Usuario | null>(null);
  readonly submitting = signal(false);
  readonly formError = signal<string | null>(null);
  readonly deletingId = signal<number | null>(null);

  readonly form = this.fb.group({
    username: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    rol: ['ADMIN', [Validators.required]],
    activo: [true],
    password: [''],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.usuariosService.listar().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el listado de usuarios.');
        this.loading.set(false);
      },
    });
  }

  abrirCrear(): void {
    this.editingUsuario.set(null);
    this.formError.set(null);
    this.form.reset({ username: '', nombre: '', rol: 'ADMIN', activo: true, password: '' });
    this.form.controls.password.setValidators([Validators.required]);
    this.form.controls.password.updateValueAndValidity();
    this.modalOpen.set(true);
  }

  abrirEditar(usuario: Usuario): void {
    this.editingUsuario.set(usuario);
    this.formError.set(null);
    this.form.reset({
      username: usuario.username,
      nombre: usuario.nombre,
      rol: usuario.rol,
      activo: usuario.activo,
      password: '',
    });
    this.form.controls.password.clearValidators();
    this.form.controls.password.updateValueAndValidity();
    this.modalOpen.set(true);
  }

  cerrarModal(): void {
    this.modalOpen.set(false);
  }

  guardar(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.formError.set(null);

    const { username, nombre, rol, activo, password } = this.form.getRawValue();
    const editing = this.editingUsuario();

    const onError = () => {
      this.submitting.set(false);
      this.formError.set(
        editing
          ? 'No se pudo actualizar el usuario. Verifica los datos e intenta de nuevo.'
          : 'No se pudo crear el usuario. Verifica que el nombre de usuario no esté en uso.',
      );
    };

    const onSuccess = () => {
      this.submitting.set(false);
      this.modalOpen.set(false);
      this.cargar();
    };

    if (editing) {
      this.usuariosService
        .actualizar(editing.id, {
          username: username!,
          nombre: nombre!,
          rol: rol!,
          activo: activo!,
          password: password || undefined,
        })
        .subscribe({ next: onSuccess, error: onError });
    } else {
      this.usuariosService
        .crear({
          username: username!,
          nombre: nombre!,
          rol: rol!,
          activo: activo!,
          password: password!,
        })
        .subscribe({ next: onSuccess, error: onError });
    }
  }

  eliminar(usuario: Usuario): void {
    const confirmado = confirm(`¿Eliminar al usuario "${usuario.username}"? Esta acción no se puede deshacer.`);
    if (!confirmado) {
      return;
    }

    this.deletingId.set(usuario.id);
    this.usuariosService.eliminar(usuario.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.cargar();
      },
      error: () => {
        this.deletingId.set(null);
        this.errorMessage.set('No se pudo eliminar el usuario.');
      },
    });
  }

  rolLabel(valor: string): string {
    return this.roles.find((r) => r.value === valor)?.label ?? valor;
  }
}
