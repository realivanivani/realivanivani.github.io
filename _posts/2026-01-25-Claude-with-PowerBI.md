---
title: 'The "Agentic" Shift: Moving Beyond Copy-Paste Analytics'
date: 2026-01-25
permalink: /posts/2026/01/blog-post-3/
tags:
  - PowerBI
  - MCP
  - Claude
  - VSCode
  - Agentic
  - Analytics
---
We are entering the age of **Agentic Analytics**. As I've recently written in my previous 2 posts, with the introduction of the **Model Context Protocol (MCP)**, we’ve moved from "chatting about data" to "deploying agents into our models." Imagine an AI that doesn't just suggest a formula, but actually opens your `.pbix` file, creates your measures, organizes your folders, hides your technical keys, and writes your documentation—all while you watch.

This blog explores the technical "how-to" of setting up this bridge using **Claude Desktop** and **VS Code**, along with the specific prompts that can turn a four-hour modeling session into a five-minute conversation.

<img width="1024" height="490" alt="image" src="https://github.com/user-attachments/assets/3ea65a11-a25a-4c6d-b521-15038f3348f7" />

---

### The Architecture of the Bridge

To understand why this is a breakthrough, you have to look at the MCP as the plumbing thta serves as plug to a specialized "server" into your Power BI Desktop instance that gives the AI a direct API into the semantic model.

This connection allows the AI to perform the discovery and identify the relationships itself, ensuring the DAX it writes isn't just mathematically correct, but contextually accurate for your specific star schema. You can read more about it in my previous posts. Let's dive into how Claude Desktop can work on your PowerBI dahsboard. 

---

# Chapter 1: Detailed Setup Guide for Claude Desktop

This chapter details the exact technical steps required to get the **Claude Desktop App** talking to your local Power BI file. This is currently the most robust method for running MCP.

### 1. Prerequisites

Before modifying configurations, ensure you have the following installed:

* **Visual Studio Code (VS Code)**
* **Claude Desktop App** (Windows version)
* **Power BI Desktop** (Running with a file open)

### 2. Installing the MCP Server Extension

1. Open **Visual Studio Code**.
2. Navigate to the **Extensions** tab (square icon on the left).
3. Search for: `Power BI Modeling MCP Server`.
4. Click **Install**.

### 3. Locating the Server Executable ("The Magic Sauce")

To configure Claude, you need the exact file path to the extension you just installed.

1. Navigate to your VS Code extensions folder. On Windows, paste this path into your file explorer address bar:
`%USERPROFILE%\.vscode\extensions`
2. Look for a folder named something like `powerbi-modeling-mcp...`
3. Open that folder, then open the `server` folder inside it.
4. Find the file `powerbi-modeling-mcp.exe` (or just the Application file).
5. **Right-click** and select **"Copy as path"**. Save this; you will need it for the config file.

### 4. Configuring Claude Desktop

1. Open **Claude Desktop**.
2. Go to `Settings` -> `Developer`.
3. Click **Edit Config**. This will open a configuration JSON file (likely in Notepad or VS Code).
4. You need to add the Power BI server to the `mcpServers` block.
5. **Critical Syntax Rule:** When pasting your file path, you must replace all single backslashes (`\`) with double backslashes (`\\`) for the JSON to work.

**Configuration Template:**

```json
{
  "mcpServers": {
    "powerbi": {
      "command": "C:\\Users\\YourName\\.vscode\\extensions\\powerbi-modeling-mcp-server\\server\\powerbi-modeling-mcp.exe",
      "args": [],
      "env": {}
    }
  }
}

```

### 5. The Connection Handshake

1. **Restart** your computer (or fully quit Claude and VS Code) to apply changes.
2. Open **Power BI Desktop** and load your report.
3. Open **Claude Desktop**.
4. Type the initial connection prompt:
> *"Connect to the open Power BI desktop file."*


5. Claude should confirm it sees the file and is ready to work.

---

# Chapter 2: The 7 "Game-Changing" Prompts & How to Use Them

Once connected, the value of MCP comes down to **Prompt Engineering**. Unlike standard chatbots, these prompts trigger actual changes in your model. Below are the seven essential prompt categories demonstrated in the workflow.

### 1. The Architect Prompt (Bulk Measure Creation)

**Use Case:** Rapidly building the foundation of your model without writing individual DAX formulas.
**The Prompt:**

> *"Create a new empty table to hold calculations. Create an aggregate amount calc for every sales status value returned or sold. Create a net sales calc and also create a comprehensive group of monthly time intelligence measures for all measures created."*
> **Why it works:** It combines structural changes (creating a table) with logic generation (DAX), saving 30-60 minutes of repetitive coding.

### 2. The Standardization Prompt (Naming Conventions)

**Use Case:** Fixing "developer names" (e.g., `dim_Cust_v2`) into "business names" before users see them.
**The Prompt:**

> *"Analyze my model's naming conventions and suggest renames to ensure consistency."*
> **Follow up:** *"Rename everything."*
> **Why it works:** AI is excellent at pattern recognition. It detects camelCase vs. snake_case inconsistencies and unifies them instantly across the entire model.

### 3. The Organizer Prompt (Display Folders)

**Use Case:** Cleaning up the "Fields" pane so users don't see a wall of 50 unorganized columns.
**The Prompt:**

> *"Add display folders to organize fields better."*
> **Why it works:** It analyzes the semantic meaning of your fields (putting "City" and "Country" into a *Location* folder) without you needing to drag-and-drop manually.

### 4. The Hygiene Prompt (Hiding Keys)

**Use Case:** Preventing users from using ID columns in visuals, which usually leads to bad performance and incorrect counts.
**The Prompt:**

> *"Hide all foreign key columns."*
> **Why it works:** It scans relationships to identify the keys used for joining tables and hides them from the report view automatically.

### 5. The "Data Dictionary" Prompt (Metadata Injection)

**Use Case:** Populating the `Description` property in Power BI, which powers the "hover-over" tooltips for users.
**The Prompt:**

> *"Add descriptions to all measures, columns, and tables to clearly explain their purpose and explain the logic behind the DAX code in simple understandable terms."*
> **Why it works:** This is a task developers rarely do because it's tedious. The AI reads the DAX code and reverse-engineers a plain-English explanation for the business user.

### 6. The User Experience Prompt (Hierarchies)

**Use Case:** Enabling "drill-down" features in charts (e.g., Year -> Quarter -> Month).
**The Prompt:**

> *"Create user hierarchies for drill down navigation."*
> **Why it works:** It identifies natural parent-child relationships (Category -> Subcategory -> Product) and builds the hierarchy objects for you.

### 7. The Performance Prompt (Optimization)

**Use Case:** Reducing the file size and memory footprint of your model.
**The Prompt:**

> *"Analyze my data types and optimize them for better compression and performance. Change them as needed."*
> **Why it works:** It looks for high-cardinality columns or inappropriate data types (like storing a simple ID as a heavy text string) and converts them to the most efficient format.

---

# Chapter 3: Generating the Final Documentation

Now this is important. Every good analytical solution has a proper documentation. The final piece of the workflow is extracting the work out of Power BI into a shareable format for stakeholders.

**The "Artifact" Prompt:**

> *"Generate a markdown document that provides complete professional documentation for a Power BI semantic model including a data dictionary. Use a simple mermaid diagram to illustrate the table relationships. Document each measure including the DAX code and a description of the business logic."*

**Outcome:**
Instead of modifying the PBIX file, this prompts Claude to write a **Artifact** (a standalone file) containing:

* A visual Entity Relationship Diagram (Mermaid code).
* A full table of contents.
* Definitions for every metric.

---
# References

### **Primary References (Video Tutorials)**

See the video tutorial on Power BI Bro's page 
**"Claude + Power BI Integration 🧠 MASSIVE Breakthrough via MCP 💥"** – *Power BI Bro (Nov 2025)*.
* **Focus:** A technical walkthrough on connecting Claude Desktop to Power BI via an MCP server. It provides 7 game-changing prompt strategies for bulk measure creation, model hygiene, and automated documentation.
* [Watch on YouTube](https://www.youtube.com/watch?v=jDSoSJz4ams)

### **Technical & Official Documentation**

**Model Context Protocol (MCP) Official Site**
* This is the open standard developed by Anthropic that allows AI models to connect to data sources and tools.
* [MCP Specification & Introduction](https://modelcontextprotocol.io/introduction)

**GitHub: Power BI Modeling MCP Server**
* The open-source repository for the specific server used in the video tutorials. It contains the executable and the `config.json` examples for Claude and VS Code.
* [View Repository](https://www.google.com/search?q=https://github.com/microsoft/powerbi-modeling-mcp-server) *(Note: Ensure you are using the latest version from the official Microsoft/Partner source).*

### **Privacy & Governance Resources**

**Anthropic Trust Center**
* Crucial for understanding how Claude handles data, particularly the differences between Free, Pro, and Enterprise plans regarding model training.
* [Claude Privacy & Security Policies](https://www.google.com/search?q=https://www.anthropic.com/trust)
