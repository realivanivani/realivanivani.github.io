---
title: 'Mastering Claude Code: 7 Levels of AI Orchestration'
date: 2026-02-20
permalink: /posts/2026/02/blog-post-4/
tags:
  - coding
  - Claude Code
  - MCP
  - skills
  - AI
  - LLM
  - Codex
---
I've been very resiliant to trying coding assistance for some time now. It's not that I am stubborn like some IT folks out there, it's just that I'm lazy to learn (plus I don't have much time with 3 kids and a full-time job). But, I've been following and reading a lot about the topic and I decided to try **Claude Code**! And to write a blog post about it. So, this is my take on properly using CC based on my research and testing so far (just 2 weeks in :) Here we go..

<img width="1996" height="1330" alt="image" src="https://github.com/user-attachments/assets/71bd5a1f-b82e-4002-a9f4-aa7ba815bf4f" />

### What is Claude Code

Claude Code (often referred to as CC in developer circles) is not just another AI chat interface; it is a high-performance command-line tool designed to live within your development environment. Claude Code is not a mere chatbot; it is a junior developer living in your terminal. To get the most leverage, you must move beyond "typing and hoping" and start building systems of verification and automation.

<img width="1226" height="886" alt="image" src="https://github.com/user-attachments/assets/89a3d9ef-5077-4fa0-b0cf-aade5118be1c" />

There are many tutorials on using CC, like [Meta's engineer usage of CC](https://www.youtube.com/watch?v=1SJGGUeEbQs) or [4 Hours full course](https://www.youtube.com/watch?v=QoQBzR1NIqI) are really good for starting out, but I'm gonmna go to one comprehensive breakdown done by **Simon Scrapes** explores how users can evolve from basic prompting to building fully autonomous agentic systems. This guide explores the **seven levels of Claude Code mastery**, explaining why each level is critical for your workflow and how to implement them effectively.

---

### Short Checklist for Pro-Level CC Use

Since I know that most of you will just scroll through this post and not read it thoroughly, here's a small take-away bulletpoints:

1. **Verify everything:** Never trust code without a test. Ask Claude to generate the tests first.
2. **Commit your commands:** Don't let your best prompts die in your history; put them in the `.claude` folder.
3. **Collaborate on context:** Make `claude.md` a mandatory part of your team's pull request process.
4. **Orchestrate, don't just code:** Use MCPs to link your developer tools into a single, cohesive workflow.

Check out the summary of all the tips from the CC creator himself, [Boris Cherny](https://www.youtube.com/watch?v=B-UXpneKw6M)

---

### Level 1: Intentional Planning (The "Zero-Action" Rule)

**Why it’s important:** The biggest mistake beginners make is asking for code immediately. Boris Cherny follows a strict rule: **No execution until a plan is verified.** Plan mode allows the model to research your codebase, identify dependencies, and ask clarifying questions without spending tokens on incorrect code generation.

**How to implement:**

* **Toggle Plan Mode:** Use `Shift + Tab` to cycle to "Plan Mode." [[01:19](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=79)].
* **Brief Claude on your objective**: (e.g., "Plan a social media content system").
* **The Feedback Loop:** Ask Claude to research a feature and propose a roadmap. If the plan is vague, use the `ask_user_questions` tool to surface hidden assumptions. [[02:15](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=135)]
* **The "Pro" Switch:** Only move to "Auto-accept edits" mode once you have manually verified the plan. This "one-shot" execution saves significant time and steering effort.

<img width="1012" height="653" alt="image" src="https://github.com/user-attachments/assets/22543b82-7d85-4a19-8ecc-f4fc146b9eab" />

---

### Level 2: The `claude.md` Protocol



At Level 2, you stop repeating yourself. The Philosophy is: **Onboarding Your AI Coworker**, you treat Claude like a new team member who needs to know your house rules, tech stack, and preferences.

**Why it’s important:**
Your `claude.md` is the "onboarding manual" for your AI coworker. It shouldn't just be a static list of tech stacks. The most effective teams treat it as a version-controlled file that evolves with every error encountered.

**How to implement:**

* **Negative Constraints:** Add a section for "Things NOT to do." If Claude makes a mistake in a session, immediately update the `claude.md` to prevent that error from ever happening again. [[03:37](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=217)]
* **Domain Isolation:** For complex full-stack apps, place different `claude.md` files in your `/frontend` and `/backend` directories to keep the context window lean and focused. [[04:47](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=287)]
* **The 60-Second Rule:** Keep the file under 2.5k tokens so it can be read and ingested in every session without causing "context rot." [[09:50](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=590)]

---

### Level 3: Commands, Skills, and Hooks

Level 3 is about **Building Your Custom Toolkit** thus moving you from manual labor to automation through three distinct features: Slash Commands (manual), Skills (background knowledge), and Hooks (programmatic triggers).

**Why it’s important:**
Productivity lies in the "Inner Loop"—tasks you repeat dozens of times a day. By turning these into `/slash` commands, you create a shared team library of workflows that can be committed to Git.
While **Commands** are saved prompts [[10:32](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=632)], **Skills** are deep context folders (like a "Humanizer" for better writing) [[14:19](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=859)], and **Hooks** are automatic checks that run after Claude acts (like word-count or banned-word filters) [[18:41](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=1121)].

**How to implement:**

* **Commands:** Create `.claude/commands/command-name.md` with a prompt and arguments like `$arguments`. For example, a `/pr-review` command can automatically check for linting errors and adherence to brand voice. [[11:09](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=669)].
* **Skills:** Organize specific knowledge (e.g., brand voice) into `.claude/skills/`. Use libraries like "Humanizer" to refine AI-generated text or SEO reviewers to audit content. [[14:30](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=870)].
* **Hooks:** Implement "Stop Hooks" in your `claude/settings.json`. These automatically trigger verification scripts (like `npm test`) the moment Claude finishes a task, ensuring immediate feedback. [[19:41](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=1181)].

---

### Level 4: The MCP Orchestrator

**Why it’s important:**
Claude Code reaches its true potential when it breaks out of the terminal. Using Model Context Protocol (MCP) servers, Claude acts as an orchestrator, connecting your code to Slack, BigQuery, Sentry, or AirTable.

**How to implement:**

* **Connect Business Apps:** Create an `mcp.json` file to define your server connections. Use the `/mcp add` command (e.g., `/mcp add airtable`) to set up the connection [[22:19](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=1339)]
* **Automated Pipelines:** Ask Claude to "Check Sentry for recent errors, summarize them in Slack, and create a Jira ticket if they are critical." This moves Claude from a "coder" to a "system operator." [[24:52](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=1492)]

---

### Level 5: The GSD (Get Stuff Done) Framework

As projects grow, "context rot" becomes a problem—Claude starts forgetting earlier details. Level 5 solves this by using the GSD framework to manage complex, long-term projects.

**Why it’s important:**
As projects scale, the context window fills up, leading to "context rot" where the AI loses track of the original goal. The GSD framework solves this by breaking projects into discrete phases with a persistent "state" file. GSD breaks massive projects into phases (Foundations, Data, AI Pipeline, etc.). It maintains "state" documents so Claude knows exactly what has been completed and what is next, even if the session context fills up [[28:05](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=1685)].

**How to implement:**

* **State Management:** Maintain a `.planning/state.md` that tracks which requirements are met, which are in progress, and which are pending. Set up a `.planning` folder with a `roadmap.md` and `state.md` [[28:30](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=1710)]
* **Phase Isolation:** Divide work into "waves" of tasks. Work on one phase (e.g., "Authentication") at a time. Once done, summarize the outcome into the state file and clear the session context to start fresh for the next phase.
* **Testing**: Use "User Acceptance Testing" (UAT) files to verify each phase before moving on [[29:14](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=1754)].


---

### Level 6: Agentic Teams, Parallel Sessions & Junior Dev Mentality

**The Philosophy: Specialization and Scale**

Level 6 shifts from one Claude doing everything to a team of specialized sub-agents working in parallel. To achieve maximum leverage, run multiple Claude sessions in parallel. Boris Cherny often runs five terminal tabs simultaneously, numbering them to track background tasks. This allows you to delegate "Junior Developer" tasks to different agents while you act as the Senior Architect.

* **Why it’s important:** By creating specialized personas (e.g., a "Researcher," "Writer," and "Reviewer"), you isolate context, reduce token costs, and improve quality through peer review [[29:45](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=1785)].

* **Agents**: Create an `agents` folder in your `.claude` directory. Define agent personas in Markdown files (e.g., `content-researcher.md`). [[32:23](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=1943)].
* **Tab Management:** Use multiple terminal tabs (Tab 1 for Research, Tab 2 for Refactoring, Tab 3 for UI) and run these agents in parallel, significantly cutting down execution time [[33:40](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=2020)].
* **Teleporting:** Use the `teleport` command to move cloud-based background agents into your local terminal once they’ve finished long-running tasks like migration or documentation.
* **Model Selection:** For high-stakes logic, use **Opus 4.5 with Thinking enabled**. While slower, it requires significantly less "steering" and error correction, saving you total work time in the long run.

* **Pro Tip:** Be carefull with `--dangerously-skip-permissions` command that lets agents work autonomously without asking for permission on every file edit!! [[34:32](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=2072)].

---

### Level 7: Fully Autonomous Pipelines (Ralph Loops)

**The Philosophy: Set It and Forget It**

Level 7 is the pinnacle of Claude Code: full autonomy. Using a "Ralph Loop," you can give Claude a goal, walk away, and return to a finished project. The key to making this work is **verification**. An agent is only as good as its ability to prove its work is correct.

**Why it’s important:** This is for well-defined, batchable tasks. A Ralph Loop (Read-Act-Loop-Finish) uses a bash script to force Claude to keep working until all requirements in a `prd.json` (Product Requirements Document) are marked as "Done" [[36:14](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=2174)].

**How to implement:**
* **Install**: the plugin using `/plugin install ralph`.
* **The PRD.json:** Define your task with strict "Acceptance Criteria.". Create a `prd.json` file with specific user stories and acceptance criteria [[36:56](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=2216)].
* **Autonomous Loops:** Use the `/ralph loop` command. Claude will act, run a verification test (like a bash command or a screenshot-based UI check), and if it fails, it will automatically loop back and fix the error until it passes the criteria.
* **Crucial Safety:** Always set `max-iterations` limit (e.g., 5-10) to prevent the agent from running indefinitely and burning through your token budget.[[38:04](http://www.youtube.com/watch?v=Y09u_S3w2c8&t=2284)].

---

## One Extra point: Are These Principles Transferable to Codex?

As there is a big [debate](https://www.youtube.com/watch?v=1SJGGUeEbQs) on whether Claude Code or Codex is better with coding projects (which I might cover in next blog posts), I wanted to understand if these princples are generally transferable to Codex too (if I eventually decide to switch to Codex). What better than to ask an LLM to generate some output for me... Let's see what Gemini 3.1 said:

With the rise of various AI-native development tools, a common question arises: *Can these 7 levels of mastery be applied to OpenAI's Codex or the tools powered by it (like GitHub Copilot)?*

The short answer is: **Not directly, but the philosophy remains the same.**

Claude Code is uniquely architected as an **agentic CLI**. It has a built-in "loop" (the ability to read, act, and verify) that most Codex-based integrations lack. While standard autocomplete tools focus on *code suggestion*, Claude Code focuses on *workflow orchestration*.


### The Gap in Direct Transferability

* **Infrastructure:** Claude Code relies on the **Model Context Protocol (MCP)** and local filesystem hooks that are natively integrated into its terminal interface. Codex-based extensions typically operate within the editor's "ghost text" paradigm, which doesn't allow for the same level of terminal-based tool use or autonomous looping.
* **Plan Mode vs. Chat:** While GitHub Copilot has a chat feature, it lacks the explicit **"Plan Mode"** state machine found in Claude Code, which prevents execution until a strategy is finalized.
* **Persistent Context:** The specific way Claude Code utilizes `claude.md` as a mandatory initialization prompt for every terminal session is a unique implementation that doesn't have a 1:1 equivalent in most Codex integrations.

### What *Does* Transfer?

The **mindset** of Level 1 (Intentional Planning) and Level 2 (Explicit Constraints) is universal. Whether you are using Claude, Codex, or Gemini, the quality of your output is gated by your ability to provide high-quality context and verification steps.

---

> **Note on Codex:** Because the architecture of Codex and GitHub Copilot is fundamentally different from the agentic nature of Claude Code, I am going to cover **Codex and Copilot-specific optimization strategies** in a future blog post. Stay tuned for that deep dive!

---

### Conclusion

By moving through these seven levels, you transition from using Claude as a simple chatbot to commanding an autonomous workforce. Whether you are just starting with **Level 1 Planning** or scaling with **Level 7 Ralph Loops**, Claude Code offers a level of leverage that was previously impossible for a single developer.

**Watch the full tutorial here:** [Every Level of Claude Code Explained](https://www.youtube.com/watch?v=Y09u_S3w2c8)
**Also, check these tutorials as well, which I found very helpful:** https://www.youtube.com/watch?v=1SJGGUeEbQs, https://www.youtube.com/watch?v=QoQBzR1NIqI

