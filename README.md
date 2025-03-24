# ReachInbox Application

A modern email management application built with React, following the design from Figma and integrating with the provided API.

## Features

### 1. Authentication

- Login with Google functionality
- Persistent login state using localStorage
- Automatic redirection to OneBox after successful authentication
- Support for both development mode (mock data) and production mode (real OAuth)

### 2. OneBox Email Management

- View list of emails with sender, subject, and preview
- View email details
- Delete emails (using "D" keyboard shortcut or delete button)
- Reply to emails (using "R" keyboard shortcut or reply button)

### 3. Custom Text Editor

- Rich text formatting options
- Custom "SAVE" button for drafts
- Variables dropdown to insert dynamic content

### 4. Smart Tagging System (Innovative Feature)

- Automatically analyzes email content to suggest relevant tags
- Tags include: Urgent, Work, Document, Follow Up
- Apply multiple tags to emails
- Visual indicators for tagged emails in the list

### 5. Dark Mode Support

- Toggle between light and dark themes
- Automatic theme detection based on system preferences
- Persistent theme preference using localStorage

## Keyboard Shortcuts

- **D**: Delete the currently selected email
- **R**: Open the reply editor for the currently selected email

## Technical Details

The application is built using:

- React for UI components
- React Router for navigation
- Styled Components for styling
- React Quill for the rich text editor
- React Icons for UI icons
- Context API for state management
- Axios for API communication

## API Integration

The application integrates with the following API endpoints:

- `/auth/google-login` for authentication
- `/onebox/list` for fetching email threads
- `/onebox/:thread_id` for fetching a specific thread
- `/onebox/:thread_id` (DELETE) for deleting a thread
- `/reply/:thread_id` (POST) for sending replies

## Common Issues and Solutions

### Missing Logo Files

If you see errors about missing logo files in the console:

```
Error while trying to use the following icon from the Manifest: http://localhost:3000/logo192.png
```

**Solution:** Add the missing logo files to the `public` directory:

1. Create or download a favicon.ico file
2. Create or download logo192.png and logo512.png files

### CORS Errors

If you see CORS errors when trying to connect to the API:

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:** The application is configured to use mock data in development mode to avoid CORS issues. In production, ensure that:

1. The API server is configured to allow requests from your domain
2. Your frontend is hosted on the same domain as the API or a domain allowed by the API's CORS policy

## Innovative Feature: Smart Tagging System

I've implemented a Smart Tagging System that analyzes email content to automatically suggest relevant tags. This enhances email organization and helps users quickly identify important or action-required emails.

The system scans email subject and body for specific keywords and patterns to suggest tags such as:

- **Urgent**: For time-sensitive emails
- **Work**: For business-related emails
- **Document**: For emails containing attachments or files
- **Follow Up**: For emails that may require a follow-up action

Users can select which suggested tags to apply, and the tags are visually displayed on both the email list and the email detail view, providing at-a-glance context for each message.

This feature adds significant value by:

1. Reducing the manual effort required to categorize emails
2. Enhancing email prioritization and workflow management
3. Providing visual cues to quickly identify email context
4. Supporting more efficient email processing

## Google Login Flow

The application implements a complete Google OAuth login flow:

1. **Login Button**: When clicked, redirects to the Google OAuth endpoint with a redirect URL back to the application.

2. **OAuth Callback**: After successful Google authentication, the API redirects to our auth callback route with token and user data in URL parameters.

3. **Callback Handling**: The `AuthCallback` component processes the response, extracts the authentication data, and saves it in the app's context.

4. **Automatic Redirection**: After successful authentication, users are automatically redirected to the OneBox screen.

5. **Development Mode**: In development, mock data is used to simulate the authentication flow without requiring actual Google login.

### Implementation Details

- The application uses a protected route pattern to ensure only authenticated users can access the OneBox screen.
- Authentication state is persisted in localStorage to maintain login between browser sessions.
- The API service provides a `redirectToGoogleLogin` function that constructs the proper OAuth URL with the correct redirect parameter.
- The callback URL is dynamically generated based on the application's current origin, making it work in any environment.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Open your browser to `http://localhost:3000`
