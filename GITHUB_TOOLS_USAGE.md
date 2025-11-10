# How to Use GitHub Tools with Codex

## 🚀 Quick Start - Use with Codex CLI

All these commands work with Codex CLI. Just ask naturally!

---

## 1. Get Repository Information

### With Codex:
```bash
npx @openai/codex "Get repository information"
```

Or more specific:
```bash
npx @openai/codex "Show me the current repository details"
npx @openai/codex "What repository am I working on?"
```

### What it shows:
- Remote URL
- Current branch
- Last commit details

---

## 2. Check Git Status

### With Codex:
```bash
npx @openai/codex "Check git status"
```

Or more specific:
```bash
npx @openai/codex "What files have been modified?"
npx @openai/codex "Show me git status and branches"
npx @openai/codex "What's the current git status?"
```

### What it shows:
- Modified files
- Staged/unstaged changes
- All branches (local and remote)

---

## 3. View Commit History

### With Codex:
```bash
npx @openai/codex "Show recent commits"
```

Or more specific:
```bash
npx @openai/codex "Show me the last 10 commits"
npx @openai/codex "Get commit history"
npx @openai/codex "What are the recent commits?"
```

### Customize number of commits:
```bash
npx @openai/codex "Show me the last 5 commits"
npx @openai/codex "Get the last 20 commits"
```

### What it shows:
- Commit hash
- Author name
- Time ago
- Commit message

---

## 4. Get File Diffs

### With Codex:
```bash
npx @openai/codex "Show me the diff for src/app.module.ts"
```

Or more specific:
```bash
npx @openai/codex "What changes were made to src/app.module.ts?"
npx @openai/codex "Get the diff for package.json"
npx @openai/codex "Show differences in src/main.ts"
```

### Compare with specific commit/branch:
```bash
npx @openai/codex "Show diff for src/app.module.ts compared to main branch"
npx @openai/codex "Get diff for package.json compared to commit abc123"
```

### What it shows:
- Added lines (+)
- Removed lines (-)
- Modified sections
- Full diff output

---

## 📋 Complete Examples

### Example 1: Check What Changed
```bash
# Step 1: Check git status
npx @openai/codex "What files have been modified?"

# Step 2: See the diff for a specific file
npx @openai/codex "Show me the diff for src/app.module.ts"
```

### Example 2: Review Recent Work
```bash
# Step 1: See recent commits
npx @openai/codex "Show me the last 5 commits"

# Step 2: Check current status
npx @openai/codex "What's the current git status?"
```

### Example 3: Full Repository Overview
```bash
# Get everything at once
npx @openai/codex "Show me repository info, git status, and recent commits"
```

---

## 🛠️ Direct Tool Usage (Advanced)

If you want to use the tools directly in your NestJS code:

```typescript
import { GitHubToolsResolver } from './mcp/tools/github-tools.resolver';

@Controller('api/git')
export class GitController {
  constructor(
    private readonly githubTools: GitHubToolsResolver,
  ) {}

  @Get('status')
  async getStatus() {
    return await this.githubTools.getGitStatus();
  }

  @Get('info')
  async getInfo() {
    return await this.githubTools.getRepoInfo();
  }

  @Get('commits')
  async getCommits(@Query('limit') limit?: number) {
    return await this.githubTools.getRecentCommits({ limit });
  }

  @Get('diff')
  async getDiff(
    @Query('file') filePath: string,
    @Query('compare') compareWith?: string,
  ) {
    return await this.githubTools.getFileDiff({ filePath, compareWith });
  }
}
```

---

## 💡 Tips & Tricks

### 1. Natural Language Works
Codex understands natural language, so you can ask:
- "What's changed?"
- "Show me what I modified"
- "Tell me about recent commits"
- "What's different in this file?"

### 2. Combine Operations
```bash
npx @openai/codex "Check git status and show me the last 3 commits"
```

### 3. Be Specific
The more specific you are, the better:
- ✅ "Show diff for src/app.module.ts"
- ❌ "Show diff" (too vague)

### 4. Use Context
If you're in a specific directory, Codex understands:
```bash
cd src/application
npx @openai/codex "What files changed here?"
```

---

## 🔍 Troubleshooting

### Issue: "Tool not found"
**Solution:** Make sure MCP server is configured:
```bash
npx @openai/codex mcp list
```
You should see `banking-app` in the list.

### Issue: "Git command failed"
**Solution:** Make sure you're in a git repository:
```bash
git status  # Should work
```

### Issue: "No changes found"
**Solution:** This is normal if you haven't modified files. Try:
```bash
npx @openai/codex "Get repository information"
```

---

## 📚 Quick Reference

| Task | Codex Command |
|------|---------------|
| Repository info | `"Get repository information"` |
| Git status | `"Check git status"` |
| Recent commits | `"Show recent commits"` |
| File diff | `"Show diff for [filepath]"` |
| Last N commits | `"Show last 5 commits"` |
| Compare file | `"Show diff for [file] compared to [branch]"` |

---

## 🎯 Real-World Workflow

### Before Committing:
```bash
# 1. Check what changed
npx @openai/codex "What files have been modified?"

# 2. Review specific file
npx @openai/codex "Show me the diff for src/app.module.ts"

# 3. Check status again
npx @openai/codex "What's the git status?"
```

### After Committing:
```bash
# See your recent work
npx @openai/codex "Show me the last 3 commits"
```

### Starting Work:
```bash
# Get context
npx @openai/codex "Show me repository info and recent commits"
```

---

## ✅ Test It Now!

Try these commands right now:

```bash
# 1. Get repository info
npx @openai/codex "Get repository information"

# 2. Check status
npx @openai/codex "What files have been modified?"

# 3. See commits
npx @openai/codex "Show me the last 5 commits"
```

All tools are ready to use! 🚀

