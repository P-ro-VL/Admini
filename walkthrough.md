# Next.js Admin Builder Walkthrough

I have successfully built the Next.js Admin Builder system. This application allows you to define APIs, create custom pages using a drag-and-drop editor, and publish them to public routes.

## Features Implemented

### 1. Project Setup
- **Next.js 14+ (App Router)** with TypeScript and TailwindCSS.
- **Docker Support**: Ready for self-hosting with a standard `Dockerfile`.
- **Admin Layout**: Sidebar navigation for easy access to Dashboard, APIs, and Pages.

### 2. API Management
- **API Store**: Centralized management of API endpoints.
- **Configuration**: Support for Method (GET, POST, etc.), Headers, Body templates, and Authentication tokens.
- **Persistence**: Data is saved to a local `data.json` file via a server-side API, ensuring data survives server restarts (if the file is persisted).

### 3. Page Builder
- **Drag-and-Drop Editor**: Built with `dnd-kit`.
- **Components**:
    - **Table**: Connects to an API to display data in a grid.
    - **Form**: Generates form fields based on API body templates.
    - **Detail**: Shows key-value pairs from an API response.
    - **Static Content**: Text, Images, Containers.
- **Properties Panel**: Configure labels and API connections for each component.

### 4. Public View
- **Dynamic Routing**: Pages are published to `/[...slug]`.
- **Server-Side Rendering**: Configuration is read from the server, ensuring fast initial loads.
- **Client-Side Interactivity**: Components like Forms and Tables handle data fetching and submission on the client.

## How to Verify

### Prerequisites
- Node.js 18+ installed.
- Docker (optional, for container verification).

### Steps

1.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000/admin](http://localhost:3000/admin).

2.  **Configure an API**:
    - Go to **APIs** -> **Add API**.
    - Example: JSONPlaceholder Todos
        - **Name**: Todos API
        - **URL**: `https://jsonplaceholder.typicode.com/todos`
        - **Method**: GET
    - Click **Save**.

3.  **Create a Page**:
    - Go to **Pages** -> **Create Page**.
    - **Name**: My Todos
    - **Slug**: `todos`
    - **Style**: Table
    - Click **Create**.

4.  **Build the Page**:
    - You will be redirected to the Editor.
    - Drag a **Data Table** from the sidebar to the canvas.
    - Click the table on the canvas to select it.
    - In the **Properties Panel**, set **Connected API** to "Todos API".
    - The changes are saved automatically.

5.  **View the Public Page**:
    - Open [http://localhost:3000/todos](http://localhost:3000/todos).
    - You should see the table populated with data from JSONPlaceholder.

### Docker Build
To verify the Docker image:

```bash
docker build -t admin-builder .
docker run -p 3000:3000 admin-builder
```

> [!NOTE]
> Data persistence in Docker requires mounting a volume for `data.json`.
> Example: `docker run -p 3000:3000 -v $(pwd)/data.json:/app/data.json admin-builder`
