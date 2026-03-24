# VISIÓN GENERAL (antes de empezar)

## Principios del diseño:

- Separación de responsabilidades (SoC)
- Arquitectura por capas
- Gestión centralizada de errores
- Configuración desacoplada (env vars)
- API REST semántica (HTTP correcto)
- Código mantenible y testeable


Fase A -  Infraestructura y variables de entorno
    Objetivo
    Configurar el entorno del servidor de forma flexible y segura.
    - Uso de variables de entorno (.env)
    - Configuración del servidor desacoplada del código
    - Uso de dotenv

FASE B -  Ingeniería del dominio y arquitectura
Vas a construir una API así:

    index.js → arranca servidor
    routes → define rutas (/tasks)
    controllers → validan datos HTTP
    services → lógica pura (sin Express)

FASE C — Manejo de errores (MUY importante)


