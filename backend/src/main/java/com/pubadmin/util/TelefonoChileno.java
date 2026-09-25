package com.pubadmin.util;

import java.util.regex.Pattern;

/**
 * Validación y normalización de números telefónicos chilenos (fijos y móviles),
 * con o sin el código de país +56.
 */
public final class TelefonoChileno {

    private static final Pattern PATRON = Pattern.compile("^(?:\\+?56)?[2-9]\\d{8}$");

    private TelefonoChileno() {
    }

    /** Deja solo dígitos y un posible "+" inicial. Null si queda vacío. */
    public static String normalizar(String telefonoBruto) {
        if (telefonoBruto == null) {
            return null;
        }
        String limpio = telefonoBruto.replaceAll("[\\s().-]", "").trim();
        return limpio.isEmpty() ? null : limpio;
    }

    public static boolean esValido(String telefonoBruto) {
        String normalizado = normalizar(telefonoBruto);
        return normalizado != null && PATRON.matcher(normalizado).matches();
    }
}
