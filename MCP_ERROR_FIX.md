# MCP Server Error Fix

## Error You're Seeing

```
ERROR rmcp::transport::async_rw: Error reading from stream: serde error EOF while parsing a value at line 1 column 0
```

## What This Means

The MCP server is starting but then immediately closing or crashing. This happens when:
1. The server process exits unexpectedly
2. The server crashes on startup
3. There's a communication issue between Codex and the server

## Fix Applied

### 1. Changed Command Configuration

**Before:**
```toml
[mcp_servers.banking-app]
command = "npm"
args = ["run", "mcp:server", "--prefix", "/home/bitcot/projects1/banking-app"]
```

**After:**
```toml
[mcp_servers.banking-app]
command = "ts-node"
args = ["/home/bitcot/projects1/banking-app/src/mcp/mcp-server.ts"]
cwd = "/home/bitcot/projects1/banking-app"
```

### 2. Added Error Handling

Added proper error handling to the server to catch and report issues.

## Testing

### Test 1: Verify Configuration
```bash
npx @openai/codex mcp list
```

You should see `banking-app` in the list.

### Test 2: Test Server Directly
```bash
cd /home/bitcot/projects1/banking-app
ts-node src/mcp/mcp-server.ts
```

The server should start and wait (it won't output anything, that's normal).

### Test 3: Test with Codex
```bash
npx @openai/codex "Get repository information"
```

## Alternative: Compile First

If `ts-node` still has issues, you can compile the server first:

```bash
# Compile
npm run mcp:build

# Update config to use compiled version
```

Then update `~/.codex/config.toml`:
```toml
[mcp_servers.banking-app]
command = "node"
args = ["/home/bitcot/projects1/banking-app/dist/src/mcp/mcp-server.js"]
cwd = "/home/bitcot/projects1/banking-app"
```

## Troubleshooting

### If error persists:

1. **Check ts-node is installed:**
   ```bash
   which ts-node
   npm list ts-node
   ```

2. **Check TypeScript config:**
   ```bash
   cat tsconfig.json
   ```

3. **Try with tsx instead:**
   ```bash
   npm install -g tsx
   ```
   
   Then update config:
   ```toml
   command = "tsx"
   ```

4. **Check for import errors:**
   ```bash
   ts-node src/mcp/mcp-server.ts
   ```
   
   Look for any error messages.

5. **Verify MCP SDK is installed:**
   ```bash
   npm list @modelcontextprotocol/sdk
   ```

## Quick Fix Summary

The configuration has been updated to use `ts-node` directly instead of `npm run`. This should resolve the EOF error.

Try again:
```bash
npx @openai/codex "Get repository information"
```

If it still doesn't work, check the troubleshooting steps above.

