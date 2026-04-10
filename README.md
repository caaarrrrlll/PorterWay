# 🚚 PorterWay - Plataforma de Logística y Entrega de Paquetes

**PorterWay** es una aplicación web diseñada para revolucionar la entrega de paquetes. Nuestra plataforma conecta a usuarios que necesitan enviar artículos con conductores disponibles, permitiendo el transporte seguro de carga sin importar la cantidad o el tamaño.

Este proyecto ha sido desarrollado como una aplicación Fullstack utilizando **Next.js 15 (App Router)**, implementando rigurosamente el patrón de diseño **MVC (Modelo-Vista-Controlador)** para garantizar un código escalable y mantenible.

## ✨ Características Principales

* **📦 Gestión de Envíos (CRUD):** Los usuarios pueden crear, visualizar, editar y cancelar solicitudes de transporte de paquetes en tiempo real.
* **🔒 Rutas Protegidas:** Sistema de autenticación integrado que asegura que solo los usuarios registrados puedan acceder al Dashboard logístico.
* **🏗️ Arquitectura MVC Estricta:** Separación clara de responsabilidades en el código:
  * **Modelo:** Gestión del estado y datos de los paquetes (`lib/data.ts`).
  * **Vistas:** Interfaces de usuario interactivas y responsivas construidas con React y Tailwind CSS.
  * **Controladores:** Lógica de negocio procesada a través de *Next.js Server Actions* (`lib/actions.ts`).
* **⚡ In-Memory Database:** Utiliza un estado en memoria para el almacenamiento de datos, lo que permite clonar, ejecutar y probar la aplicación instantáneamente sin requerir configuración de bases de datos externas (como SQLite o PostgreSQL) durante la fase de desarrollo/testing.

## 🛠️ Tecnologías Utilizadas

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Estilos:** Tailwind CSS
* **Backend:** Next.js Server Actions
* **Autenticación:** Sistema de sesión JWT (Configuración de prueba integrada)

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para levantar PorterWay en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/caaarrrrlll/porterway.git](https://github.com/caaarrrrlll/porterway.git)
   cd porterway
