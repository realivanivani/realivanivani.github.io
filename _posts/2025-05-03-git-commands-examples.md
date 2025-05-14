---
title: 'I Always Forget Git Commands, so I Made This Cheat Sheet for Data Science Collaboration'
date: 2025-05-03
permalink: /posts/2025/05/blog-post-1/
tags:
  - git
  - command-line
  - collaboration
  - examples
  - basics
---

As a data scientist who is supposed to be working closely with developers, I constantly find myself forgetting Git commands, especially when switching between feature branches, stashing changes, or pushing to remotes. While Git is integrated into **VSCode** and offers a visual module for staging, committing, and syncing, I still **prefer the command line**. It gives me more control and a clearer understanding of what's happening under the hood.

This post is a practical reference with Git commands I use (or forget to use) when working in a collaborative, multi-developer environment. Whether you're tracking changes in a Jupyter notebook, resolving merge conflicts in a data pipeline, or reviewing a colleague's commit history, this guide will help you keep your workflow clean and efficient. I’ll keep referring to this blog every time I forget to rebase properly. Hopefully, it’ll help you too.

![image](https://github.com/user-attachments/assets/b468597e-ea2d-49e9-a1d1-0b6528b451ab)

---

## 🛠️ **Setting Up and Configuration**

**Use when starting Git for the first time or setting up on a new machine.**

You’ll want Git to associate commits with your name and email so your work is correctly tracked across the project history.

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global alias.st status   # Optional: shorthand for `git status`
```

To initialize a Git repo in a new project:

```bash
git init
```

---

## **Getting a Project: Cloning from Remote**

**Use when joining a team project or syncing from GitHub/GitLab.**

```bash
git clone https://github.com/org/project.git
cd project
```

---

## 📋 **Basic Workflow: Status, Stage, Commit**

**Use in your daily work—after changing files.**

```bash
git status                      # See what’s changed
git add <filename>             # Stage a specific file
git add .                      # Stage all changes
git commit -m "Short, clear message"  # Commit your changes
git log                        # View commit history
```

---

## 🌱 **Branching and Merging**

**Use to isolate features, experiments, or fixes from the main line of development.**

```bash
git branch                     # List all branches
git branch <new-branch>       # Create new branch
git checkout <branch>         # Switch to branch
git checkout -b <new-branch>  # Create and switch
git merge <branch>            # Merge into current branch
git branch -d <branch>        # Delete branch
```

**Example:** Working on a new feature without touching the main model:

```bash
git checkout -b model-tuning
```
![image](https://github.com/user-attachments/assets/5655efc1-2b05-4541-bfb7-46f5343c85ed)

---

## **Remote Repositories**

**Use to collaborate via GitHub/GitLab/Bitbucket.**

```bash
git remote add origin https://github.com/org/project.git
git remote                   # List remotes
git push origin main         # Push local changes to remote
git pull origin main         # Pull latest changes from remote
```

---

## ⏪ **Undoing Changes and Recovery**

**Use to backtrack, undo mistakes, or clean your working directory.**

```bash
git reset                     # Unstage files
git reset --hard              # Reset working directory and staging
git revert <commit>           # Safely undo a specific commit
git reflog                    # Recover lost commits or branches
```

---

## 🔍 **Collaboration and Inspection Tools**

**Use when reviewing others’ work or debugging.**

```bash
git blame <file>             # See who changed what and when
git diff                     # Show line-level differences
git fetch                    # Sync without merging
```

---

## 🧹 **Repository Maintenance**

**Use periodically to clean, check, or recover.**

```bash
git fsck                     # Check for corruption
git gc                       # Cleanup unnecessary files
git reflog                   # See full history of HEAD changes
```

---

## **Final Example: Collaborative Model Deployment Flow**

Here’s a summarized Git workflow for a typical team scenario:

```bash
# Start from the main branch and pull latest
git checkout main
git pull origin main

# Create a new feature branch for model training
git checkout -b churn-model

# Work on churn_model.py and churn_model.pkl
git add churn_model.py churn_model.pkl
git commit -m "Add churn model v1 with preprocessing pipeline"

# Push the feature branch for review
git push origin churn-model

# After code review and approval
git checkout main
git pull origin main
git merge churn-model
git push origin main

# Clean up
git branch -d churn-model
```

---

## **One more example: Working Locally on a Private Project**

**Use when you start a local project and want to back it up or share it later by connecting to GitHub.**

Imagine you’re starting a new machine learning model on your laptop. You want to keep it private for now, but still version-controlled and eventually push it to a private GitHub repo.

### **Step-by-step: Local to GitHub (private)**

1 . **Initialize Git inside your project folder**:

```bash
cd ~/projects/customer-churn
git init
```

2 . **Add and commit your files**:

```bash
git add .
git commit -m "Initial commit: data prep and baseline model"
```

3 . **Create a private repo on GitHub**
   Go to [github.com](https://github.com) → Click **“New Repository”** →
   Name it (e.g., `customer-churn`) → **Set it to Private** → **Do NOT initialize with README** (you already did that locally).

4 . **Connect your local repo to GitHub**:

```bash
git remote add origin https://github.com/yourusername/customer-churn.git
```

5 . **Push your local repo to GitHub**:

```bash
git push -u origin main
```

Now your private project is **safe, backed up, and shareable** when needed.

---

## ✅ **Conclusion**

Git helps you **track, collaborate, and experiment** without losing work or overwriting others’ changes. Whether you're building machine learning pipelines, cleaning data, or pushing notebooks to production, Git is your friend.

I’ll keep referring to this blog every time I forget to rebase properly. Hopefully, it’ll help you too.

