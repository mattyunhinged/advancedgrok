# Highland Aero

Interactive aerodynamic wind-tunnel simulator for the **Tesla Model 3 Highland**.

Watch airflow peel across the sealed face, accelerate over the flush glasshouse, and leave a tight low-drag wake — visualizing why the Highland redesign sits near **Cd 0.219**.

## Features

- Real-time 3D wind tunnel with procedural Model 3 Highland
- Particle airflow, streamlines, pressure overlays, and wake visualization
- Adjustable airspeed, yaw angle, particle density, paint, and camera
- Live aero telemetry: Cd, Cl, drag force, aero power, wake length, range impact

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Stack

Vite · React · TypeScript · Three.js · React Three Fiber · Framer Motion
