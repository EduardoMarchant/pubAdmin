import { AbstractControl, ValidationErrors } from '@angular/forms';

const PATRON_TELEFONO = /^(\+?56)?[2-9]\d{8}$/;

export function rutValidator(control: AbstractControl): ValidationErrors | null {
  const valor = (control.value ?? '').toString().trim();
  if (!valor) {
    return null;
  }

  const limpio = valor.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
  const guion = limpio.indexOf('-');
  const cuerpo = guion >= 0 ? limpio.slice(0, guion) : limpio.slice(0, -1);
  const dv = guion >= 0 ? limpio.slice(guion + 1) : limpio.slice(-1);

  if (!cuerpo || !/^\d+$/.test(cuerpo) || dv.length !== 1) {
    return { rut: true };
  }

  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);

  return dvEsperado === dv ? null : { rut: true };
}

export function telefonoChilenoValidator(control: AbstractControl): ValidationErrors | null {
  const valor = (control.value ?? '').toString().trim();
  if (!valor) {
    return null;
  }
  const limpio = valor.replace(/[\s().-]/g, '');
  return PATRON_TELEFONO.test(limpio) ? null : { telefono: true };
}
