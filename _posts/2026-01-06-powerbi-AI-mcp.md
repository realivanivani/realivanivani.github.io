---
title: 'The New Era of Analytics: What MCP Servers Actually Mean for Analytics'
date: 2026-01-06
permalink: /posts/2026/01/blog-post-1/
tags:
  - PowerBI
  - MCP
  - AI
  - Local Models
  - Analytics
  - LMStudio
---
Lately, it feels like we can’t talk about data without AI taking center stage. For Power BI developers, we're at a turning point—one where AI can actually build your measures, set up relationships, and do real development work. Not by you copying DAX code into your model, but by AI directly modifying your semantic model while you watch.

This became possible with MCP servers for Power BI, which let you plug your data model straight into large language models like Claude or ChatGPT. But here's the thing nobody's really addressing: is this safe? is it cheap? Should we be handing AI the keys to our data? Let's dig into what's actually happening here. As we lean into these tools, it’s worth stepping back to look at what this really changes, what makes it actually work, and where we need to be careful.

<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/60aa4a6d-c867-4a5d-97de-baf337c6d449" />

## What MCP Actually Does (And Why It Changes Everything)

When ChatGPT launched in late 2022, I started using it for everything—emails, legal document reviews, even DAX help. But the answers were always generic. The model was trained on massive amounts of internet text, sure, but it knew nothing about *my* Power BI model. It couldn't see my column names, table relationships, or data granularity. So the help was limited—one-size-fits-all advice that rarely fit perfectly.

MCP servers change this fundamentally. Instead of AI living in isolation, it can now communicate directly with your Power BI semantic model through a standardized protocol—think of it as a translator between AI and your data. The AI can query your model, understand its structure, and actually make changes to it.

Here's what that looks like in practice. You open Claude Desktop (or VS Code with GitHub Copilot), connect to your Power BI MCP server, and simply type: "Connect to my Power BI desktop file." It finds your open file. Then you ask: "Write common time intelligence measures for sales and store them in my measure table."

Twenty seconds later? Fourteen time intelligence measures created, formatted, and documented. Year-to-date sales, prior year sales, year-over-year growth—all written, tested, and sitting in your model with proper descriptions. What would've taken you an hour is done before you finish your coffee.

## What's Actually Possible Now

The capabilities are honestly staggering once you start using it. Here are real examples from current implementations:

**Automated Measure Creation**
Claude can create calendar tables with hierarchies, generate time intelligence measures like YTD and prior year comparisons, and build calculated tables that aggregate data—all from natural language prompts.

**Bulk Operations**
Need to add descriptions to all your measures? Done in one prompt. Want to standardize naming conventions across 50 tables? Claude analyzes patterns and corrects inconsistencies in naming, casing, and prefixes across your entire model.

**Model Documentation**
Ask for a comprehensive data dictionary and you'll get a 60-page document detailing every table, column, relationship, and measure in your model. Work that would take days happens in minutes.

**Data Quality Diagnostics**
You can ask Claude to diagnose dashboard problems, where it searches for data quality issues by exploring both the model schema and querying data using DAX. It'll find the workspace, inspect visuals, and tell you exactly what's broken.

**DAX Optimization**
Claude can review your existing measures and suggest optimizations, rewrite inefficient calculations, and even validate that your DAX logic matches your business requirements.

**Relationship Management**
Creating and modifying table relationships, setting up hierarchies, managing display folders—all through conversation rather than clicking through interfaces.

## What You Need to Consider Before Jumping In

This all sounds incredible, and it is. But there are some serious considerations before you start letting AI modify your production models.

**The Right Model Matters**
Not all AI models work equally well for Power BI development. Microsoft recommends using deep-reasoning models like GPT-5 or Claude Sonnet 4.5, as the AI model you select directly influences the quality and relevance of responses. Using a smaller, weaker model will get you worse DAX, wrong assumptions, and potentially broken logic.

**Context Window Limitations**
AI models have memory limits. Smaller models with 32,000 token context windows might forget how your conversation started after just a few exchanges. Many VS Code extensions have silently added MCP servers that consume your available context, resulting in shorter sessions and reduced agent performance. You need to actively manage what tools are enabled.

**Validation is Non-Negotiable**
The AI makes certain DAX assumptions based on existing patterns in your model—you can't rely on it to write "good" DAX unless you provide sufficient instructions or examples. Every measure it creates needs your review. Every relationship it modifies needs validation. The AI is fast, not infallible.

**Start With Read-Only Mode**
It's best practice to start with readonly mode when exploring a new semantic model to prevent accidental modifications while you learn the available operations. Get comfortable with what the AI can do before giving it write access.

**Hardware Requirements for Local Models**
If you want to run everything locally for maximum security, you need serious computing power. A typical business laptop without a dedicated GPU simply cannot handle larger models. The context requirements for Power BI work will overwhelm most consumer-grade machines.

## The Security Question Everyone Should Be Asking

Now we get to the elephant in the room. When you connect AI to your Power BI model, it gains access to everything you can access—all your data, all your structure, all your business logic. So the question becomes: where is that data going?

**Understanding Data Flow**
The AI model itself doesn't store your data. But the machine running that model can. There are three main approaches, each with different security implications:

**Option 1: Run Locally**
You can run AI models on your own computer or servers using tools like Ollama Studio or Microsoft Foundry. Everything stays on your infrastructure—the model, the MCP server, all of it. This is the safest option, but you need powerful hardware. Without a good GPU and substantial RAM, your computer will struggle or simply fail to handle Power BI development workloads.

**Option 2: Self-Deploy to Cloud**
Deploy your chosen model to Azure AI or AWS Bedrock. You control data retention, logging, security guardrails—everything. This comes with operational overhead, but you maintain full control. For larger organizations with compliance requirements, this middle ground often makes the most sense.

**Option 3: Use Managed Services**
This is the most common path—using ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), or similar services. They handle everything: hosting, updates, scaling, security. But you're dependent on their policies and their terms of service.

**The Terms of Service Problem**
This is where things get concerning. If you're using Claude on a Pro or Free plan and you haven't changed your settings, your data might be retained for training purposes. For up to five years, your prompts—including any contextual information you shared—could be used to train future models. That means your company's sales data, customer information, or proprietary business logic could end up embedded in a publicly available AI model.

There's usually a toggle to opt out of this. In Claude, it's under Settings > Privacy > "Help improve Claude." But here's the problem: when these services update their terms, they sometimes present this as a popup where the default is opt-in. If you quickly clicked "accept" without reading carefully, you may have inadvertently agreed to share everything.

The Team and Enterprise plans typically have stricter defaults—data isn't used for training by default. But you need to verify what plan you're on and what you've agreed to.

**MCP Server Data Sharing**
What actually gets shared when you use an MCP server? More than you might think. The AI needs context to work effectively, so when you connect to your Power BI model, it receives:
- Your complete semantic model structure (table names, column names, relationships)
- Sample data when it queries to understand patterns
- Measure definitions and DAX formulas
- Any metadata you've added (descriptions, display folders, format strings)

If you're using a managed AI service, all of this goes to their servers. For sensitive data, that's potentially a compliance violation or a competitive intelligence leak.

## A Practical Implementation Framework

If you're going to implement AI-powered Power BI development, here's how to do it without blowing things up:

**Phase 1: Environment Setup (Week 1-2)**

Choose your model hosting approach based on your security requirements:
- **Local models** (Ollama, LM Studio) for maximum control, but you need serious hardware—minimum 32GB RAM, dedicated GPU with 16GB+ VRAM for anything beyond toy models
- **Azure OpenAI** for enterprise compliance, moderate operational overhead
- **Claude Teams/Enterprise** for ease of use with contractual data protections

Set up proper MCP server configuration. Use the Remote MCP Server initially (read-only access) to explore capabilities without risk. Only enable the Modeling server (write access) after you understand the behavior.

**Critical security configurations:**
```json
{
  "mcpServers": {
    "powerbi": {
      "command": "node",
      "args": ["path/to/powerbi-mcp-server"],
      "env": {
        "POWERBI_READONLY": "true",  // Start here
        "POWERBI_REQUIRE_APPROVAL": "true"  // Human approval for writes
      }
    }
  }
}
```

**Phase 2: Controlled Testing (Week 3-4)**

Create a synthetic test model that mirrors your production structure but contains no real data. Use the same table names, relationships, and measure patterns, but populate with fake data.

Test specific use cases systematically:
1. Measure generation for known patterns
2. Bulk documentation tasks
3. Relationship modifications
4. Schema restructuring

For each test, validate:
- Correctness: Does the DAX produce expected results?
- Performance: Query plan analysis shows no regression
- Style: Does it match your organization's patterns?
- Documentation: Are descriptions accurate and useful?

**Phase 3: Production Pilot (Week 5-8)**

Select a low-risk project—perhaps a departmental dashboard or an exploratory analysis model. Define clear boundaries:
- AI can generate measures, humans must review before deployment
- AI can suggest optimizations, humans decide whether to implement
- AI cannot modify production models directly

Implement a validation workflow:
```
1. AI generates measure → Draft state
2. Analyst reviews logic → Testing state  
3. Analyst validates results → Staged state
4. Second analyst approves → Production state
```

Never skip the double-validation step for business-critical calculations.

## What Could Go Wrong (And How to Prepare)

Even with careful implementation, there are pitfalls to watch for:

**Overconfidence in AI Outputs**
The AI will confidently give you wrong answers sometimes. It might create measures that look correct but have subtle logic errors. It might make assumptions about your data that don't hold true. Blind trust is dangerous—treat every output as a draft that needs review.

**Version Control Chaos**
AI making rapid changes to your model can create havoc if you're not tracking changes properly. Use PBIP (Power BI Project) format and Git for version control. Every AI session should be a separate branch that gets reviewed before merging.

**The "Black Box" Problem**
When AI modifies your model, you need to understand *why* it made each choice. Ask it to explain its reasoning. Document the logic. Future you (or your replacement) needs to understand why your model works the way it does.

**Model Drift**
As you let AI make incremental changes over time, your model can drift from your original design principles. Regularly review the overall structure to ensure it still aligns with best practices and business requirements.

**Skill Atrophy**
If AI writes all your DAX, do you still know how to write it yourself? This matters when you need to debug complex issues or optimize performance. Use AI to augment your skills, not replace them entirely.

## What This Means for the Future

The integration of AI into Power BI through MCP servers isn't just a productivity boost—it's changing how we think about data modeling. We're heading toward an environment where humans define intent and systems deliver outcomes. You describe what you want; AI builds it.

But we're in the awkward middle phase right now. The technology works, but it's not yet refined enough to be fully autonomous. You still need expertise to guide it, validate it, and correct it when it goes off track.

The organizations that will benefit most are those that:
- Have clean, well-structured data to begin with
- Invest in training their teams to work effectively with AI
- Build proper governance around AI usage
- Treat AI as a tool that augments human expertise rather than replaces it

The ones that will struggle are those that expect AI to magically fix their poorly designed models or compensate for lack of fundamental data skills.

We're at an interesting inflection point. MCP servers have removed the technical friction that made AI integration clunky and unreliable. The standards are maturing, the tools are stabilizing, and the early adopters are figuring out what actually works in production versus what just looks impressive in demos.

The gap between AI's promise and AI's reality is closing. But it hasn't closed yet. Success comes from approaching this technology with clear eyes—excited about the possibilities but realistic about the work still required to use it safely and effectively.

***In the next post, I'll write about steps on how to integrate PowerBi with MCP in safe and non-expensive way. Stay tuned***

---

## Sources Referenced

GitHub - maxanatsko/pbi-desktop-mcp-public

Talk to Your Data Model: Introducing the Power BI Modeling MCP – pbidax

Power BI MCP Setup: VS Code & Claude Desktop | Medium

AI agents that work with Power BI semantic model MCP servers - Tabular Editor

Claude + Power BI Integration (Nov 2025 Update) - Lilys AI

Claude Power BI MCP Integration - Data Bear

AI in Power BI: Time to pay attention - SQLBI

GitHub - enelyse/powerbi-mcp-server

GitHub - sulaiman013/powerbi-mcp

Power BI Desktop MCP Server - LobeHub
