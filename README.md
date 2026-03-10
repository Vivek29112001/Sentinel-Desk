# SentinelDesk — Desktop Monitoring Tool

SentinelDesk is a **cross-platform desktop monitoring application** that visualizes real-time system metrics such as CPU usage, memory consumption, disk activity, and running processes through an interactive dashboard.

The application is built using **Next.js, Electron, and Python**, enabling secure system-level access and real-time monitoring.

---

## Key Features

• Real-time CPU, memory, and disk monitoring
• Running process inspection
• Interactive system dashboards
• Electron-based desktop application
• Python-powered OS metrics collection
• Modular and scalable architecture

---

## Tech Stack

Frontend

<<<<<<< HEAD
* Next.js
* React
* TailwindCSS

Desktop Layer

* Electron
* IPC Communication
=======
- Next.js
- React
- TailwindCSS
- ShadCN UI
- Chart.js

Desktop Layer

- Electron
>>>>>>> ad2ffed (day 2)

Backend / System Metrics

- Python
- psutil

Data Visualization

* Chart.js / Recharts

---

## Architecture Overview

SentinelDesk uses a **hybrid architecture combining Electron and Python services**.

1. Electron launches the desktop application.
2. The Next.js frontend renders the monitoring dashboard.
3. Electron communicates with Python services using IPC.
4. Python collects system metrics via psutil.
5. Metrics are streamed to the frontend for visualization.

---

## System Metrics Collected

SentinelDesk monitors:

* CPU usage
* Memory usage
* Disk utilization
* Running processes
* OS information

---

## Installation

Clone the repository

```
git clone https://github.com/yourusername/sentineldesk.git
cd sentineldesk
```

Install dependencies

```
npm install
```

Run development environment

```
npm run start
```

Build desktop application

```
npm run dist
```

---

## Future Improvements

* AI-based anomaly detection
* Distributed system monitoring
* Network traffic analysis
* Alerting and notification system
* Historical metrics storage

---

## Author

<<<<<<< HEAD
Vivek Sharma
Software Engineer
=======
Datadog
Grafana
Windows Task Manager
System Monitoring Agents


>>>>>>> ad2ffed (day 2)
