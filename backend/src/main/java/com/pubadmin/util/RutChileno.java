package com.pubadmin.util;

/**
 * Validación y normalización de RUT chileno usando el algoritmo de dígito verificador módulo 11.
 */
public final class RutChileno {

    private RutChileno() {
    }

    /** Quita puntos/espacios y deja el RUT como "CUERPO-DV" (DV en mayúscula). Null si el formato es inválido. */
    public static String normalizar(String rutBruto) {
        if (rutBruto == null) {
            return null;
        }
        String limpio = rutBruto.replace(".", "").replace(" ", "").trim().toUpperCase();
        int guion = limpio.indexOf('-');
        String cuerpo;
        String dv;
        if (guion >= 0) {
            cuerpo = limpio.substring(0, guion);
            dv = limpio.substring(guion + 1);
        } else if (limpio.length() >= 2) {
            cuerpo = limpio.substring(0, limpio.length() - 1);
            dv = limpio.substring(limpio.length() - 1);
        } else {
            return null;
        }
        if (cuerpo.isEmpty() || dv.length() != 1 || !cuerpo.chars().allMatch(Character::isDigit)) {
            return null;
        }
        return cuerpo + "-" + dv;
    }

    public static boolean esValido(String rutBruto) {
        String normalizado = normalizar(rutBruto);
        if (normalizado == null) {
            return false;
        }
        String[] partes = normalizado.split("-");
        String cuerpo = partes[0];
        String dv = partes[1];

        int suma = 0;
        int multiplicador = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplicador;
            multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
        }

        int resto = 11 - (suma % 11);
        String dvEsperado = switch (resto) {
            case 11 -> "0";
            case 10 -> "K";
            default -> String.valueOf(resto);
        };

        return dvEsperado.equals(dv);
    }
}
