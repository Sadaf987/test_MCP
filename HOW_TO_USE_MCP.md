# How to Use Your MCP Tools with Codex

## ✅ What's Been Created

1. **MCP Server** (`src/mcp/mcp-server.ts`) - Standalone MCP server that exposes your tools
2. **Codex Config** (`~/.codex/config.toml`) - Updated to include your local MCP server
3. **NPM Scripts** - Added `mcp:server` command

## 🚀 How to Use

### Step 1: Start Your MCP Server

The MCP server is already configured in Codex, but you can test it manually:

```bash
npm run mcp:server
```

This will start the MCP server and it will wait for connections via stdio.

### Step 2: Use with Codex CLI

Now you can use Codex CLI and it will automatically connect to your MCP server:

```bash
# Read a file
npx @openai/codex "Read the file src/app.module.ts"

# Search code
npx @openai/codex "Search for UserRepository in the codebase"

# Get project structure
npx @openai/codex "Show me the project structure"

# Get git status
npx @openai/codex "What files have been modified in git?"

# Get recent commits
npx @openai/codex "Show me the last 5 commits"

# Get file diff
npx @openai/codex "Show me the diff for src/app.module.ts"
```

### Step 3: Verify It's Working

Check if Codex can see your MCP server:

```bash
npx @openai/codex mcp list
```

You should see:
- `github` - GitHub MCP server (Docker)
- `banking-app` - Your local MCP server ✅

## 🛠️ Available Tools

Your MCP server exposes these tools:

### Code Tools:
1. **read_file** - Read any file from your project
   - Parameters: `filePath`, `startLine?`, `endLine?`

2. **list_files** - List files in a directory
   - Parameters: `directory?`, `pattern?`, `recursive?`

3. **search_code** - Search for code patterns
   - Parameters: `query`, `filePattern?`, `maxResults?`

4. **get_project_structure** - Get project structure
   - Parameters: none

### GitHub Tools:
5. **get_repo_info** - Get repository information
   - Parameters: `owner?`, `repo?`

6. **get_git_status** - Get git status
   - Parameters: none

7. **get_recent_commits** - Get commit history
   - Parameters: `limit?`

8. **get_file_diff** - Get file diff
   - Parameters: `filePath`, `compareWith?`

## 📝 Example Usage

### Example 1: Read a File
```
You: "Read src/app.module.ts"
Codex: *Uses read_file tool* *Shows file contents*
```

### Example 2: Search Code
```
You: "Find where UserRepository is used"
Codex: *Uses search_code tool* *Shows all matches*
```

### Example 3: Git Operations
```
You: "What files have I changed?"
Codex: *Uses get_git_status tool* *Shows modified files*
```

## 🔧 Troubleshooting

### Issue: MCP server not found
**Solution:** Make sure you're in the project directory:
```bash
cd /home/bitcot/projects1/banking-app
```

### Issue: "Command not found"
**Solution:** Make sure npm is in your PATH and the project is built:
```bash
npm install
```

### Issue: Codex can't connect
**Solution:** Check the config path in `~/.codex/config.toml`:
```toml
[mcp_servers.banking-app]
command = "npm"
args = ["run", "mcp:server", "--prefix", "/home/bitcot/projects1/banking-app"]
```

### Test the server manually:
```bash
# In one terminal
npm run mcp:server

# In another terminal, test with MCP inspector
npx @modelcontextprotocol/inspector
```

## 🎯 Next Steps

1. **Test the tools** - Try each tool with Codex
2. **Add more tools** - Extend `mcp-server.ts` with more functionality
3. **Integrate with your app** - Use the resolvers in your NestJS controllers
4. **Customize** - Modify tools to fit your specific needs

## 💡 Tips

- The MCP server runs on stdio (standard input/output)
- Codex automatically manages the connection
- You can run the server standalone for testing
- Tools are automatically discovered by Codex
- All tools return text content that Codex can understand

## 📚 Learn More

- MCP SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Codex CLI: https://github.com/openai/codex-cli
- Your tools are in: `src/mcp/tools/`

Enjoy using your MCP tools with Codex! 🚀

