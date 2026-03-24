---
title: 'Lessons learned from the first weeks of using Claude Code'
date: 2026-03-02
permalink: /posts/2026/03/blog-post-1/
tags:
  - coding
  - Claude Code
  - skills
  - claude.md
  - agent.md
  - AI
---
The world is changing fast. In fact, it is changing so fast that I feel like letting it change and waiting out until something becomes a new standard and then starting to learn it. I wasn't like this before, I am always open to new things, but man, the pace of change is so fast. But I decided that 2026 is the perfect time to jump on board and start learning, because some things have become standard. I finally stopped "waiting for the dust to settle" and dove headfirst into **Claude Code**. 

<img width="1024" height="837" alt="image" src="https://github.com/user-attachments/assets/ee656e27-e481-4b97-b8dd-e312a55ec6a5" />

It turns out that the learning curve isn't about memorizing syntax anymore; it’s about learning how to manage an agent that is sometimes magical and sometimes very expensive. After a few weeks of heavy use and active learning online from others, I’ve realized that using a tool like Claude Code isn't just about faster typing, but it’s about a fundamental shift in **context management**. If you treat it like a standard chatbot, you’ll burn through tokens while getting mediocre results. If you treat it like a junior developer who needs very specific guardrails—and occasionally a bit of "intentional misdirection"—it becomes a superpower.

In this post, I’m breaking down the hard-earned lessons from others that showed quite useful in practice, including:

* **The "Anti-Context" Philosophy:** Why your `CLAUDE.md` file might actually be making your agent dumber.
* **Cost vs. Performance:** The "Step 3" hack and other ways to keep your API bill from spiraling.
* **The Terminal as Eyes:** How to give Claude the ability to "see" its own mistakes through Vercel's Agent Browser and strict mode checks.

### **10 Ways to elevate your usage of Claude Code**

Firstly, I came across a great tutorial that outlines advanced strategies for using Claude Code (CC) to move beyond basic development into highly optimized, automated, and cost-effective workflows. The central theme is providing Claude with the right "eyes" and "constraints" to ensure it remains accurate and context-efficient. Here are the 10 ways to use CC that proved to be quite useful:

https://github.com/user-attachments/assets/0873794e-c7ec-4351-8baa-22bb71b63023


1. **Utilize the `insights` Command:** Use this built-in command to analyze your past sessions. It generates a report that "roasts" your working patterns and highlights friction points, allowing you to refine your `claude.md` to prevent repeated mistakes [[00:28](http://www.youtube.com/watch?v=TmsH-RIHvas&t=28)].
2. **Automate Project Documentation:** Instead of writing it yourself, use a specialized prompt to have Claude generate a documentation suite, including a PRD, `architecture.md`, `decision.md`, and a token-efficient `feature.json` to track implementation progress [[01:38](http://www.youtube.com/watch?v=TmsH-RIHvas&t=98)].
3. **Context 7 MCP for Live Docs:** Connect the Context 7 Model Context Protocol (MCP) to fetch the latest documentation for libraries and frameworks. This fills the gap between the model's training data and current software updates, reducing dependency errors [[02:30](http://www.youtube.com/watch?v=TmsH-RIHvas&t=150)].
4. **Implement Lifecycle Hooks:** Use shell command hooks that trigger at specific points (e.g., `pre-tool-use`). By using **exit code 2**, you can create hard blocks that prevent the agent from taking unauthorized actions [[02:58](http://www.youtube.com/watch?v=TmsH-RIHvas&t=178)].
5. **Protect Tests with Custom Scripts:** Set up a hook that monitors the file path Claude is trying to modify. If it detects a test directory, it returns exit code 2 to prevent Claude from "cheating" by changing tests to pass failing code [[03:41](http://www.youtube.com/watch?v=TmsH-RIHvas&t=221)].
6. **Enable Experimental MCP CLI Mode:** Set the `experimental_mcp_cli` flag to true to prevent MCP tool schemas from bloating your context window. This runs tools via bash on-demand rather than loading them all into memory upfront [[04:26](http://www.youtube.com/watch?v=TmsH-RIHvas&t=266)].
7. **Isolate Tasks with Git Worktrees:** Instead of branches (which share a working directory and cause agent confusion), use parallel agents on separate Git worktrees. This allows them to work on different features in total isolation before a final merge [[05:16](http://www.youtube.com/watch?v=TmsH-RIHvas&t=316)].
8. **Enforce Strict Mode Checking:** Always enable strict typing (like TypeScript's `strict: true`) to shift the burden of error catching from runtime to the compiler. This provides clear terminal logs that the agent can use to self-correct [[06:17](http://www.youtube.com/watch?v=TmsH-RIHvas&t=377)].
9. **Adversarial Fact-Checking (Agent Swarms):** Run two agents in parallel where one performs a task (like research or coding) and the other acts as a critic or fact-checker. The "fact-checker" is blocked until a draft is ready, ensuring a tight feedback loop [[08:59](http://www.youtube.com/watch?v=TmsH-RIHvas&t=539)].
10. **Bonus Optimization Tip: Failure Prediction**: Ask Claude to "predict failures" by pattern matching against common issues in other apps. This often catches edge cases—like potential production gaps—that even multi-layered automated testing might miss [[11:34](http://www.youtube.com/watch?v=TmsH-RIHvas&t=694)].

You notices that one file seems to be the key to the whole development cycle. It's `claude.md`

### **`CLAUDE.md` and `AGENT.md` files**

When it comes to building stuff with LLMs from scratch, my favorite youtuber is Theo. In his recent video, he discusses a recent study and his own experience regarding `CLAUDE.md` and `AGENT.md` files, arguing that they often hinder performance and increase costs.

### **Optimization & Cost-Saving Tips**

* **Avoid LLM-Generated Files:** The video cites a study showing that LLM-generated context files can decrease performance by 3% and increase costs by over 20% due to unnecessary exploration and reasoning [[15:02](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=902)].
* **Don't Duplicate Codebase Info:** Do not include architecture overviews, directory structures, or common scripts that are already in your `package.json` or visible in the file tree. Modern agents are highly proficient at using tools like `grep` and `ls` to find this information themselves [[16:30](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=990)], [[19:49](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1189)].
* **Maintain Minimal Context:** Large context files distract the model. Everything in the context is "traversed on every single token," which costs money and leads to "hallucinations" or biasing the model toward old patterns [[11:19](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=679)], [[12:50](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=770)].
* **Prioritize Code Structure over MD Rules:** Instead of adding rules to an agent file, improve your unit tests, integration tests, and type checks. A well-architected codebase serves as a better guide for the AI than a "band-aid" instruction file [[19:08](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1148)], [[19:34](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1174)].

### **"Hacks" for Better Output**

* **Intentional Lying (The "Greenfield" Hack):** Tell the agent the project is brand new with no real users or data, even if it’s live. This prevents the agent from wasting time and tokens on complex backfill data patterns or migration safety when you just want a quick feature prototype [[26:54](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1614)].
* **The "Step 3" Redirection:** If the agent is consistently failing at a specific task (Step 2), ask it to perform the *next* logical step (Step 3). The agent will often unblock itself and successfully complete Step 2 as a prerequisite to reaching the new goal [[27:32](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1652)].
* **The Surprise Signal:** Include a rule in your `CLAUDE.md` telling the agent to "alert the developer and propose a change to the MD file" whenever it encounters something surprising [[25:20](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1520)]. Theo uses this not to actually update the MD file, but as a diagnostic tool to identify where the *codebase* is confusing and needs refactoring [[26:15](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1575)].
* **Legacy Tech Isolation:** If you must mention old technologies, clearly label them in a "Legacy" section. Otherwise, mentioning them in an overview (like TRPC alongside newer Convex functions) biases the model to use the old tech where it doesn't belong [[12:08](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=728)].

### **When to Actually Use an Agent MD**

Theo suggests reaching for these files only as a last resort when a model consistently makes the same mistake despite codebase improvements [[17:42](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1062)]. Use them to:

* Enforce specific behaviors the model lacks (e.g., "always run type checks after changes") [[24:55](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1495)].
* Steer the model away from a persistent wrong pattern with a specific dependency [[18:01](http://www.youtube.com/watch?v=GcNu6wrLTJc&t=1081)].

---
## That's all cool, but what does the research say?

There were 2 interesting papers that came out recently that shed light on industry pracice of using repository-level context files like `CLAUDE.md` and `AGENT.md`, and "Skills"—structured packages. They are interesting because they actually suggest a completely opposite approach! I will need some time to test and trial and see where I fit in with all of this, but in the meantime, let's see the summaries of these works.

### 1. Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?

The paper **"Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"** (arXiv:2602.11988), published in February 2026 by researchers at ETH Zurich, provides a rigorous empirical evaluation of the common industry practice of using repository-level context files like `CLAUDE.md` and `AGENT.md`.

The study's findings largely support the skeptical view that these files, especially when automatically generated, often do more harm than good. Here is the quote:

> Across multiple coding agents and LLMs, we find that context files tend to reduce task success rates compared to providing no repository context, while also increasing inference cost by over 20%. Behaviorally, both LLM-generated and developer-provided context files encourage broader exploration (e.g., more thorough testing and file traversal), and coding agents tend to respect their instructions. Ultimately, we conclude that unnecessary requirements from context files make tasks harder, and human-written context files should describe only minimal requirements.

### **Core Findings: Performance & Cost**

* **Performance Degradation:** LLM-generated context files generally **decrease** the success rate of coding agents by an average of **3%** (with drops of 0.5–2 percentage points across various settings).
* **Marginal Human Gains:** Developer-written context files show only a marginal performance improvement of approximately **4%** on average. However, this improvement is inconsistent; for instance, performance actually dropped by over **2%** when using high-tier models like Sonnet 4.5.
* **Significant Cost Increase:** Regardless of whether they are human-written or LLM-generated, context files increase inference costs by **over 20%** (specifically 20–23%).
* **Increased Complexity:** Agents using these files take an average of **2.45 to 3.92 additional steps** per task and use **14–22% more reasoning tokens**, suggesting they find the tasks harder to solve when constrained by context files.

### **The "Exploration Paradox"**

The paper identifies a behavioral shift in agents when a context file is present:

* **More Activity, Less Success:** Agents tend to follow instructions diligently, which leads to broader exploration, more file traversals, and more frequent testing.
* **Distraction:** This increased activity often results in "unnecessary requirements" that distract the agent from the primary task, leading it down unproductive paths.

### **Optimization & "Hacking" Recommendations**

The researchers propose several strategies to optimize output and reduce costs:

* **Eliminate LLM-Generated Overviews:** Nearly 100% of LLM-generated files include repository overviews, yet agents discover relevant files no faster than those with no context file at all. These overviews are largely redundant with information the agent can already infer from the codebase.
* **The "Two-Question" Filter:** An entry should only exist in an agent context file if it passes one of two tests:
1. **Resolves Ambiguity:** It clarifies something the code itself cannot (e.g., "always use this specific library for X even if others are installed").
2. **Caches Expensive Inferences:** It provides information that an agent *could* eventually figure out but only at a high token cost (e.g., complex CI setup instructions).

* **Keep it Minimal:** The study recommends omitting LLM-generated files entirely and keeping human-written files under **60–100 lines**.
* **Maintenance Discipline:** Treat these files like a cache. Stale entries—such as those describing old architectural patterns or migrations—are actively harmful because agents will follow them with the same diligence as current ones.

### SkillsBench: Evaluating Skill Discovery and Selection in Language Model Agents

The paper **"SkillsBench: Evaluating Skill Discovery and Selection in Language Model Agents"** (arXiv:2602.12670) evaluates how "Skills"—structured packages of procedural knowledge—impact the performance of AI agents across diverse domains. Here is an important finding of their study:

> We test 7 agent-model configurations over 7,308 trajectories. Curated Skills raise average pass rate by 16.2 percentage points(pp), but effects vary widely by domain (+4.5pp for Software Engineering to +51.9pp for Healthcare) and 16 of 84 tasks show negative deltas. Self-generated Skills provide no benefit on average, showing that models cannot reliably author the procedural knowledge they benefit from consuming. Focused Skills with 2–3 modules outperform comprehensive documentation, and smaller models with Skills can match larger models without them.

### **Key Findings and Performance Impact**

The study benchmarked seven major models across 86 verifiable tasks, comparing how they performed without help, with human-curated skills, and with skills they generated themselves.

* **Human-Curated Skills are Critical:** Providing agents with human-verified procedural knowledge raised the average success rate by **16.2 percentage points**. In specialized domains like healthcare or complex data manipulation (e.g., `sales-pivot-analysis`), the success rate jumped by over **50 percentage points**.
* **The "Self-Generation" Failure:** A major takeaway is that models currently cannot reliably author their own procedural knowledge. When prompted to generate their own skills before a task, the success rate actually dropped by **1.3 percentage points**. This suggests that "automated memory" or self-documenting agents are less effective than those guided by human-defined best practices.
* **Skill Quality vs. Model Scale:** The research found that a smaller, more efficient model (like Haiku 4.5) paired with high-quality skills can outperform a much larger, more expensive model (like Opus 4.5) that lacks them. This suggests that for technical teams, investment in "knowledge packaging" and tooling is often more impactful than simply upgrading to the latest frontier model.
* **Conciseness Wins:** The most effective agents used focused skills containing only 2–3 specific modules. Comprehensive, long-form documentation often led to "context distraction," causing performance to degrade in about 19% of the tested tasks.

### **Practical Implications for Specialized Tasks**

The paper highlights that skills are most effective when they bridge the gap between a model's general reasoning and highly specific technical operations.

* **Data and Analytics:** Tasks involving Excel pivot table APIs or specialized SQL operations saw some of the highest gains. These tasks require strict adherence to syntax and logic that general training data often lacks.
* **Tool-Use Logic:** For complex workflows—such as analyzing sales data or even environment-specific tasks like counting coins in a game environment—curated skills provided the "procedural glue" that allowed agents to navigate multi-step processes without getting stuck in reasoning loops.
* **Cost Efficiency:** By using smaller models augmented with curated skills, teams can achieve high-tier performance at a significantly lower inference cost, making it a viable strategy for large-scale production environments.

### Conclusions

The most surprising takeaway isn't that the AI is "smarter"—it’s that **less is actually more.**

When I started, I thought the goal was to feed the machine as much information as possible. I wanted it to know my architecture, my naming conventions, user-stories etc. But the research and my own terminal logs tell a different story: context is a double-edged sword. Every extra line in your `CLAUDE.md` is a distraction, a potential hallucination, and a literal death penalty to your subscription.

<img width="1474" height="971" alt="image" src="https://github.com/user-attachments/assets/ec873dc6-658b-42d7-a443-985c8aa049d0" />

**The New Developer Mindset**

If there’s one "North Star" I’ve found, it’s this: **The codebase should be the documentation.** If Claude is struggling to find a file or understand a function, the solution isn't to write a paragraph in a markdown file explaining it; the solution is to refactor the code so it’s obvious.

By moving away from "prompt engineering" and toward **"agent-centric architecture,"** The pace of change isn't slowing down, but the "standard" is finally emerging. It’s not about how much code the AI can write; it’s about how well you can steer the agent while staying out of its way.
