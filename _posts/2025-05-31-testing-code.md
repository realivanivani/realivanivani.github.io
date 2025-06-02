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

## Automating Test Execution  

1. **Pre-commit Hooks** (via `pre-commit` or Husky): Run tests before git commits.  
2. **CI/CD Pipelines** (GitHub Actions, GitLab CI): Ensure tests pass before deployment.  

---
## Final Thoughts  

LLMs and vibe-coding can speed up development, but they don’t replace the need for rigorous testing. By integrating automated tests into your workflow—and treating them as first-class citizens in your codebase—you ensure reliability, even in an unpredictable AI-assisted world.  

Start small: write one test today. Over time, make testing a non-negotiable part of your process. Your future self (and your users) will thank you.  

---  
*Inspired by Santiago Valdarrama’s post on LinkedIn. Read the original [here](https://www.linkedin.com/...).*
