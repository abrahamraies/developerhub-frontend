# DeveloperHub Frontend

Este es el frontend de DeveloperHub, una plataforma para que los desarrolladores muestren sus proyectos y colaboren.

## Características

*   Autenticación de usuario (inicio de sesión, registro, restablecimiento de contraseña)
*   Explorar y descubrir proyectos
*   Crear, editar y eliminar proyectos
*   Comentar en proyectos
*   Importar proyectos desde GitHub
*   Perfiles de usuario y configuraciones

## Empezando

Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para fines de desarrollo y pruebas.

### Prerrequisitos

*   Node.js y npm (o yarn/pnpm)
*   Un servidor backend en funcionamiento (o un servidor simulado)

### Instalación

1.  Clona el repositorio
    ```sh
    git clone https://github.com/your_username_/developerhub-frontend-1.git
    ```
2.  Instala los paquetes de NPM
    ```sh
    npm install
    ```
3.  Crea un archivo `.env` en la raíz del proyecto y agrega las variables de entorno necesarias.

### Ejecutando la aplicación

```sh
npm run dev
```

Esto ejecutará la aplicación en modo de desarrollo. Abre [http://localhost:5173](http://localhost:5173) para verla en el navegador.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

*   `npm run dev`: Ejecuta la aplicación en modo de desarrollo.
*   `npm run build`: Compila la aplicación para producción en la carpeta `dist`.
*   `npm run lint`: Analiza el código con ESLint.
*   `npm run preview`: Sirve la compilación de producción localmente.

## Tecnologías Utilizadas

*   **Framework:** [React](https://reactjs.org/)
*   **Herramienta de Compilación:** [Vite](https://vitejs.dev/)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Enrutamiento:** [React Router](https://reactrouter.com/)
*   **Manejo de Estado:** [Zustand](https://zustand-demo.pmnd.rs/)
*   **Obtención de Datos:** [React Query](https://tanstack.com/query/v5) y [Axios](https://axios-http.com/)
*   **Manejo de Formularios:** [React Hook Form](https://react-hook-form.com/)
*   **Validación de Esquemas:** [Yup](https://github.com/jquense/yup)
*   **Componentes de UI:** [Heroicons](https://heroicons.com/)
*   **Notificaciones:** [React Hot Toast](https://react-hot-toast.com/)
