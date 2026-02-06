---
title: 'SQL Query Builders with LLMs: Lessons from Uber’s QueryGPT (and the Parts They Skipped)'
date: 2026-02-12
permalink: /posts/2026/02/blog-post-2/
tags:
  - SQL
  - Query
  - LLM
  - Schemas
  - Naming Conventions
  - Best Practices
---
SQL has always been the quiet tax on data work. Nobody talks about it in strategy decks, but everyone feels it. Writing queries isn’t hard in theory—it’s the constant context-switching that hurts. Which schema was that in? Which version of the table is “the right one”? Why does this column exist twice with two different names?

Uber felt this pain at scale. According to their own numbers, engineers were running **~1.2 million interactive SQL queries per month**, with each query taking roughly **10 minutes to author**. That’s not because Uber engineers don’t know SQL. It’s because navigating massive, evolving schemas is cognitively expensive.

Their response wasn’t another semantic layer or schema refactor. Instead, they built **QueryGPT**—an LLM-powered SQL query builder designed to compress that 10-minute loop into something closer to 3 minutes. And to be fair, they pulled it off.

This post breaks down how Uber built QueryGPT, how they evaluated it, where it shines, and where—intentionally or not—it exposes deeper structural issues in modern data platforms. I’ll end with what I think actually matters if you’re considering an LLM-based query builder yourself.

<img width="1024" height="1536" alt="image" src="https://github.com/user-attachments/assets/09f64502-e868-4257-99cd-5baa631403d1" />

---

## Uber’s Approach: A Multi-Agent Pipeline, Not a “Magic Prompt”

<img width="1600" height="668" alt="image" src="https://github.com/user-attachments/assets/53b41aca-7d55-427c-82c7-270ca49bea6b" />

One thing Uber got very right: they didn’t treat the LLM as a single, all-knowing SQL oracle.

Instead, QueryGPT is built as a **multi-agent RAG pipeline**, where each step does one narrow job well. This is important, because most failures in “text-to-SQL” come from asking the model to do *everything at once*.

Here’s how their flow works (which you can also ready it on their [blog post](https://www.uber.com/en-IN/blog/query-gpt/?utm_source=chatgpt.com).

### 1. Intent Agent: Narrow the Problem Space Early

A user might ask something vague like:

> “How many trips happened in Seattle last week?”

Instead of throwing that at the entire data lake, QueryGPT first maps intent to a **workspace**—Uber’s curated domain boundaries like *Mobility*, *Ads*, or *Core Services*.

This is subtle but critical. It dramatically reduces schema noise before retrieval even starts.

### 2. Table Agent: Find the Right Tables (with Confirmation)

Within the selected workspace, the Table Agent identifies candidate tables and **confirms them with the user**.

That confirmation step matters more than it sounds. It keeps humans in the loop and avoids silent failures—something many LLM tools still underestimate.

### 3. Column Pruning Agent: Less Is More

Some Uber tables have **200+ columns**. Feeding all of that to an LLM is a great way to get garbage SQL.

So they prune aggressively, removing irrelevant columns before query generation. This improves accuracy, reduces token usage, and makes the model’s job tractable.

### 4. Query Generation: LLM + Domain Examples

Only after all of that does the actual SQL generation happen.

Uber uses GPT-4 internally, augmented with **domain-specific SQL examples** and embedded business logic. The output isn’t a toy query—it’s production-grade SQL that reflects how Uber actually defines metrics.

This layered approach is the real innovation. Not GPT-4. Not RAG. The *structure* around the model.

---

## Final Layout: Why Workspaces Matter More Than Models

If there’s one architectural decision that stands out, it’s **workspaces**.
The diagram below shows the current design of QueryGPT that we’re running in production. The current version includes many iterative changes from the first version.
<img width="1600" height="722" alt="image" src="https://github.com/user-attachments/assets/ec259356-c548-4bc7-a353-7afb72896234" />

Instead of searching across everything, Uber deliberately constrained the problem:

* Mobility data stays in Mobility
* Ads data stays in Ads
* Core Services stay isolated

This mirrors how humans think about data domains, and it aligns retrieval with organizational reality. It also avoids the classic failure mode where an LLM “helpfully” joins tables that should never meet.

Honestly, workspaces probably contributed more to QueryGPT’s success than the choice of model.

---

## How Uber Evaluated QueryGPT

Uber didn’t just ship this and hope for vibes.

They evaluated it on:

* **Time to query**: reduced from ~10 minutes to ~3 minutes
* **Adoption**: 300+ daily active internal users
* **Perceived value**: 78% of users reported significant time savings

More interestingly, the system can handle **complex multi-table joins with embedded business logic**—which is where most naive text-to-SQL tools fall apart.

That tells us something important: QueryGPT isn’t replacing SQL knowledge. It’s compressing the *lookup and recall* part of the work.

---

## Benefits for Uber (and Why This Makes Sense at Their Scale)

For Uber, the benefits are very real:

* Massive productivity gains on repetitive analytical work
* Lower cognitive load when navigating huge schemas
* Faster iteration for engineers who already know the business
* Less time wasted rediscovering the same joins and filters

At Uber’s scale, shaving 7 minutes off a query isn’t a nice-to-have. It’s millions of dollars in reclaimed engineering time.

So yes—this tool clearly delivers value.

---

## The Limitations (and the Quiet Trade-offs)

That said, QueryGPT doesn’t magically solve the root problem. It *routes around it*.

Some limitations are structural:

* It still depends on **high-quality schema metadata**
* Business logic has to be curated and maintained
* Errors are harder to debug when logic is generated, not written
* The system is tightly coupled to Uber’s internal domain structure

And then there’s the elephant in the room.

---

## My Take: It’s Strange They Didn’t Fix the Schemas First

What’s genuinely interesting—and a bit unsettling—is *what Uber didn’t do*.

They didn’t significantly simplify schemas.
They didn’t aggressively standardize naming.
They didn’t reduce column sprawl.
They didn’t redesign tables around analytical access patterns.

Instead, they layered an LLM on top.

This works, but it also introduces friction:

* You now need agents to compensate for schema complexity
* You need pruning because tables are bloated
* You need workspaces because domains leak everywhere

In a way, QueryGPT is a **symptom-solver**, not a root-cause fix.

I get why they did it. Refactoring schemas at Uber’s scale is slow, political, and risky. Shipping an internal LLM tool is faster and more visible.

But it’s worth acknowledging: some of the complexity QueryGPT handles is self-inflicted.

---

## The Real Checklist Before You Add an LLM Query Builder

If there’s one lesson I’d extract for other teams, it’s this:

**LLMs amplify whatever structure you already have.**
Good structure → great results.
Messy structure → clever band-aids.

Before integrating any AI-powered SQL builder, focus on these fundamentals.

### 1. Optimize Data Structures First

* Reduce redundant tables
* Separate fact vs dimension cleanly
* Kill zombie datasets no one trusts

### 2. Clean, Predictable Schemas

* Fewer columns
* Clear grain
* One obvious source of truth

### 3. Descriptions Matter (More Than You Think)

* Table descriptions that explain *why*, not just *what*
* Column descriptions that include units, assumptions, and edge cases

### 4. Naming Conventions: Boring Is Good

* Consistent prefixes
* No clever abbreviations
* Avoid synonyms across domains

### 5. Simplify Without Lying

* Abstract complexity, but don’t hide it
* If logic is nuanced, document it explicitly

### 6. Treat “Prompt-Like” Analysis as a Skill

An LLM query builder is only as good as:

* The questions users ask
* The context they provide
* Their understanding of the underlying data

This doesn’t remove the need for analytical thinking—it *changes the interface*.

---

## Closing Thought

QueryGPT is impressive. Uber built a thoughtful, production-ready system that genuinely saves time, and their multi-agent design is a blueprint worth studying.
(If you haven’t read their write-up, it’s here: *Uber Engineering – QueryGPT*.)

But the deeper lesson isn’t “add an LLM to SQL.”

It’s this:
**AI works best when it stands on top of well-designed data systems—not when it’s asked to compensate for their chaos.**

If you fix the foundations first, the LLM becomes an accelerator.
If you don’t, it becomes a very smart crutch.

And that difference shows up fast—especially at scale.
