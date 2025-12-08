# Domos - Greek Property Calculator

A comprehensive real estate development calculator for estimating construction costs, revenue, and profit margins for building houses in Greece. This application features AI-powered investment analysis using Google Gemini and plot visualization.

## Features

*   **Financial Analysis**: Calculate construction costs, taxes, and potential profit margins.
*   **AI Consultant**: Get instant feasibility reports on your project using Google Gemini AI.
*   **Design Studio**: Visualise changes to a plot using AI image generation.
*   **Project Management**: Save and manage multiple development scenarios.

## Deployment to Vercel

This project is configured for seamless deployment on Vercel.

### Environment Variables

For security, you should configure the following environment variables in your Vercel Project Settings:

| Variable | Description |
|----------|-------------|
| `API_KEY` | **Required**. Your Google Gemini API Key. |
| `ADMIN_EMAIL` | Optional. Email for the login screen. Defaults to `sakis@post.com`. |
| `ADMIN_PASSWORD` | Optional. Password for the login screen. Defaults to `sakis1964`. |

### Build Command
Vercel should automatically detect the framework, but if needed:
*   **Build Command**: `npm run build`
*   **Output Directory**: `dist`
*   **Install Command**: `npm install`

## Local Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
