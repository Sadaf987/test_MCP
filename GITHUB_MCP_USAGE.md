# How to Use GitHub with Codex CLI

Your GitHub MCP server is now configured and ready to use! Here's how to interact with GitHub through Codex.

## Getting Started

1. **Start Codex CLI:**
   ```bash
   npx @openai/codex
   ```

2. **In Codex, you can now ask it to perform GitHub operations using natural language.**

## Available GitHub Features

### 🔍 **Search & Discovery**
- **Search repositories**: "Find repositories about machine learning in Python"
- **Search code**: "Search for authentication functions in JavaScript"
- **Search issues**: "Find open issues labeled 'bug' in the repository"
- **Search pull requests**: "Show me PRs by author X"
- **Search users**: "Find users with expertise in React"

### 📋 **Repository Management**
- **Get file contents**: "Show me the README.md file from owner/repo"
- **List branches**: "List all branches in the repository"
- **List commits**: "Show recent commits on the main branch"
- **List tags/releases**: "Show all releases in the repository"
- **Create repository**: "Create a new repository called 'my-project'"
- **Fork repository**: "Fork the repository owner/repo"

### 🐛 **Issues Management**
- **List issues**: "Show me all open issues in owner/repo"
- **Get issue details**: "Get details for issue #123"
- **Create issue**: "Create a new issue about fixing the login bug"
- **Update issue**: "Close issue #5 as completed"
- **Add comments**: "Add a comment to issue #10"
- **Search issues**: "Find issues with 'authentication' in the title"

### 🔀 **Pull Requests**
- **List PRs**: "Show all open pull requests"
- **Get PR details**: "Get details and diff for PR #42"
- **Create PR**: "Create a pull request from feature-branch to main"
- **Review PR**: "Review pull request #15 and approve it"
- **Merge PR**: "Merge pull request #20"
- **Request Copilot review**: "Request a Copilot review for PR #25"

### 📝 **File Operations**
- **Create/update files**: "Create a new file config.json with this content"
- **Delete files**: "Delete the old-config.yaml file"
- **Push files**: "Push multiple files to the repository"

### 🌿 **Branch Management**
- **Create branch**: "Create a new branch called 'feature-auth' from main"
- **List branches**: "Show all branches in the repository"

### 👥 **User & Organization**
- **Get user profile**: "Show my GitHub profile"
- **Get teams**: "List teams I'm a member of"
- **Get team members**: "Show members of team 'developers'"

### 🏷️ **Labels & Tags**
- **Get labels**: "Show label details for 'bug'"
- **Get tags**: "Show details for tag v1.0.0"

## Example Commands

### Example 1: Search and Explore
```
You: "Search for repositories about NestJS with more than 100 stars"
Codex: Will use search_repositories tool to find matching repos
```

### Example 2: Work with Issues
```
You: "List all open issues in my repository bitcot/banking-app"
Codex: Will use list_issues tool to show open issues
```

### Example 3: Create a Pull Request
```
You: "Create a pull request from my feature branch to main with title 'Add authentication'"
Codex: Will use create_pull_request tool
```

### Example 4: Review Code
```
You: "Show me the diff for pull request #5 in bitcot/banking-app"
Codex: Will use pull_request_read tool with method 'get_diff'
```

### Example 5: Get Repository Files
```
You: "Show me the contents of src/main.ts in the repository"
Codex: Will use get_file_contents tool
```

## Usage Tips

1. **Be Specific**: When asking about repositories, include owner and repo name (e.g., "bitcot/banking-app")

2. **Natural Language**: Codex understands natural language, so you can ask:
   - "What are the open issues in my repo?"
   - "Show me PRs that need review"
   - "Find all Python repositories about machine learning"

3. **Pagination**: For large lists, Codex will automatically handle pagination (usually 5-10 items at a time)

4. **Context**: Codex will automatically use `get_me` to understand your permissions when needed

5. **Search Syntax**: For advanced searches, you can use GitHub's search syntax:
   - `language:python stars:>100`
   - `org:github is:issue label:bug`
   - `author:username created:>2024-01-01`

## Important Notes

- **Permissions**: Your GitHub token determines what operations you can perform
- **Read vs Write**: Some tools are read-only (marked with `readOnlyHint: true`)
- **Repository Context**: If you're in a project directory, Codex may infer the repository context
- **Draft Mode**: You can create draft PRs for work-in-progress

## Troubleshooting

If GitHub operations fail:
1. Check your token has the right permissions
2. Verify the repository owner/repo name is correct
3. Ensure you have write access for write operations
4. Check if the resource (issue, PR, etc.) exists

## Current Configuration

- **MCP Server**: GitHub MCP Server v0.20.1
- **Status**: Enabled and connected
- **Token**: Configured (stored in ~/.codex/config.toml)

Enjoy using GitHub with Codex! 🚀

