export interface McpServerConfig {
  name: string;
  version: string;
  instructions: string;
  logging: {
    enabled: boolean;
    level: 'error' | 'warn' | 'info' | 'debug' | 'verbose';
  };
}

export const mcpConfig: McpServerConfig = {
  name: 'Banking App Code & GitHub MCP',
  version: '1.0.0',
  instructions: 'MCP server for code operations and GitHub integration. Provides tools to read files, search code, get project structure, and interact with Git/GitHub.',
  logging: {
    enabled: true,
    level: 'info',
  },
};

