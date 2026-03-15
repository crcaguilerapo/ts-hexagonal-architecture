# TypeScript Hexagonal Architecture

Este proyecto implementa una arquitectura hexagonal (puertos y adaptadores) utilizando TypeScript. El objetivo es mantener una separación clara de responsabilidades, permitiendo que la lógica de negocio sea independiente de las tecnologías externas.

## Estructura del Proyecto

La estructura sigue los principios de la arquitectura hexagonal, organizada dentro de la carpeta `src`:

```
src/
├── adapters/          # Implementaciones concretas de los puertos (infraestructura)
│   ├── in/           # Adaptadores de entrada (ej. CLI)
│   └── out/          # Adaptadores de salida (ej. persistencia, logs)
├── domain/            # El núcleo del negocio
│   ├── ports/        # Interfaces (puertos) que definen la comunicación
│   │   ├── in/       # Puertos de entrada
│   │   └── out/      # Puertos de salida
│   └── use_cases/    # Lógica de negocio específica
├── entrypoints/       # Punto de entrada de la aplicación (bucle principal)
└── resources/         # Recursos estáticos o de configuración
```

### Capas Principales

*   **Domain (Dominio):** Contiene las entidades de negocio, las interfaces de los puertos y los casos de uso. Es el corazón de la aplicación y no tiene dependencias de capas externas.
*   **Adapters (Adaptadores):** Implementan las interfaces definidas en la capa de dominio.
    *   **Inbound (Entrada):** Conducen la aplicación (ej. `CliAdapter`).
    *   **Outbound (Salida):** Son conducidos por la aplicación (ej. `FileRepositoryAdapter`, `LoggerAdapter`).
*   **Entrypoints:** Configuran la aplicación, inyectan las dependencias (adaptadores en los casos de uso) e inician la ejecución.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### Construcción
```bash
npm run build
```
Compila el proyecto TypeScript a JavaScript en la carpeta `dist`.

### Ejecución en Desarrollo
```bash
npm run dev
```
Ejecuta la aplicación utilizando `tsx` para una recarga rápida durante el desarrollo.

### Ejecución en Producción (CLI)
```bash
npm start
```
Ejecuta los archivos compilados desde la carpeta `dist`.

### Ejecución en Producción (REST)
```bash
ADAPTER=rest npm start
```
Inicia un servidor REST que expone los endpoints:
- `GET /search?pattern=<regex>` — busca nombres por expresión regular.
- `GET /health` — chequeo de estado.

### Pruebas
```bash
npm test
```
Ejecuta los tests definidos en la carpeta `tests` utilizando Jest.

## Tecnologías Utilizadas

*   **TypeScript:** Lenguaje de programación.
*   **Commander:** Para la interfaz de línea de comandos (CLI).
*   **Pino:** Para el registro de logs.
*   **Jest:** Framework de pruebas unitarias.