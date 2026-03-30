# ImageGenZ

This is a [Next.js](https://nextjs.org) project that allows you to generate images using ComfyUI.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.jsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Architectural Design

The application is built with a modern web stack, separating the frontend and backend concerns, and leveraging a powerful image generation service.

### Frontend

The frontend is a single-page application built with **Next.js** and **React**.

-   **Location:** `app/page.jsx`
-   **Functionality:**
    -   Provides a user interface for generating images.
    -   Allows users to input a text prompt, select image resolution, and choose the number of images to generate (batch size).
    -   Sends image generation requests to the backend API.
    -   Displays the generated images in a grid layout.
    -   Includes a modal view for enlarging and viewing individual images.

### Backend

The backend is implemented as a **Next.js API route**.

-   **Location:** `app/api/generate/route.js`
-   **Functionality:**
    -   Handles POST requests from the frontend for image generation.
    -   Communicates with the ComfyUI server to execute the image generation workflow.
    -   Polls the ComfyUI server for the results and retrieves the generated image URLs.
    -   Returns the image URLs to the frontend.

### Image Generation (ComfyUI)

The core image generation is handled by a **ComfyUI** server.

-   **ComfyUI Server:** The application expects a ComfyUI instance to be running and accessible at the URL specified in `lib/comfyClient.js` (currently hardcoded to `http://192.168.0.158:8188`).
-   **Workflow Definition:** A base ComfyUI workflow is defined as a JSON object in `lib/workflow.js`. This workflow outlines the nodes and connections for the image generation process.
-   **Workflow Engine:** The `lib/workflowEngine.js` module dynamically modifies the base workflow with the parameters provided by the user (e.g., prompt, resolution, seed).
-   **ComfyUI Client:** The `lib/comfyClient.js` module contains helper functions for communicating with the ComfyUI server's API, including submitting workflows and fetching the results.

### Project Structure

```
.
├── app
│   ├── api
│   │   └── generate
│   │       └── route.js  # Backend API for image generation
│   ├── layout.jsx        # Main layout of the application
│   └── page.jsx          # Frontend UI for image generation
├── lib
│   ├── comfyClient.js    # Client for communicating with ComfyUI
│   ├── workflow.js       # Base ComfyUI workflow
│   └── workflowEngine.js # Applies user parameters to the workflow
├── public                # Static assets
└── ...                   # Configuration files
```

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
