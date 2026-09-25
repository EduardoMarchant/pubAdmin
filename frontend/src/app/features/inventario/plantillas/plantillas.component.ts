import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plantilla, PlantillasService } from './plantillas.service';
import { ItemsComponent } from './items/items.component';

function hoyISO(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-inventario-plantillas',
  standalone: true,
  imports: [ReactiveFormsModule, ItemsComponent],
  templateUrl: './plantillas.component.html',
  styleUrl: './plantillas.component.scss',
})
export class PlantillasComponent implements OnInit {
  private readonly plantillasService = inject(PlantillasService);
  private readonly fb = inject(FormBuilder);

  readonly tipos = ['Cocina', 'Barra', 'Sonido'];

  readonly plantillas = signal<Plantilla[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly modalOpen = signal(false);
  readonly editingPlantilla = signal<Plantilla | null>(null);
  readonly submitting = signal(false);
  readonly formError = signal<string | null>(null);
  readonly deletingId = signal<number | null>(null);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required]],
    tipo: ['Cocina', [Validators.required]],
    fechaCreacion: [hoyISO(), [Validators.required]],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.plantillasService.listar().subscribe({
      next: (plantillas) => {
        this.plantillas.set(plantillas);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el listado de plantillas.');
        this.loading.set(false);
      },
    });
  }

  abrirCrear(): void {
    this.editingPlantilla.set(null);
    this.formError.set(null);
    this.form.reset({ nombre: '', tipo: 'Cocina', fechaCreacion: hoyISO() });
    this.modalOpen.set(true);
  }

  abrirEditar(plantilla: Plantilla): void {
    this.editingPlantilla.set(plantilla);
    this.formError.set(null);
    this.form.reset({
      nombre: plantilla.nombre,
      tipo: plantilla.tipo,
      fechaCreacion: plantilla.fechaCreacion,
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

    const { nombre, tipo, fechaCreacion } = this.form.getRawValue();
    const editing = this.editingPlantilla();
    const payload = { nombre: nombre!, tipo: tipo!, fechaCreacion: fechaCreacion! };

    const onError = () => {
      this.submitting.set(false);
      this.formError.set('No se pudo guardar la planilla. Intenta de nuevo.');
    };

    const onSuccess = () => {
      this.submitting.set(false);
      this.modalOpen.set(false);
      this.cargar();
    };

    if (editing) {
      this.plantillasService.actualizar(editing.id, payload).subscribe({ next: onSuccess, error: onError });
    } else {
      this.plantillasService.crear(payload).subscribe({ next: onSuccess, error: onError });
    }
  }

  eliminar(plantilla: Plantilla): void {
    const confirmado = confirm(`¿Eliminar la planilla "${plantilla.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) {
      return;
    }

    this.deletingId.set(plantilla.id);
    this.plantillasService.eliminar(plantilla.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.cargar();
      },
      error: () => {
        this.deletingId.set(null);
        this.errorMessage.set('No se pudo eliminar la planilla.');
      },
    });
  }
}
