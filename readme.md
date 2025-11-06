# Teacher App Monorepo

This repository contains a React Native mobile client (`teacher-app/mobile`) and an Express.js backend (`teacher-app/server`). The setup below allows you to run the API locally or in a remote development environment (such as GitHub Codespaces) and access it from the Expo Go app on a physical device.

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo`), optional but helpful

## Running the backend

```bash
cd teacher-app/server
npm install
npm run dev
```

The server listens on port `5000` by default and now binds to `0.0.0.0`, making it reachable from other devices on the same network (for example, your phone running Expo Go).

> **Tip:** If you need to run the API on a different port, set the `PORT` environment variable before starting the server.

## Running the mobile app

```bash
cd teacher-app/mobile
npm install
npx expo start --tunnel
```

When you scan the QR code with Expo Go, the mobile client automatically determines the correct backend URL in the following order:

1. `EXPO_PUBLIC_API_BASE_URL` environment variable (set in your shell or `.env` when using Expo).
2. `expo.extra.apiBaseUrl` configured in `teacher-app/mobile/app.json`.
3. The LAN IP address detected from Expo when running in development mode (useful for physical devices on the same network).
4. Falls back to `http://localhost:5000` for simulators or automated tests.

### Customising the API base URL

- **Temporary override:** set `EXPO_PUBLIC_API_BASE_URL` before running `expo start`.
- **Project-wide default:** edit `teacher-app/mobile/app.json` and update `expo.extra.apiBaseUrl`.

This allows the mobile app to connect to the backend regardless of whether the API is running locally or in a remote cloud workspace.

## Folder structure

```
teacher-app/
├── mobile/   # React Native + Expo client
└── server/   # Express.js backend
```

## Troubleshooting

- Ensure the machine running the backend exposes port `5000` to your device. When using GitHub Codespaces or other cloud IDEs, use the forwarded URL in `EXPO_PUBLIC_API_BASE_URL`.
- If authentication requests fail, confirm that the Expo client resolved the correct base URL by checking the `BASE_URL` value in the app logs.

