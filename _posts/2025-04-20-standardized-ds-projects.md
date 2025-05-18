---
title: 'Level Up Your Data Science Workflow: Standardizing Projects with Cookiecutter and Git'
date: 2025-04-20
permalink: /posts/2025/04/blog-post-2/
tags:
  - portfolio
  - data science
  - git
  - coockiecutter
  - kedro
---

I'm in the job hunting mode at the moment and one thing has become crystal clear: presenting a portfolio of projects in a clean, professional, and industry-standard format is crucial. My own journey of wrangling personal projects – juggling data, code, notebooks, models, and results – highlighted the need for better organization and reproducibility. How do you transform scattered scripts and notebooks into something easily understandable and verifiable by potential employers or collaborators? The answer lies in standardized project structures and robust version control.

This realization led me to explore tools and best practices, and this post shares what I've learned. We'll dive into how to use Cookiecutter, specifically the popular cookiecutter-data-science template, to structure data science projects effectively. We'll cover managing these projects with Git, discuss essential components like the README.md and requirements.txt, and briefly touch upon Kedro as another powerful framework. Let's build portfolios that impress!

<img width="965" alt="image" src="https://github.com/user-attachments/assets/47065e52-e37e-4925-ad06-d47d1ab3fa33" />

### What is Cookiecutter?

Cookiecutter is a simple command-line tool that creates projects from project templates (called "cookiecutters"). Instead of manually creating directories and boilerplate files every time you start a new project, Cookiecutter automates this process based on a predefined template, ensuring consistency and adherence to best practices from the get-go.

You can install it easily using pip:
```bash
pipx install cookiecutter-data-science
```

### The Cookiecutter Data Science Template

One of the most widely used templates for data science is `cookiecutter-data-science` developed by DrivenData. It provides a logical and standardized directory structure designed to make data science workflows more reproducible and organized.

You can create a new project using this template by running:
```bash
ccds https://github.com/drivendataorg/cookiecutter-data-science
```
Cookiecutter will then ask you a series of questions (like `project_name`, `repo_name`, `author_name`, etc.) to customize the template for your specific project.

### Understanding the Directory Structure

The `cookiecutter-data-science` template sets up a logical structure like this (simplified):

```
├── LICENSE
├── Makefile           <- Makefile with commands like `make data` or `make train`
├── README.md          <- The top-level README for developers
├── data
│   ├── external       <- Data from third party sources
│   ├── interim        <- Intermediate data that has been transformed
│   ├── processed      <- The final, canonical data sets for modeling
│   └── raw            <- The original, immutable data dump
├── docs               <- Project documentation
├── models             <- Trained models, model summaries, etc.
├── notebooks          <- Jupyter notebooks (e.g., 1.0-eda.ipynb)
├── references         <- Data dictionaries, manuals, etc.
├── reports
│   └── figures        <- Generated graphics for reports
├── requirements.txt   <- Project dependencies
├── setup.py           <- Makes the project pip installable (optional)
└── src                <- Source code for use in this project
    ├── __init__.py    <- Makes src a Python module
    ├── data           <- Scripts to download or generate data
    ├── features       <- Scripts to turn raw data into features
    └── models         <- Scripts to train and predict with models
```

* **`data/`**: Separated into `raw` (untouched source data), `interim` (intermediate processing), and `processed` (final data for modeling). This promotes a clear data lineage.
* **`src/`**: Contains modular Python code (data processing, feature engineering, modeling scripts) that can be imported into notebooks or run as standalone scripts.
* **`notebooks/`**: For exploratory data analysis (EDA) and experimentation. Naming conventions (e.g., numbering) help maintain order.
* **`models/`**: Stores trained model files.
* **`reports/`**: Holds generated analyses, figures, and reports.

For a detailed look, check the official documentation: [https://cookiecutter-data-science.drivendata.org/#directory-structure](https://cookiecutter-data-science.drivendata.org/#directory-structure)

### Essential Files for Your Repository

Beyond the directory structure, several files are crucial for a well-managed data science repository:

1.  **`README.md`**: Your project's front door! This file is critical for explaining your project to others and your future self. It should ideally include:
    * **Project Title & Description:** What the project is about.
    * **Motivation/Problem:** Why does this project exist? What problem does it solve?
    * **Installation:** How to set up the environment (e.g., clone repo, install requirements).
    * **Data:** Where the data comes from, its format, and any setup needed. Mention if data is included, needs downloading (provide script/link), or accessed via API/DB.
    * **Usage:** How to run the code, notebooks, or analysis. Include examples.
    * **Project Structure:** Briefly explain the key directories.
    * **Results (Optional):** Key findings or links to reports/visualizations.
    * **License:** State the project's license.
    * **Contribution/Contact:** How others can contribute or get in touch.

    * **Pro Tip:** Struggling to write a comprehensive README? **Leverage Large Language Models (LLMs)!** By providing your code structure (e.g., `tree` command output), key code snippets, and a description of the project's goals and functionality, you can ask an LLM to generate a draft README. You'll still need to review and refine it, but it can be a great time-saver.

2.  **`requirements.txt`**: This file lists all Python packages your project depends on, ensuring reproducibility. Here's how to create it using a virtual environment (highly recommended!):

    * **Create a virtual environment:** In your project's root directory, run:
        ```bash
        python -m venv venv  # or python3 -m venv venv
        ```
        This creates a `venv` folder containing a specific Python installation for your project.
    * **Activate the environment:**
        * On macOS/Linux: `source venv/bin/activate`
        * On Windows: `.\venv\Scripts\activate`
        Your terminal prompt should change, indicating the environment is active.
    * **Install your dependencies:** Use `pip install` for all necessary libraries (e.g., `pip install pandas numpy scikit-learn matplotlib jupyterlab`).
    * **Generate requirements with [pipreqs](https://github.com/bndr/pipreqs):** Once your project works run this to generate requirements, based on imports:
        ```bash
        pip install pipreqs
        pipreqs /path/to/project
        ```
        or pipreqsnb, outside of the notebook, as so:
        ```bash
        pip install pipreqsnb
        pipreqsnb your_notebook.ipynb
        ```      
    * **Alternative: Freeze dependencies:** Once your project works and all packages are installed, run:
        ```bash
        pip freeze > requirements.txt
        ```
        This command lists all packages installed in the *current environment* and their exact versions, writing them to `requirements.txt`.
    * **Install from requirements:** Anyone else (or you on a different machine) can replicate the environment by activating their virtual environment and running:
        ```bash
        pip install -r requirements.txt
        ```

**Note**: *pip freeze* saves all packages in the environment including those that you don't use in your current project (if you don't have virtualenv).

3.  **`.gitignore`**: This file tells Git which files or directories to ignore (e.g., virtual environment folders like `venv/`, large data files not meant for version control, credential files, system files like `.DS_Store`). Cookiecutter templates usually provide a sensible default `.gitignore`.
        ```bash
        echo "folder_name/" >> .gitignore
        git add .gitignore
        git commit -m "Add folder_name/ to .gitignore"
        ```

4.  **`LICENSE`**: Choose an open-source license (e.g., MIT, Apache 2.0) and include the license file to clarify how others can use your code.

### Integrating with Git

Once your project structure is generated by Cookiecutter:

1.  **Initialize Git:** Navigate to your project directory in the terminal and run:
    ```bash
    git init
    ```
2.  **Add Files:** Stage all the generated files:
    ```bash
    git add .
    ```
3.  **Commit:** Make your initial commit:
    ```bash
    git commit -m "Initial project structure from cookiecutter-data-science"
    ```
4.  **Connect to Remote:** Create a repository on a platform like GitHub, GitLab, or Bitbucket and follow their instructions to link your local repository and push your initial commit (often involving `git remote add origin <your-repo-url>` and `git push -u origin main` or `master`).

For more in-depth blog about using Git and Git commands, check out my [blog post](https://realivanivani.github.io/posts/2025/05/blog-post-1/).

### Beyond Cookiecutter: Introducing Kedro

While Cookiecutter provides an excellent starting structure, **Kedro** ([https://github.com/kedro-org/kedro](https://github.com/kedro-org/kedro)) is another open-source Python framework that takes project organization and pipelining further. Hosted by the LF AI & Data Foundation, Kedro focuses on creating reproducible, maintainable, and modular data science *pipelines*.

Key Kedro features include:

* **Project Templating:** Similar to Cookiecutter, it sets up a standard project structure.
* **Data Catalog:** Abstract way to handle data loading and saving (supports various file types, databases, cloud storage) using simple YAML configuration.
* **Pipeline Abstraction:** Define your workflow as a series of connected Python functions (nodes), making complex pipelines easier to manage and visualize.
* **Configuration Management:** Separates configuration (parameters, data paths) from code.
* **Reproducibility:** Encourages software engineering best practices.

Even though, I haven't used it yet, Kedro seems particularly powerful for larger, more complex projects involving intricate data pipelines and production deployment considerations. It can be seen as a more opinionated and feature-rich alternative or complement to the basic Cookiecutter structure.

Ultimately, I plan on transitioning to Kedro in the future.

### Examples of Well-Structured Repositories

Looking at existing projects is a great way to learn. While the definition of "good" varies, exploring these resources can provide inspiration:

* **Templates:**
    * [drivendata/cookiecutter-data-science](https://github.com/drivendata/cookiecutter-data-science): The template discussed here.
    * [khuyentran1401/data-science-template](https://github.com/khuyentran1401/data-science-template): Another template incorporating tools like Hydra and Poetry.
    * [hardefarogonondo/data-science-project-folder-structure](https://github.com/hardefarogonondo/data-science-project-folder-structure): A template focused on clear folder descriptions.
* **Learning Resources & Guides:**
    * [jakevdp/PythonDataScienceHandbook](https://github.com/jakevdp/PythonDataScienceHandbook): The code notebooks for the excellent book, demonstrating library usage.
    * [microsoft/Data-Science-For-Beginners](https://github.com/microsoft/Data-Science-For-Beginners): A curriculum with projects.
    * [donnemartin/data-science-ipython-notebooks](https://github.com/donnemartin/data-science-ipython-notebooks): A large collection of notebooks covering various topics.
* **Curated Lists:**
    * [awesome-datascience](https://github.com/academic/awesome-datascience): A vast list of resources, including tools and learning materials.
    * [KDnuggets: 10 GitHub Repositories to Master Data Science](https://www.kdnuggets.com/10-github-repositories-to-master-data-science): A curated list of helpful repositories.
* **Portfolio Examples:** Searching GitHub for "[data-science-portfolio](https://github.com/topics/data-science-portfolio)" reveals many personal projects, though structure quality varies.

The key is to look for projects with clear READMEs, documented dependencies (`requirements.txt` or similar), logical code/notebook organization, and ideally, some modular code in a `src` directory.

### Conclusion

Adopting a standardized project structure using tools like Cookiecutter significantly improves the organization, reproducibility, and maintainability of your data science work. Combining this with Git for version control creates a robust workflow, especially for collaboration. Remember to maintain crucial files like `README.md` and `requirements.txt`. For more complex projects, exploring frameworks like Kedro can provide even more structure and pipeline management capabilities. Start standardizing today – your future self will thank you!
