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
Instalar las dependencias:

Bash
npm install
Iniciar el servidor de desarrollo:

Bash
npm run dev
Abrir la plataforma:
Ve a tu navegador y visita http://localhost:3000. Serás redirigido automáticamente a la pantalla de inicio de sesión.

🔑 Acceso de Prueba (Testing)
Para evaluar el Dashboard y el sistema CRUD sin necesidad de registrar una cuenta nueva, utiliza las siguientes credenciales de administrador pre-configuradas:

Email: admin@admin.com

Contraseña: 123456

📁 Estructura del Proyecto (MVC)
El código fuente está organizado para respetar el patrón Modelo-Vista-Controlador de forma nativa en Next.js:

Plaintext
├── app/
│   ├── (auth)/login/       # VISTA: Pantalla de inicio de sesión
│   ├── api/auth/           # CONTROLADOR: Validación de credenciales
│   ├── dashboard/          # SECCIÓN PROTEGIDA (Panel Logístico)
│   │   ├── page.tsx        # VISTA: Lista de paquetes/solicitudes (Read & Delete)
│   │   ├── create/         # VISTA: Formulario de nueva solicitud (Create)
│   │   └── [id]/edit/      # VISTA: Formulario de modificación (Update)
├── lib/
│   ├── actions.ts          # CONTROLADORES: Lógica CRUD (Server Actions)
│   └── data.ts             # MODELO: Base de datos en memoria para testing
👨‍💻 Autor
Carlos Moreta


---

¡Con esto tu proyecto no solo muestra que sabes programar con las últimas herramientas, sino que también sabes estructurar un producto real con un propósito claro de negocio! Mucho éxito con **PorterWay**.
