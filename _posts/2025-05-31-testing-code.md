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

Santiago Valdarrama recently highlighted a worrying trend: the decline of rigorous testing in software development. [As he pointed out](https://www.linkedin.com/posts/svpino_theres-an-epidemic-of-people-building-software-activity-7326222829912211456-A06k/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAIsDd8BXWI_dI37Qu6FG4V1q4VYwEscMcc), we're living in an era of "impressive demos," where working code often takes a backseat to flashy presentations. This is especially true when working with Large Language Models (LLMs) or engaging in "vibe-coding"—writing code with an experimental, trial-and-error approach.  

While LLMs and rapid prototyping can accelerate development, they also introduce unpredictability. If we don’t test properly, we risk shipping unreliable software. So, how do we maintain confidence in our code? By embracing disciplined testing practices—even (or especially) when using AI-assisted tools.  

![image](https://github.com/user-attachments/assets/4ddd16d0-6e11-4a24-b9f4-9faed0e6fa5d)

---
## Why Testing Matters More Than Ever  

When working with LLMs, we can’t assume correctness. Generated code may look right but fail in subtle ways. Manual verification isn’t scalable, so automated testing becomes essential.  

### Key Testing Principles:  
1. **Assume it’s broken until proven otherwise** – Don’t trust LLM output blindly.  
2. **Test early and often** – Catch issues before they become entrenched.  
3. **Automate as much as possible** – Manual checks are error-prone.  

## Setting Up Tests in VS Code  

VS Code has excellent support for testing frameworks. Here’s how to integrate testing into your workflow:  

### 1. Choose a Testing Framework  
- **Python**: `pytest` (simple, powerful)  
- **Java**: `JUnit`  
- **JavaScript/TypeScript**: `Jest` or `Mocha`  

Install the framework via your package manager (e.g., `pip install pytest`, `npm install jest`).  

### 2. Configure VS Code for Testing  
- Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).  
- Search for "Python: Configure Tests" (or the equivalent for your language).  
- Select your framework (e.g., `pytest`).  
- VS Code will now detect and run tests automatically.  

### 3. Write Your First Test  
For example, in Python with `pytest`:  
```python
# test_example.py  
def add(a, b):  
    return a + b  

def test_add():  
    assert add(2, 3) == 5  
    assert add(-1, 1) == 0  
```  
Run tests by:  
- Clicking the "Run Tests" button in VS Code’s testing sidebar.  
- Or via terminal: `pytest test_example.py`  

### 4. Test LLM-Generated Code Thoroughly  
Since LLMs can produce inconsistent logic, write **edge-case tests**:  
```python
def test_add_edge_cases():  
    # Test zero, negative, large numbers  
    assert add(0, 0) == 0  
    assert add(-5, -3) == -8  
    assert add(1e6, 2e6) == 3e6  
```  
---
## Documenting and Saving Tests  

Tests are useless if they’re not maintained. Here’s how to keep them organized:  

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
- Bad: `test1()`  
- Good: `test_user_login_fails_with_invalid_password()`  

### 3. Document Test Intentions  
Add comments explaining *why* a test exists:  
```python
# This test ensures the API handles null inputs gracefully  
def test_api_null_input():  
    response = call_api(None)  
    assert response.status_code == 400  
```  

### 4. Version Control Your Tests  
- Commit tests alongside code changes.  
- Use meaningful commit messages:  
  - `"Add tests for user authentication"`  
  - `"Fix edge case in payment processing (with regression test)"`  

---
## Automating Test Execution: Ensuring Reliability at Every Stage  

Automation is the backbone of modern testing—manual test runs are slow, inconsistent, and prone to human error. By integrating tests into your development lifecycle, you enforce quality *before* code reaches production. Here’s how to implement it systematically:  

### 1. **Pre-commit Hooks: Catch Errors Early**  
   - **What it does**: Runs tests *before* a Git commit is finalized, blocking changes if tests fail.  
   - **Tools**:  
     - **Python**: Use `pre-commit` (install via `pip install pre-commit`). Configure `.pre-commit-config.yaml`:  
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
     - **JavaScript**: Use `Husky` (`npm install husky --save-dev`). Add to `package.json`:  
       ```json
       "husky": {
         "hooks": {
           "pre-commit": "npm test"
         }
       }
       ```  
   - **Why it matters**: Prevents broken code from ever entering your repository.  

### 2. **CI/CD Pipelines: Gatekeeping Deployment**  
   - **What it does**: Automatically runs tests on every push/PR, ensuring only passing code gets merged or deployed.  
   - **Implementation**:  
     - **GitHub Actions**: Create `.github/workflows/tests.yml`:  
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
     - **GitLab CI**: Define `.gitlab-ci.yml`:  
       ```yaml
       test:
         image: python:3.11
         script:
           - pip install -r requirements.txt
           - pytest
       ```  
   - **Why it matters**: Ensures *every* change, including collaborative ones, meets quality standards.  

---

### **System Design: Where Testing Fits In**  
In a scalable system, automated testing should be layered into the architecture:  

1. **Local Development**:  
   - Pre-commit hooks act as the *first line of defense*.  
   - Engineers run tests in VS Code (via IDE integrations or CLI).  

2. **Version Control**:  
   - CI pipelines trigger on PRs, blocking merges if tests fail.  
   - Tests run in isolated environments (Docker containers, VMs).  

3. **Pre-Deployment**:  
   - CD pipelines run *smoke tests* and *integration tests* before release.  
   - Rollback mechanisms activate if post-deployment tests fail.  

4. **Monitoring (Post-Deployment)**:  
   - **Synthetic monitoring**: Automated scripts simulate user flows in production.  
   - **A/B testing**: Compare behavior of new vs. old versions.  

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

- **Pre-commit hooks** save time by catching issues *before* code is shared.  
- **CI/CD pipelines** are non-negotiable for team collaboration and deployment safety.  
- **Design testing into your system**—not as an afterthought, but as a core workflow gate.  

---
## Final Thoughts  

LLMs and vibe-coding can speed up development, but they don’t replace the need for rigorous testing. By integrating automated tests into your workflow—and treating them as first-class citizens in your codebase—you ensure reliability, even in an unpredictable AI-assisted world. By automating tests at every stage, you turn unpredictability (especially from LLMs) into controlled, measurable risk. 
---  
*Inspired by Santiago Valdarrama’s post on LinkedIn. Read the original [here](https://www.linkedin.com/...).*
