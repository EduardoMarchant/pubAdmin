package com.pubadmin.startup;

import com.pubadmin.entity.Usuario;
import com.pubadmin.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Crea el usuario admin/admin en el primer arranque si la tabla usuarios está vacía.
 */
@Component
public class AdminUserSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserSeeder.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.existsByUsername("admin")) {
            return;
        }
        Usuario admin = new Usuario();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setNombre("Administrador");
        admin.setRol("ADMIN");
        admin.setActivo(true);
        admin.setFechaCreacion(LocalDateTime.now());
        usuarioRepository.save(admin);
        log.info("Usuario 'admin' creado con contraseña inicial 'admin'. Cámbiala después del primer login.");
    }
}
