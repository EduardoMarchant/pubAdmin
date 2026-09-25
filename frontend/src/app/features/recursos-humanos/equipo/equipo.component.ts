import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreasTrabajoService } from './areas-trabajo.service';
import { rutValidator, telefonoChilenoValidator } from './chile.validators';
import { EquipoService, Integrante } from './equipo.service';
import { HorariosCatalogoService, NombreCatalogo } from './horarios-catalogo.service';

@Component({
  selector: 'app-rrhh-equipo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.scss',
})
export class EquipoComponent implements OnInit {
  private readonly equipoService = inject(EquipoService);
  private readonly horariosService = inject(HorariosCatalogoService);
  private readonly areasService = inject(AreasTrabajoService);
  private readonly fb = inject(FormBuilder);

  readonly estados = ['Activo', 'Inactivo'];

  readonly integrantes = signal<Integrante[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly modalOpen = signal(false);
  readonly submitting = signal(false);
  readonly formError = signal<string | null>(null);
  readonly editingIntegrante = signal<Integrante | null>(null);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required]],
    segundoNombre: [''],
    apellidoPaterno: ['', [Validators.required]],
    apellidoMaterno: [''],
    alias: [''],
    rut: ['', [Validators.required, rutValidator]],
    telefono: ['', [Validators.required, telefonoChilenoValidator]],
    email: ['', [Validators.required, Validators.email]],
    estado: ['Activo', [Validators.required]],
    areaTrabajoId: [null as number | null, [Validators.required]],
  });

  readonly horarios = signal<NombreCatalogo[]>([]);
  readonly horariosLoading = signal(true);
  readonly horariosError = signal<string | null>(null);
  readonly horariosGuardando = signal(false);
  readonly nuevoHorarioControl = new FormControl('', [Validators.required]);

  readonly areas = signal<NombreCatalogo[]>([]);
  readonly areasLoading = signal(true);
  readonly areasError = signal<string | null>(null);
  readonly areasGuardando = signal(false);
  readonly nuevaAreaControl = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.cargar();
    this.cargarHorarios();
    this.cargarAreas();
  }

  cargarHorarios(): void {
    this.horariosLoading.set(true);
    this.horariosError.set(null);
    this.horariosService.listar().subscribe({
      next: (horarios) => {
        this.horarios.set(horarios);
        this.horariosLoading.set(false);
      },
      error: () => {
        this.horariosError.set('No se pudo cargar el listado de horarios.');
        this.horariosLoading.set(false);
      },
    });
  }

  agregarHorario(): void {
    if (this.nuevoHorarioControl.invalid || this.horariosGuardando()) {
      this.nuevoHorarioControl.markAsTouched();
      return;
    }
    this.horariosGuardando.set(true);
    this.horariosService.crear(this.nuevoHorarioControl.value!.trim()).subscribe({
      next: () => {
        this.horariosGuardando.set(false);
        this.nuevoHorarioControl.reset('');
        this.cargarHorarios();
      },
      error: () => {
        this.horariosGuardando.set(false);
        this.horariosError.set('No se pudo guardar el horario.');
      },
    });
  }

  cargarAreas(): void {
    this.areasLoading.set(true);
    this.areasError.set(null);
    this.areasService.listar().subscribe({
      next: (areas) => {
        this.areas.set(areas);
        this.areasLoading.set(false);
      },
      error: () => {
        this.areasError.set('No se pudo cargar el listado de áreas de trabajo.');
        this.areasLoading.set(false);
      },
    });
  }

  agregarArea(): void {
    if (this.nuevaAreaControl.invalid || this.areasGuardando()) {
      this.nuevaAreaControl.markAsTouched();
      return;
    }
    this.areasGuardando.set(true);
    this.areasService.crear(this.nuevaAreaControl.value!.trim()).subscribe({
      next: () => {
        this.areasGuardando.set(false);
        this.nuevaAreaControl.reset('');
        this.cargarAreas();
      },
      error: () => {
        this.areasGuardando.set(false);
        this.areasError.set('No se pudo guardar el área de trabajo.');
      },
    });
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.equipoService.listar().subscribe({
      next: (integrantes) => {
        this.integrantes.set(integrantes);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el listado del equipo.');
        this.loading.set(false);
      },
    });
  }

  abrirCrear(): void {
    this.editingIntegrante.set(null);
    this.formError.set(null);
    this.form.reset({
      nombre: '',
      segundoNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      alias: '',
      rut: '',
      telefono: '',
      email: '',
      estado: 'Activo',
      areaTrabajoId: null,
    });
    this.modalOpen.set(true);
  }

  abrirEditar(integrante: Integrante): void {
    this.editingIntegrante.set(integrante);
    this.formError.set(null);
    this.form.reset({
      nombre: integrante.nombre,
      segundoNombre: integrante.segundoNombre ?? '',
      apellidoPaterno: integrante.apellidoPaterno,
      apellidoMaterno: integrante.apellidoMaterno ?? '',
      alias: integrante.alias ?? '',
      rut: integrante.rut,
      telefono: integrante.telefono,
      email: integrante.email,
      estado: integrante.estado,
      areaTrabajoId: integrante.areaTrabajoId,
    });
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

    const valores = this.form.getRawValue();
    const payload = {
      nombre: valores.nombre!,
      segundoNombre: valores.segundoNombre || null,
      apellidoPaterno: valores.apellidoPaterno!,
      apellidoMaterno: valores.apellidoMaterno || null,
      alias: valores.alias || null,
      rut: valores.rut!,
      telefono: valores.telefono!,
      email: valores.email!,
      estado: valores.estado!,
      areaTrabajoId: valores.areaTrabajoId!,
    };

    const editando = this.editingIntegrante();
    const peticion = editando
      ? this.equipoService.actualizar(editando.id, payload)
      : this.equipoService.crear(payload);

    peticion.subscribe({
      next: () => {
        this.submitting.set(false);
        this.modalOpen.set(false);
        this.cargar();
      },
      error: (err) => {
        this.submitting.set(false);
        if (err.status === 409) {
          this.formError.set('Ya existe un integrante con ese RUT.');
        } else if (err.status === 400) {
          this.formError.set('Revisa los datos: RUT o teléfono con formato inválido.');
        } else {
          this.formError.set('No se pudo guardar el integrante. Intenta de nuevo.');
        }
      },
    });
  }

  nombreCompleto(integrante: Integrante): string {
    return [
      integrante.nombre,
      integrante.segundoNombre,
      integrante.apellidoPaterno,
      integrante.apellidoMaterno,
    ]
      .filter((parte) => !!parte)
      .join(' ');
  }
}
