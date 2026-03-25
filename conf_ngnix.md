El Procedimiento Padrón para un Nuevo Software
Paso 1: La Regla del Puerto Único (En tu docker-compose.yml)
Cada nuevo software que instales en tu VPS debe exponer un puerto diferente hacia el host, y siempre amarrado a localhost por seguridad.

Software 1 (Clínica): 127.0.0.1:8080

Software 2 (Farmacia): 127.0.0.1:5000

Software 3 (El Nuevo): 127.0.0.1:3000 (Ejemplo)

Paso 2: Crear el "Pasaporte" en Nginx
Nunca edites el archivo default.conf genérico. Ve directamente al "cerebro" de Nginx y crea un archivo nuevo con el nombre de tu cliente o proyecto:

Bash
sudo nano /etc/nginx/sites-available/nuevo-proyecto
Pega esta plantilla maestra. Solo tienes que modificar dos líneas (marcadas en mayúsculas):

Nginx
server {
    listen 80;
    
    # 1. CAMBIA ESTO: El subdominio exacto que creaste en Cloudflare
    server_name nuevoproyecto.hswaretecnologia.com;

    location / {
        # 2. CAMBIA ESTO: El puerto que le asignaste a este contenedor en Docker
        proxy_pass http://127.0.0.1:3000;
        
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
        client_max_body_size 50M; # Ajusta si necesitas subir archivos grandes
    }
}
Guarda y sal (Ctrl+O, Enter, Ctrl+X).

Paso 3: Activar la Ruta (El Enlace Simbólico)
Nginx tiene dos carpetas: sites-available (los que existen) y sites-enabled (los que están encendidos). Para encender tu nuevo proyecto, creas un "acceso directo" entre ambas:

Bash
sudo ln -s /etc/nginx/sites-available/nuevo-proyecto /etc/nginx/sites-enabled/
Paso 4: Verificación y Recarga en Caliente
Nunca reinicies Nginx sin antes verificar que no haya un error de tipeo (un punto y coma faltante, por ejemplo), porque tumbarías la Clínica y la Farmacia al mismo tiempo.

Revisa la sintaxis:

Bash
sudo nginx -t
Si te responde syntax is ok y test is successful, recarga Nginx suavemente para aplicar los cambios sin cortar las conexiones actuales de tus otros clientes:

Bash
sudo systemctl reload nginx
¡Y listo! Eso es todo. Mientras el contenedor de Docker esté encendido en ese puerto y Cloudflare apunte a la IP de tu VPS, la aplicación saldrá a internet inmediatamente.