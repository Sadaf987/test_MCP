# School Attendance MCP Server

An MCP (Model Context Protocol) server for managing school attendance.

## Running the Server

Start the server with:

```bash
npm run start
```

The server will start on `http://localhost:3001` and is accessible at:
- **MCP Endpoint**: `http://localhost:3001/mcp`
- **Status Endpoint**: `http://localhost:3001/mcp/status`

## Connecting Codex

To connect codex (or any MCP client) to this server:

1. **Start the server** (see above)

2. **Configure codex** to use the MCP endpoint:
   - **URL**: `http://localhost:3001/mcp`
   - **Method**: `POST`
   - **Content-Type**: `application/json`

3. **Test the connection**:
   ```bash
   curl http://localhost:3001/mcp/status
   ```

## Available Tools

- `mark_attendance` - Mark attendance for a student

## MCP Protocol

The server implements the MCP protocol with the following methods:

- `tools/list` - List all available tools
- `tools/call` - Call a specific tool with arguments

Example request:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "mark_attendance",
    "arguments": {
      "studentId": "123",
      "date": "2024-01-15",
      "status": "present"
    }
  },
  "id": 1
}
```

