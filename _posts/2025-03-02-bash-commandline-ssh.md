---
title: 'Automating Insight: Bash Scripting, Command-Line Power Tools, and Data Querying'
date: 2025-04-10
permalink: /posts/2025/04/blog-post-2/
tags:
  - data architecture
  - scripting
  - bash shell
  - command-line
  - ssh
  - remote access
  - cluster
---

Behind every robust data pipeline or analytics project lies a powerful foundation of automation and efficient data handling. While high-level tools like SQL engines and data visualization platforms get much of the spotlight, it's often the low-level tools—like Bash scripts, `rsync`, `find`, and others—that keep the data world running smoothly.  

During my PhD, I learned to rely on these command-line utilities to wrangle vast simulation outputs across distributed file systems. Today, while I focus more on SQL querying and performance optimization in manufacturing and analytics roles, I still appreciate how powerful shell scripting and CLI tools can be—especially when paired with intelligent data querying strategies.

This post covers the fundamentals of **Bash scripting**, **essential CLI tools** (`find`, `du`, `rsync`, `robocopy`, `rclone`), **ssh & remote access**, and **SQL/data querying**, with practical examples from both academic and industry use cases.

![image](https://budgetvm.com/wp-content/uploads/2021/06/c1.gif)

---

### 🖥️ Bash Shell Scripting: Automating Everything

**Why Bash?**  
When I got into the world of computational biology, UNIX was the default and Bash is the glue of the UNIX world. It’s lightweight, fast, and ideal for automating repetitive data and file operations.

#### Example: Batch Converting Simulation Files
During my PhD, I often needed to convert dozens of molecular dynamics output files into analysis-ready formats:

```bash
#!/bin/bash
for file in *.xtc; do
    echo "Processing $file"
    gmx trjconv -f "$file" -o "${file%.xtc}.pdb" -s topol.tpr
done
```

**What it does**: Loops through every `.xtc` file and uses `gmx trjconv` to convert it to `.pdb`, referencing the same topology file. Saves hours of manual work.

**Tips**:
- Combine with `cron` to schedule regular tasks.
- Use `set -e` for safety (abort on error).
- Integrate with email notifications (`mailx`) to track jobs.

---

### 🔧 Command-Line Power Tools

These tools are indispensable for data engineering, systems maintenance, and data migration. I used them regularly to check on the running simulations and monitor their size and disk usage.

#### `find`: Recursively locate files with filters

```bash
find /data/trajectories -name "*.xtc" -size +500M
```
**Use case**: Identify large simulation files to archive or compress.

#### `du`: Disk usage diagnostics

```bash
du -sh /data/trajectories/*
```
**Use case**: Summarize storage consumption for cost estimation or cleanup.

#### `rsync`: Fast, delta-based file synchronization

```bash
rsync -avh /data/simulations/ user@remote:/backup/simulations/
```
**Use case**: Sync large datasets between local HPC clusters and backup servers.

#### `robocopy`: Windows alternative to `rsync`

```cmd
robocopy C:\Data D:\Backup /MIR /Z /LOG:copylog.txt
```
**Use case**: I used this during my humanitarian field deployments to replicate large data folders over fragile network connections.

#### `rclone`: Cloud-native data sync tool

```bash
rclone sync /local/datalake s3:my-bucket/backup --progress
```
**Use case**: Cloud backup of processed manufacturing data, critical for cost-efficient archiving.

---

### 🔐 SSH & Remote Access: Gateways to Distributed Infrastructure

When working with large datasets, HPC clusters, or remote data lakes, **SSH (Secure Shell)** becomes an essential tool. It enables secure remote login and command execution, allowing data scientists and engineers to interact with powerful computing resources from virtually anywhere.

#### 📡 Typical Use Case: Accessing Simulation Clusters

During my PhD, much of my molecular dynamics simulation work was executed on university clusters or shared computing environments (like MareNostrum supercomputer on BSC institute). SSH was the standard interface for compiling jobs, monitoring storage, and managing batch scripts.

```bash
ssh username@bsc.es
```

Once connected, I would navigate to scratch or project-specific directories and use tools like `sbatch`, `top`, or custom Bash scripts to manage simulations.

#### 🔁 File Transfer: `scp` and `rsync` over SSH

Remote access isn't just about logging in—it’s also about moving data.

```bash
# Copy results from remote cluster to local machine
scp username@cluster:/home/user/results/*.xtc ./local_results/
```

Or more efficiently:

```bash
rsync -avz username@cluster:/home/user/results/ ./local_results/
```

With `rsync`, only changed parts of files are transferred—critical when dealing with large or frequently updated datasets.

#### 🧠 SSH Tunneling: Secure Access to Remote Services

Need to access a remote Jupyter Notebook or database behind a firewall?

```bash
ssh -L 8888:localhost:8888 username@cluster.university.edu
```

This tunnels port `8888` from the cluster to your local machine—allowing you to securely open web-based tools or even forward access to PostgreSQL or Redshift endpoints.

#### 🔑 Pro Tip: SSH Config File

To streamline repetitive logins and port forwards:

```bash
# ~/.ssh/config
Host mycluster
  HostName cluster.university.edu
  User username
  IdentityFile ~/.ssh/id_rsa
  Port 22
  ForwardX11 yes
```

Now, logging in is as easy as:

```bash
ssh mycluster
```

### RSA key-based authentication

A very useful thing is having automized ssh logging by using the ssh-keygen tool to create a key pair. Check this [webpage](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server) to see how to setup rsa key.

---

### How It All Ties Together

SSH enables:
- Secure access to *data lakes and raw files* stored on cloud VMs or on-prem servers
- Remote execution of *ETL pipelines or simulation scripts*
- Tunneling for *BI tools or Jupyter access to protected environments*
- Integration with `rsync`, `rclone`, or `scp` to automate transfers

---

SSH remains a timeless tool in modern data work, especially when paired with Bash scripts or orchestrated through job schedulers like `SLURM` or `Airflow`. In my current manufacturing role, it continues to be a bridge between on-premise equipment data and centralized analytics layers.

---

### 🧩 SQL & Data Query Tools: Structured Insights at Scale

While CLI tools handle files, SQL is still king for structured data. I've published several posts (check out my previous blog posts) on SQL querying and optimization, focusing on:

- **JOIN strategies**
- **Window functions for time-series**
- **CTEs and subqueries for maintainability**
- **Partitioning and indexing to optimize performance**

#### Example: Manufacturing Defect Rate Analysis

```sql
WITH defect_summary AS (
  SELECT
    variant,
    COUNT(*) AS total_units,
    SUM(CASE WHEN defect_flag = TRUE THEN 1 ELSE 0 END) AS defective_units
  FROM production_data
  GROUP BY variant
)
SELECT
  variant,
  ROUND(100.0 * defective_units / total_units, 2) AS defect_rate
FROM defect_summary
ORDER BY defect_rate DESC;
```

**Use case**: Helps prioritize process improvements based on defect concentration by product variant.

#### Tools I’ve Used:
- **PostgreSQL, Redshift, Snowflake** in manufacturing
- **SQLite** for light-weight humanitarian data analysis
- **DBeaver & Azure Data Studio** for SQL interface flexibility

---

### 🧠 Reflections Across Domains

| Domain              | Tools/Tech                | Use Cases                                                   |
|---------------------|---------------------------|--------------------------------------------------------------|
| **PhD Research**     | Bash, ssh, `find`, `rsync`, SQLite | Batch processing simulation data, storage optimization        |
| **Humanitarian Ops**| `robocopy`, SQL, Excel CLI tools | Safe data replication, CRM querying in low-resource contexts |
| **Manufacturing**    | Bash, `rclone`, SQL, Redshift | Real-time data sync, dashboarding, lakehouse integration     |

---

### 🚀 Final Thoughts

Mastering shell scripting and command-line tools is often overlooked in favor of high-level programming—but in real-world data environments, these tools are indispensable. Whether you’re managing terabytes of trajectory data, syncing operational databases, or optimizing queries for analytics dashboards, these building blocks offer speed, control, and automation.

**If you're new to this world, start simple:**
- Automate a repetitive file task with Bash.
- Use `find` or `du` to explore hidden storage costs.
- Challenge yourself to improve an SQL query you use frequently.

---

**📚 Further Reading:**
- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [rclone Docs](https://rclone.org/docs/)
- [SQL Optimization Blog Series](https://realivanivani.github.io/posts/2025/02/blog-post-2/)

---
