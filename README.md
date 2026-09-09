# CNC Job Planner & Machining Time Estimator

A modern, software-based web application for CNC workshop operators to plan machining jobs, calculate real-time estimates for machining time, material usage, machine cost, and total job cost, compare parameters against historical records via Smart Estimation, and generate printable PDF work order reports.

---

> [!IMPORTANT]
> **SAFETY & PLANNING NOTICE:**
> This software is strictly a **planning and estimation prototype**.
> - It does **NOT** connect to, control, start, stop, or communicate with an actual CNC machine.
> - It does **NOT** receive live controller, spindle, motor, sensor, or machine data.
> - All outputs are **mathematical software projections** derived from operator-entered parameters and local historical records.
>
> **"Real-Time" Definition:**
> "Real-Time" in this application means the website automatically recalculates the estimates immediately whenever the operator changes the current job inputs (without page refresh, reopening, or requiring extra clicks).

---

## Key Features

1. **Real-Time Calculation Engine**
   - Recalculates automatically as you type or adjust dimensions, feed rates, tools, and operations.
   - Displays prominent badges: `REAL-TIME CALCULATION BASED ON CURRENT JOB PARAMETERS` and `ESTIMATES ONLY`.
   - Manual "Calculate Job" confirmation button also available.

2. **Transparent Calculation Formulas**
   - Interactive *"How is this calculated?"* accordion displaying the exact mathematical formulas:
     - **Material Area**: $\text{Area}(m^2) = \frac{\text{Length}(mm) \times \text{Width}(mm)}{1,000,000}$
     - **Material Cost**: $\text{Area}(m^2) \times \text{Material Cost per } m^2$
     - **Estimated Cutting Distance**: Perimeter contouring + internal stepover clearing based on tool diameter and depth passes.
     - **Machining Time**: $\frac{\text{Estimated Cutting Distance}}{\text{Feed Rate}} + (\text{Operations} \times 1.0\text{ min overhead})$
     - **Machine Operating Cost**: $\text{Machining Time (hours)} \times \text{Machine Hourly Cost}$
     - **Total Estimated Job Cost**: $\text{Material Cost} + \text{Machine Cost}$

3. **Strict Parameter Validation**
   - Immediate feedback prevents calculation on invalid inputs:
     - Zero or negative feed rate (`"Feed rate must be greater than zero."`)
     - Zero or negative tool diameter (`"Tool diameter must be greater than zero."`)
     - Cutting depth exceeding material thickness (`"Cutting depth cannot exceed material thickness."`)
     - Missing or invalid dimensions (`"Please enter a valid material length."`)
     - Negative costs or empty job name.

4. **Data-Based Smart Estimation**
   - **NOT an AI model.** Uses historical records clustering to identify similar jobs:
     - Matches on material type, workpiece dimensions ($\pm 45\%$), tool diameter ($\pm 3.5\text{ mm}$), and operations.
     - Displays:
       - *Similar Previous Jobs count*
       - *Typical Estimated Machining Time range*
       - *Estimated Cost Range*
       - Explanation: *"Based on similar previous job records."*
     - Clear fallback message if insufficient data: *"Not enough historical data for a reliable comparison."*

5. **Job History & Status Workflow**
   - Persistent storage in browser `localStorage`.
   - Pre-seeded with 5 realistic sample jobs (*MDF Cabinet Panel, Plywood Sign Board, Acrylic Name Plate, Wooden Panel, Aluminium Plate*).
   - Instant status updates (`Pending` $\leftrightarrow$ `In Progress` $\leftrightarrow$ `Completed`).
   - Adding or updating jobs dynamically updates dashboard statistics.
   - Reset button to restore initial demo data anytime.

6. **Printable Job Report & PDF Export**
   - Printable Work Order Sheet containing Job Details, Material Specs, Tool Info, Machining Parameters, Cost & Time Breakdown, and Operator Sign-off fields.
   - One-click **"Print / Save Report as PDF"** using browser print dialog with dedicated `@media print` CSS styling.

7. **Reports & Production Analytics**
   - Status progression bar (100% CSS-based).
   - Material usage breakdown (total area, cost, average time).
   - Direct material vs machine operating cost split.

8. **Fully Responsive Industrial Theme**
   - Optimized for mobile phones, tablets, laptops, and desktop screens with responsive collapsible drawer navigation.

---

## Technology Stack

- **React 18** (Component-driven UI)
- **Vite** (Next-generation development & build tool)
- **JavaScript (ES Modules)**
- **Custom CSS** (CNC-industrial theme with CSS variables and print optimization)
- **Lucide React** (Crisp vector icons)
- **Browser localStorage** (Client-side persistence, zero server or API dependencies)

---

## Getting Started (Beginner-Friendly Guide)

### Prerequisites
Make sure [Node.js](https://nodejs.org/) (version 18 or higher) is installed on your computer.

### 1. Open the Project Folder
Open your terminal or PowerShell and navigate to the project directory:
```bash
cd c:\Users\user\Documents\CNC-Job-Planner
```

### 2. Install Dependencies
Run the install command:
```bash
npm install
```
*(On Windows PowerShell, if execution policies restrict script files, use `npm.cmd install`)*

### 3. Start the Development Server
```bash
npm run dev
```
*(or `npm.cmd run dev`)*

The terminal will display a local URL:
```
  VITE v6.0.7  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Open in Your Browser
Open [http://localhost:5173](http://localhost:5173) in Chrome, Firefox, Edge, or Safari.

### 5. Build for Production
To create an optimized production build:
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready to deploy to any static host (GitHub Pages, Vercel, Netlify, or local static server).

---

## Usage Walkthrough

1. **Calculate a New Job**:
   - Navigate to **"New Job Planner"** in the sidebar.
   - Select a material preset (e.g. **MDF**, **Plywood**, **Wood**, **Acrylic**, **Aluminium**) to populate standard feed rates and stock costs.
   - Adjust the length, width, thickness, cutting depth, and tool diameter.
   - Notice how all 7 estimate cards and the **Smart Estimation** benchmark update instantly as you change values!
2. **Add to History**:
   - Click **"Add to Job History"**.
   - A success notification confirms the save.
3. **Manage Statuses & View Reports**:
   - Go to **"Job History"** to search, filter, or change the status of any job (`Pending`, `In Progress`, `Completed`).
   - Click **"Report"** on any job row to open the formal work order sheet.
   - Click **"Print / Save Report as PDF"** to save or print.
4. **Check Analytics**:
   - Go to **"Reports & Analytics"** or **"Dashboard"** to view aggregated workshop statistics and material usage.

---

## License

MIT License. Designed for CNC workshop operators, hobbyists, and manufacturing students.
