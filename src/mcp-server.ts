// src/mcp-server.ts

import express from 'express';
import { markAttendance } from './tools/attendanceTools.js';

const app = express();
const port = 3001;

// Enable CORS for codex to connect
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Tool registration
const tools = {
  mark_attendance: markAttendance,
};

// MCP call endpoint
app.post('/mcp', async (req, res) => {
  const { method, params, id } = req.body;

  if (method === 'tools/list') {
    // Return list of available tools
    res.json({
      jsonrpc: '2.0',
      result: {
        tools: Object.keys(tools).map(name => ({
          name,
          description: `Tool: ${name}`,
        })),
      },
      id,
    });
    return;
  }

  // Call the tool based on the method
  if (method === 'tools/call') {
    const { name, arguments: toolArguments } = params;
    const tool = name in tools ? tools[name as keyof typeof tools] : undefined;

    if (tool) {
      try {
        const result = await tool(toolArguments);
        res.json({ jsonrpc: '2.0', result, id });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.json({ jsonrpc: '2.0', error: { code: -32000, message }, id });
      }
    } else {
      res.json({ jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id });
    }
  } else {
    res.json({ jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id });
  }
});

// Server status endpoint
app.get('/mcp/status', (req, res) => {
  res.json({ status: 'OK', tools: Object.keys(tools) });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`MCP server listening at http://localhost:${port}`);
  console.log(`Server is accessible from codex at http://localhost:${port}/mcp`);
});
