---
title: 'The Lost Art of Testing Code in the Age of LLMs and Vibe-Coding'
date: 2025-05-31
permalink: /posts/2025/05/blog-post-3/
tags:
  - testing
  - LLMs
  - vibe-coding
  - pytest
  - VSCode
  - python
--- 

Here’s a revised version that keeps the structure, links, and technical content intact, but smooths the language so it reads like a knowledgeable practitioner explaining things naturally and thoughtfully.

---

Santiago Valdarrama recently called out a trend many of us have felt firsthand: serious testing is quietly slipping out of software development. [As he noted](https://www.linkedin.com/posts/svpino_theres-an-epidemic-of-people-building-software-activity-7326222829912211456-A06k/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAIsDd8BXWI_dI37Qu6FG4V1q4VYwEscMcc), we’re in an age of *impressive demos*, where slick presentations often matter more than whether the code is actually solid. This shows up especially when working with Large Language Models (LLMs) or doing what’s commonly called “vibe-coding”—an exploratory, trial-and-error style of writing code.

There’s no denying that LLMs and rapid prototyping can speed things up dramatically. But they also add a layer of unpredictability. Without proper testing, it becomes very easy to ship something that looks fine but behaves unreliably. The real question, then, is how we stay confident in our code. The answer isn’t complicated: disciplined testing practices still matter—arguably more than ever—especially when AI tools are in the mix.

![image](https://github.com/user-attachments/assets/4ddd16d0-6e11-4a24-b9f4-9faed0e6fa5d)

---

## Why Testing Matters More Than Ever

With LLM-generated code, correctness can’t be assumed. The output may look reasonable and even pass a quick manual check, yet fail in subtle or edge-case scenarios. Manually verifying everything doesn’t scale, which is why automated testing becomes essential rather than optional.

### Key Testing Principles:

1. **Assume it’s broken until proven otherwise** – Treat LLM output as a draft, not a guarantee.
2. **Test early and often** – Problems are easier to fix before they spread through the codebase.
3. **Automate as much as possible** – Manual checks are slow, inconsistent, and easy to miss.

## Setting Up Tests in VS Code

VS Code makes it relatively painless to build testing into your day-to-day workflow. Here’s a straightforward way to get started:

### 1. Choose a Testing Framework

* **Python**: `pytest` (lightweight, expressive, widely adopted)
* **Java**: `JUnit`
* **JavaScript/TypeScript**: `Jest` or `Mocha`

Install your framework using the relevant package manager (for example, `pip install pytest` or `npm install jest`).

### 2. Configure VS Code for Testing

* Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
* Search for **“Python: Configure Tests”** (or the equivalent for your language).
* Select your framework (e.g., `pytest`).
* VS Code will then auto-detect and run tests directly from the editor.

### 3. Write Your First Test

For example, using Python with `pytest`:

```python
# test_example.py  
def add(a, b):  
    return a + b  

def test_add():  
    assert add(2, 3) == 5  
    assert add(-1, 1) == 0  
```

You can run tests by:

* Clicking **Run Tests** in VS Code’s testing sidebar, or
* Using the terminal: `pytest test_example.py`

### 4. Test LLM-Generated Code Thoroughly

Since LLMs can introduce subtle inconsistencies, edge cases deserve extra attention:

```python
def test_add_edge_cases():  
    # Test zero, negative, large numbers  
    assert add(0, 0) == 0  
    assert add(-5, -3) == -8  
    assert add(1e6, 2e6) == 3e6  
```

---

## Documenting and Saving Tests

Tests only add value if they’re easy to understand and kept up to date. A bit of structure goes a long way.

### 1. Follow a Clear Structure

```
project/  
├── src/  
│   └── your_code.py  
└── tests/  
    ├── test_unit.py  
    └── test_integration.py  
```

### 2. Use Descriptive Test Names

* Bad: `test1()`
* Good: `test_user_login_fails_with_invalid_password()`

### 3. Document Test Intentions

Short comments explaining *why* a test exists can save time later:

```python
# This test ensures the API handles null inputs gracefully  
def test_api_null_input():  
    response = call_api(None)  
    assert response.status_code == 400  
```

### 4. Version Control Your Tests

* Commit tests alongside the code they validate.
* Use clear, purposeful commit messages, such as:

  * `"Add tests for user authentication"`
  * `"Fix edge case in payment processing (with regression test)"`

---

## Automating Test Execution: Ensuring Reliability at Every Stage

Automation is the backbone of reliable testing. Manually running tests doesn’t scale, and it’s easy to forget. When tests are part of the pipeline, quality checks happen automatically—before code ever reaches production.

### 1. **Pre-commit Hooks: Catch Errors Early**

* **What it does**: Runs tests before a Git commit is finalized, blocking commits if tests fail.
* **Tools**:

  * **Python**: `pre-commit` (`pip install pre-commit`) with `.pre-commit-config.yaml`:

    ```yaml
    repos:
      - repo: local
        hooks:
          - id: pytest
            name: Run tests
            entry: pytest
            language: system
            stages: [commit]
    ```
  * **JavaScript**: `Husky` (`npm install husky --save-dev`), configured in `package.json`:

    ```json
    "husky": {
      "hooks": {
        "pre-commit": "npm test"
      }
    }
    ```
* **Why it matters**: Broken code never even makes it into the repository.

### 2. **CI/CD Pipelines: Gatekeeping Deployment**

* **What it does**: Automatically runs tests on every push or pull request.
* **Implementation**:

  * **GitHub Actions** (`.github/workflows/tests.yml`):

    ```yaml
    name: Run Tests
    on: [push, pull_request]
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - name: Set up Python
            uses: actions/setup-python@v5
            with:
              python-version: '3.11'
          - name: Install dependencies
            run: pip install -r requirements.txt
          - name: Run tests
            run: pytest
    ```
  * **GitLab CI** (`.gitlab-ci.yml`):

    ```yaml
    test:
      image: python:3.11
      script:
        - pip install -r requirements.txt
        - pytest
    ```
* **Why it matters**: Every contribution, from every team member, is held to the same standard.

---

### **System Design: Where Testing Fits In**

In a scalable system, testing isn’t a single step—it’s layered throughout the architecture:

1. **Local Development**

   * Pre-commit hooks serve as the first line of defense.
   * Developers run tests directly from VS Code or the CLI.

2. **Version Control**

   * CI pipelines trigger on pull requests and block merges on failure.
   * Tests run in clean, isolated environments.

3. **Pre-Deployment**

   * CD pipelines execute smoke and integration tests.
   * Rollbacks trigger automatically if something goes wrong.

4. **Monitoring (Post-Deployment)**

   * **Synthetic monitoring** simulates real user behavior.
   * **A/B testing** compares new and existing versions in production.

#### **Example Architecture Diagram**:

```plaintext
Developer Laptop (VS Code)  
│  
├── Pre-commit Hook → Fail → Fix code  
│                       └── Pass → Git Commit  
│  
└── CI Server (GitHub/GitLab)  
    │  
    ├── Unit Tests → Fail → Notify team  
    │               └── Pass →  
    │  
    └── Integration Tests → Fail → Block Merge  
                           └── Pass → Merge to Main  
│  
CD Pipeline (AWS/GCP/K8s)  
│  
├── Deployment → Post-Deploy Tests → Fail → Rollback  
│                           └── Pass → Traffic Shift  
│  
└── Monitoring → Alerts → Hotfix  
```

---

### **Key Takeaways**

* **Pre-commit hooks** catch issues before code is shared.
* **CI/CD pipelines** are essential for safe collaboration and deployment.
* **Testing should be designed into the system**, not bolted on later.

---

## Final Thoughts

LLMs and vibe-coding can dramatically speed up development, but they don’t remove the need for strong testing discipline. Treat automated tests as first-class citizens in your workflow. When tests run at every stage, unpredictability—especially from AI-generated code—becomes something you can measure, manage, and control rather than something you hope won’t break in production.


