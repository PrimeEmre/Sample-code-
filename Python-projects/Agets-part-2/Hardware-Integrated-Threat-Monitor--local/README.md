Markdown<div align="center">

# 🛡️ Hardware-Integrated Threat Monitor

**Real-time local hardware anomaly detection & threat monitoring system**

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://python.org)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-lightgrey.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

[Features](#-features) · [Installation](#-installation) · [Usage](#-usage) · [Configuration](#-configuration) · [Architecture](#-architecture) · [Contributing](#-contributing)

</div>

---

## 📖 Overview

**Hardware-Integrated Threat Monitor (HITM)** is an advanced, fully local system that continuously monitors hardware-level telemetry — CPU, GPU, memory, disk, network, and power sensors — to detect anomalies that may indicate **supply-chain attacks, firmware tampering, malicious peripheral injection, side-channel exploits, or hardware-level persistence mechanisms**.

Unlike cloud-dependent security solutions, HITM runs entirely on your machine. Zero data leaves your system. It establishes a **baseline of normal hardware behavior** using advanced statistical models and flags deviations in real time, giving you visibility into threats that traditional software-only security tools cannot detect.

### 🔑 Key Differentiators
* **100% Offline Operation** — No internet connection required, no telemetry sent externally.
* **Hardware-Level Visibility** — Detects threats hiding below the operating system layer.
* **Adaptive Baselines** — Machine learning-based profiling that evolves with your system workload.
* **Low Resource Footprint** — Optimized background monitoring designed to run 24/7.

> ⚠️ **Important:** This tool is designed for defensive security monitoring and educational research. Always comply with local laws and organizational policies.

---

## ✨ Features

### Core Monitoring
* **CPU Telemetry** — Clock speeds, temperature, load per core, thread anomalies, unexpected frequency spikes, and cache performance.
* **GPU Telemetry** — Temperature, memory usage (VRAM), clock deviations, and unauthorized compute workloads.
* **Memory Analysis** — Usage patterns, unexpected allocation spikes, suspicious resident set changes, and swap activity.
* **Disk I/O Tracking** — Read/write anomaly detection, unexpected block device activity, DMA-like patterns, and SMART health monitoring.
* **Network Interface Monitoring** — Packet rate anomalies, unexpected interface activations, and promiscuous mode detection.
* **Power & Thermal** — Voltage rail deviations, fan speed manipulation, thermal throttling anomalies, and power spikes.
* **Peripheral Monitoring** — USB device enumeration changes, PCIe hotplug events, and unauthorized hardware insertion.

### Threat Detection Engine
| Detection Category | Description | Severity |
|---|---|---|
| 🔥 Thermal Anomalies | Abnormal temperature curves suggesting covert mining or stress attacks | High |
| ⚡ Power Deviations | Voltage irregularities indicating potential hardware implants | Critical |
| 🔄 Frequency Manipulation | Unexpected clock/voltage changes suggesting firmware tampering | High |
| 📡 Peripheral Injection | Detection of unauthorized USB/PCIe device enumeration changes | Critical |
| 💾 Disk Anomalies | Unusual I/O patterns consistent with data exfiltration or ransomware prep | High |
| 🌐 Network Aberrations | Out-of-profile network activity from hardware-level sources | Medium |
| 🧠 Memory Anomalies | Sudden allocation changes suggesting kernel-level exploitation | Critical |

### System Features
* 📊 **Real-time Dashboard** — Live visualization of all sensor streams with historical overlays.
* 🔔 **Multi-Channel Alerts** — Configurable threshold alerts via console logs, files, or desktop notifications.
* 📈 **Adaptive Baseline Learning** — Automated behavioral profiling over custom evaluation windows.
* 🔒 **Zero Network Egress** — Processing remains strictly local for data privacy and security.
* ⚙️ **Plugin Architecture** — Easily extend with custom sensor modules and specific behavioral detection rules.

---

## 🏗 *Architecture*

```text
┌─────────────────────────────────────────────────────────────────┐
│ HITM System                                                     │
│                                                                 │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐      │
│ │    Sensor    │ │   Adaptive   │ │   Threat Detection   │      │
│ │  Collectors  │─▶│   Baseline   │─▶│        Engine        │      │
│ │   (200+)     │ │    Engine    │ │ (ML + Statistical)   │      │
│ └──────┬───────┘ └──────┬───────┘ └──────────┬───────────┘      │
│        │                │                    │                  │
│        │         ┌──────┴──────────┐         │                  │
│        └────────▶│  Time-Series DB │◀────────┘                  │
│                  │ (Local Storage) │                            │
│                  └──────────┬──────┘                            │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐        │
│  │    Alert    │     │  Dashboard  │     │  Response   │        │
│  │   Manager   │     │  (GUI/CLI)  │     │  Executor   │        │
│  └─────────────┘     └─────────────┘     └─────────────┘        │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      Output Channels                      │  │
│  │   Log  │  Desktop Alert  │  Webhook Notification  │  Script  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
Data FlowSensor Collectors poll hardware interfaces at configurable intervals (default: 1s).Raw telemetry is processed by the Adaptive Baseline Engine to calculate moving averages and running standard deviations.The Detection Engine evaluates live metrics against calculated baselines using statistical z-score thresholds and custom rule boundaries.Anomalies trigger the Alert Manager, which dispatches notifications to configured local logging targets and interfaces.📋 PrerequisitesRequirementMinimumRecommendedMaximum CapablePython3.83.11+3.12OSWindows 10 / Ubuntu 20.04Windows 11 / Ubuntu 22.04Windows 11 / Ubuntu 24.04CPU2 cores4+ cores—RAM2 GB free4 GB free8 GBDisk500 MB2 GB10 GB (extended logs)PermissionsAdministrator / sudoAdministrator / sudo—Hardware Sensor DependenciesWindows: LibreHardwareMonitor (recommended) or Open Hardware Monitor must be running in the background.Linux: lm-sensors, hddtemp, and smartmontools packages are required.Both Platforms: Works strictly offline with zero cloud dependencies.🚀 Installation1. Clone the RepositoryBashgit clone [https://github.com/PrimeEmre/Hardware-Integrated-Threat-Monitor--local.git](https://github.com/PrimeEmre/Hardware-Integrated-Threat-Monitor--local.git)
cd Hardware-Integrated-Threat-Monitor--local
2. Create Virtual EnvironmentBashpython -m venv venv

# Windows Activation
venv\Scripts\activate

# Linux/macOS Activation
source venv/bin/activate
3. Install DependenciesBashpip install -r requirements.txt
4. Linux-Specific Sensor SetupBash# Install monitoring tools
sudo apt-get update
sudo apt-get install lm-sensors hddtemp smartmontools

# Automatically detect available system sensors
sudo sensors-detect --auto

# Verify raw hardware access
sensors
5. Windows-Specific SetupDownload and run LibreHardwareMonitor or Open Hardware Monitor.Ensure the application is configured to run in the background with administrative permissions prior to booting HITM.🖥️ UsageQuick Start (CLI Mode)Bash# Run monitor with standard setup
python hitm.py --mode cli

# Launch with custom configuration settings
python hitm.py --mode cli --config my_config.yaml

# Run with interactive verbose console logging
python hitm.py --mode cli --verbose
GUI Dashboard ModeBashpython hitm.py --mode gui
Headless Background Service (Linux systemd)Bash# Run directly in background mode
python hitm.py --mode daemon --config config.yaml

# Or configure as a permanent system service
sudo cp hitm.service /etc/systemd/system/
sudo systemctl enable hitm
sudo systemctl start hitm
sudo systemctl status hitm
Profiling and Baseline CalibrationBash# Execute a tailored baseline evaluation run (Recommended: 2 to 4 hours)
python hitm.py --learn --duration 4h --output baseline_profile.json
Command-Line ArgumentsPlaintextusage: hitm.py [-h] [--mode {cli,gui,daemon}] [--config CONFIG]
               [--learn] [--duration DURATION] [--verbose]
               [--log-level {DEBUG,INFO,WARNING,ERROR}]
               [--export {json,csv}] [--version]

Hardware-Integrated Threat Monitor

options:
  -h, --help            Show this help message
  --mode {cli,gui,daemon}
                        Operating mode (default: cli)
  --config CONFIG       Path to configuration file
  --learn               Run baseline learning phase
  --duration DURATION   Learning duration (e.g., 2h, 30m)
  --verbose             Enable verbose console output
  --log-level {DEBUG,INFO,WARNING,ERROR}
                        Set logging verbosity
  --export {json,csv}   Export sensor data to file
  --version             Show version information
⚙️ ConfigurationCreate a config.yaml file in the project root. A standard template is provided below:YAMLmonitoring:
  poll_interval: 1.0          # Time window between sensor sweeps (seconds)
  learning_duration: 14400    # Default learning phase length (4 hours)
  learning_mode: true         # Flip to false once a reliable baseline is saved

sensors:
  cpu:
    enabled: true
    metrics: [temperature, clock_speed, load_per_core, power]
  gpu:
    enabled: true
    metrics: [temperature, memory_used, clock_speed, fan_speed, power]
  memory:
    enabled: true
    metrics: [total_used, swap_used, page_faults]
  disk:
    enabled: true
    metrics: [read_bytes, write_bytes, iops, active_time]
  network:
    enabled: true
    metrics: [bytes_sent, bytes_recv, packets_sent, packets_recv, errors]
  power:
    enabled: true
    metrics: [voltage_rails, battery_rate, ac_status]
  thermal:
    enabled: true
    metrics: [zone_temperatures, fan_speeds, throttling_status]

detection:
  method: zscore              # Detection strategies: zscore | iqr | moving_average
  zscore_threshold: 3.5       # Number of standard deviations out before flagging
  iqr_multiplier: 1.5         # Outlier multiplier for Interquartile Range
  moving_avg_window: 60       # Sample size ceiling for moving analytical windows
  cooldown_period: 30         # Suppress rapid duplicate alerts on a single sensor (seconds)
  min_learning_samples: 1000  # Minimum raw checkpoints needed to declare baseline ready

alerts:
  console: true               # Direct warning output to stderr/stdout
  log_file: true              # Commit security alerts directly to structured disk storage
  desktop_notification: true  # Dispatch platform-native pop-up alerts
  sound: false                # Toggle warning frequencies
  log_path: "logs/alerts/"
  log_rotation: "daily"       # Partition options: daily | weekly | size
  max_log_size_mb: 100

storage:
  sensor_data_path: "data/sensor_readings/"
  baseline_path: "data/baselines/"
  retention_days: 30          # Purge old raw runtime data windows automatically

plugins:
  enabled: []
  directory: "plugins/"

response:
  scripts: {}                 # Bind specific triggers to run containment routines
📊 Output SystemConsole Telemetry Event (CLI)Plaintext[2026-06-23 14:32:07] 🟢 CPU Temp: 52°C (baseline: 48±4°C)  |  Load: 23%  |  Clock: 3.8 GHz
[2026-06-23 14:32:07] 🟢 GPU Temp: 61°C (baseline: 58±5°C)  |  VRAM: 2.1/8 GB  |  Fan: 45%
[2026-06-23 14:32:07] 🟢 Memory: 4.2/8.0 GB (baseline: 3.8±0.8 GB)
[2026-06-23 14:32:07] 🟢 Disk I/O: R: 12 MB/s  W: 5 MB/s  |  IOPS: 340

[2026-06-23 14:32:08] 🔴 ALERT [HIGH] — CPU Temperature Anomaly Detected
  Sensor:    cpu_temperature
  Value:     89°C
  Baseline:  48±4°C
  Z-Score:   10.25
  Possible:  Covert cryptocurrency mining, thermal stress vectors, sensor spoofing
  Action:    Audit running processes; inspect high-compute process hierarchies immediately
Event Log Snapshot (JSON Format)JSON{
  "timestamp": "2026-06-23T14:32:08.412Z",
  "alert_id": "ALT-20260623-0042",
  "severity": "HIGH",
  "category": "thermal_anomaly",
  "sensor": "cpu_temperature",
  "value": 89.0,
  "baseline_mean": 48.2,
  "baseline_std": 4.1,
  "z_score": 10.25,
  "possible_threats": [
    "Covert cryptocurrency mining",
    "Thermal stress attack",
    "Sensor data spoofing"
  ],
  "system_state": {
    "top_processes_by_cpu": ["unknown_miner.exe (87%)", "system (5%)"],
    "active_connections": 12,
    "usb_devices_changed": false
  }
}
🔍 Threat Scenarios MappingThreat VectorIntercepting SensorsTarget Heuristic Metric IndicatorCryptojackingCPU/GPU Temperature, Core Load, Power DrawSustained compute spike matching no active explicit user workspace contextBadUSB / Rubber DuckyPeripheral bus mappings, System Disk I/OInstant device authorization swap followed by localized burst file modificationFirmware Mod / ImplantSystem Power Rails, Boot Initialization DurationUncharacteristic runtime power-draw variances across sensor control chipsDMA Exploit VectorsActive Virtual Memory space, Peripheral pathsSudden unpredictable changes in restricted RAM bounds combined with device signalingData ExfiltrationNetwork interfaces, Storage I/O sweepsInverted ratio thresholds (Massive block read rates paired with high outgoing bandwidth)Ransomware MappingDisk Event Queue, Storage Write I/OAbnormal frequency loop over file trees with continuous storage modifications🧩 Plugin ImplementationAdd unique modular tracking policies directly to the runtime:Python# plugins/custom_detector.py
from hitm.plugin_base import PluginBase, SensorReading

class CustomDetector(PluginBase):
    name = "custom_anomaly_detector"
    description = "Example blueprint for tailor-made hardware verification checks"
    version = "1.0.0"

    def initialize(self, config):
        self.threshold = config.get("threshold", 85.0)

    def analyze(self, readings: list[SensorReading]) -> dict | None:
        for reading in readings:
            if reading.sensor == "cpu_temperature" and reading.value > self.threshold:
                return {
                    "alert": True,
                    "severity": "MEDIUM",
                    "message": f"Custom temperature ceiling crossed: {reading.value}°C",
                    "category": "custom_rule"
                }
        return None
Activate the plugin inside config.yaml:YAMLplugins:
  enabled:
    - custom_detector
  directory: "plugins/"
📁 Project StructurePlaintextHardware-Integrated-Threat-Monitor--local/
├── hitm.py                    # Main infrastructure boot coordinator
├── config.example.yaml        # Standard boilerplate configuration mapping
├── requirements.txt           # Active framework requirements dependencies
├── LICENSE                    # MIT Legal Policy Document
├── README.md                  # System Documentation handbook
│
├── core/
│   ├── __init__.py
│   ├── monitor.py             # Dedicated primary polling cycle orchestrator
│   ├── baseline.py            # Baseline profiling arithmetic module
│   ├── detector.py            # Logic evaluation matrix processor
│   └── alert_manager.py       # Handler for notifications and logging channels
│
├── sensors/
│   ├── __init__.py
│   ├── cpu.py                 # Core telemetry sensor suite
│   ├── gpu.py                 # GPU sensor array processor
│   ├── memory.py              # Operational memory monitoring scripts
│   ├── disk.py                # Disk tracking suite
│   ├── network.py             # Interface analyzer pipeline
│   ├── power.py               # Electrical signal analytics hub
│   └── thermal.py             # Continuous thermal tracking system
│
├── ui/
│   ├── __init__.py
│   ├── cli.py                 # Command line dashboard controller
│   ├── gui.py                 # Graphics engine interface dashboard
│   └── dashboard_components.py
│
├── plugins/
│   ├── __init__.py
│   └── plugin_base.py         # Parent architecture class blueprint
│
├── utils/
│   ├── __init__.py
│   ├── stats.py               # Specialized arithmetic modules
│   ├── logger.py              # Thread-safe system event logger
│   └── helpers.py
│
└── tests/
    ├── __init__.py
    ├── test_detector.py
    └── test_sensors.py
🧪 Development & Quality AssuranceRun Test FrameworksBash# Execute standard suite
python -m pytest tests/ -v

# Run verification with functional coverage tracking
python -m pytest tests/ --cov=core --cov=sensors --cov-report=html
Format and Style VerificationBash# Uniform layout linting
pip install black isort flake8
black .
isort .

# Run structural diagnostics
flake8 core/ sensors/ --max-line-length=100
🤝 ContributingContributions are welcome! Please follow these structured development steps:Fork the codebase repository.Spin up a designated features workspace: git checkout -b feature/your-feature-name.Apply focused modifications with atomic, descriptive git commit logs.Push target updates upward: git push origin feature/your-feature-name.Initiate a comprehensive Pull Request explicitly defining structural improvements.⚖️ LicenseDistributed under the terms of the MIT License. Check out LICENSE for structural text parameters.🙏 Acknowledgementspsutil — Cross-platform infrastructure hardware abstraction layers.LibreHardwareMonitor / OpenHardwareMonitor — Extended hardware telemetry interface libraries for Windows targets.lm-sensors — Linux kernel environment hardware diagnostic controls.⚠️ DisclaimerThis tool is provided strictly for educational, research, and defensive infrastructure validation functions. The author maintains zero legal liability or responsibility for potential infrastructure interruptions, platform service complications, or hardware maintenance problems stemming from system use. Validate baselines within insulated dev structures before launching active system deployments.Built with 🔒 by PrimeEmre↑ Back to Top
