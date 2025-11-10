#!/usr/bin/env node
/**
 * MCP Server for Banking App
 * Exposes code and GitHub tools via Model Context Protocol
 * 
 * Usage: node dist/src/mcp/mcp-server.js
 * Or: npm run mcp:server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class BankingAppMcpServer {
  private server: Server;
  private projectRoot: string;

  constructor() {
    this.server = new Server(
      {
        name: 'banking-app-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.projectRoot = process.cwd();
    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'read_file',
            description: 'Read a file from the project, optionally with line range',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the file relative to project root',
                },
                startLine: {
                  type: 'number',
                  description: 'Optional start line number',
                },
                endLine: {
                  type: 'number',
                  description: 'Optional end line number',
                },
              },
              required: ['filePath'],
            },
          },
          {
            name: 'list_files',
            description: 'List files in a directory',
            inputSchema: {
              type: 'object',
              properties: {
                directory: {
                  type: 'string',
                  description: 'Directory path (default: current directory)',
                },
                pattern: {
                  type: 'string',
                  description: 'Optional file pattern to match',
                },
                recursive: {
                  type: 'boolean',
                  description: 'Whether to search recursively',
                },
              },
            },
          },
          {
            name: 'search_code',
            description: 'Search for code patterns in the project',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                filePattern: {
                  type: 'string',
                  description: 'File pattern to search (default: **/*.ts)',
                },
                maxResults: {
                  type: 'number',
                  description: 'Maximum number of results (default: 10)',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_project_structure',
            description: 'Get the project structure and module organization',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_repo_info',
            description: 'Get information about the current GitHub repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner (optional)',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name (optional)',
                },
              },
            },
          },
          {
            name: 'get_git_status',
            description: 'Get the current git status (modified files, branches, etc.)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_recent_commits',
            description: 'Get recent commit history',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of commits to return (default: 10)',
                },
              },
            },
          },
          {
            name: 'get_file_diff',
            description: 'Get the diff for a specific file',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the file',
                },
                compareWith: {
                  type: 'string',
                  description: 'Git reference to compare with (default: HEAD)',
                },
              },
              required: ['filePath'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'read_file':
            return await this.handleReadFile(args as any);
          case 'list_files':
            return await this.handleListFiles(args as any);
          case 'search_code':
            return await this.handleSearchCode(args as any);
          case 'get_project_structure':
            return await this.handleGetProjectStructure();
          case 'get_repo_info':
            return await this.handleGetRepoInfo(args as any);
          case 'get_git_status':
            return await this.handleGetGitStatus();
          case 'get_recent_commits':
            return await this.handleGetRecentCommits(args as any);
          case 'get_file_diff':
            return await this.handleGetFileDiff(args as any);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });

    // List resources (empty for now)
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [],
      };
    });
  }

  // Code Tools Handlers
  private async handleReadFile(args: { filePath: string; startLine?: number; endLine?: number }) {
    const fullPath = path.join(this.projectRoot, args.filePath);
    
    if (!fs.existsSync(fullPath)) {
      return {
        content: [{
          type: 'text',
          text: `File not found: ${args.filePath}`,
        }],
      };
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    
    if (args.startLine || args.endLine) {
      const lines = content.split('\n');
      const start = (args.startLine || 1) - 1;
      const end = args.endLine || lines.length;
      content = lines.slice(start, end).join('\n');
    }

    return {
      content: [{
        type: 'text',
        text: `File: ${args.filePath}\n\n${content}`,
      }],
    };
  }

  private async handleListFiles(args: { directory?: string; pattern?: string; recursive?: boolean }) {
    const dirPath = path.join(this.projectRoot, args.directory || '.');
    const files: string[] = [];

    const listDir = (dir: string, depth: number = 0) => {
      if (depth > 3 && !args.recursive) return;
      
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.relative(this.projectRoot, fullPath);
        
        if (fs.statSync(fullPath).isDirectory()) {
          if (args.recursive) {
            listDir(fullPath, depth + 1);
          }
        } else {
          if (!args.pattern || relativePath.match(args.pattern)) {
            files.push(relativePath);
          }
        }
      }
    };

    listDir(dirPath);

    return {
      content: [{
        type: 'text',
        text: `Files in ${args.directory || 'root'}:\n${files.join('\n')}`,
      }],
    };
  }

  private async handleSearchCode(args: { query: string; filePattern?: string; maxResults?: number }) {
    const results: string[] = [];
    const maxResults = args.maxResults || 10;

    const searchInFile = (filePath: string) => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (results.length >= maxResults) return;
          if (line.toLowerCase().includes(args.query.toLowerCase())) {
            const relativePath = path.relative(this.projectRoot, filePath);
            results.push(`${relativePath}:${index + 1} - ${line.trim()}`);
          }
        });
      } catch (e) {
        // Skip files that can't be read
      }
    };

    const searchRecursive = (dir: string) => {
      if (results.length >= maxResults) return;
      
      const items = fs.readdirSync(dir);
      for (const item of items) {
        if (results.length >= maxResults) break;
        
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          if (!item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
            searchRecursive(fullPath);
          }
        } else if (item.endsWith('.ts') || item.endsWith('.js')) {
          searchInFile(fullPath);
        }
      }
    };

    searchRecursive(path.join(this.projectRoot, 'src'));

    return {
      content: [{
        type: 'text',
        text: `Found ${results.length} matches for "${args.query}":\n\n${results.join('\n')}`,
      }],
    };
  }

  private async handleGetProjectStructure() {
    const structure = this.getDirectoryTree(path.join(this.projectRoot, 'src'), 0, 3);
    
    return {
      content: [{
        type: 'text',
        text: `Project Structure:\n\n${structure}`,
      }],
    };
  }

  private getDirectoryTree(dir: string, depth: number, maxDepth: number): string {
    if (depth > maxDepth) return '';
    
    const indent = '  '.repeat(depth);
    let tree = '';
    
    try {
      const items = fs.readdirSync(dir).filter(item => 
        !item.startsWith('.') && item !== 'node_modules' && item !== 'dist'
      );
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          tree += `${indent}📁 ${item}/\n`;
          tree += this.getDirectoryTree(fullPath, depth + 1, maxDepth);
        } else {
          tree += `${indent}📄 ${item}\n`;
        }
      }
    } catch (e) {
      // Skip if can't read
    }
    
    return tree;
  }

  // GitHub Tools Handlers
  private async handleGetRepoInfo(args?: { owner?: string; repo?: string }) {
    try {
      const { stdout: remoteUrl } = await execAsync('git config --get remote.origin.url');
      const { stdout: currentBranch } = await execAsync('git branch --show-current');
      const { stdout: lastCommit } = await execAsync('git log -1 --pretty=format:"%h - %s (%an, %ar)"');
      
      return {
        content: [{
          type: 'text',
          text: `Repository Information:
- Remote: ${remoteUrl.trim()}
- Current Branch: ${currentBranch.trim()}
- Last Commit: ${lastCommit.trim()}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting repo info: ${error.message}`,
        }],
      };
    }
  }

  private async handleGetGitStatus() {
    try {
      const { stdout: status } = await execAsync('git status --short');
      const { stdout: branches } = await execAsync('git branch -a');
      
      return {
        content: [{
          type: 'text',
          text: `Git Status:\n\nModified Files:\n${status || 'No changes'}\n\nBranches:\n${branches}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting git status: ${error.message}`,
        }],
      };
    }
  }

  private async handleGetRecentCommits(args?: { limit?: number }) {
    try {
      const limit = args?.limit || 10;
      const { stdout } = await execAsync(
        `git log -${limit} --pretty=format:"%h | %an | %ar | %s"`
      );
      
      return {
        content: [{
          type: 'text',
          text: `Recent Commits:\n\n${stdout}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting commits: ${error.message}`,
        }],
      };
    }
  }

  private async handleGetFileDiff(args: { filePath: string; compareWith?: string }) {
    try {
      const compareWith = args.compareWith || 'HEAD';
      const { stdout } = await execAsync(
        `git diff ${compareWith} -- ${args.filePath}`
      );
      
      return {
        content: [{
          type: 'text',
          text: `Diff for ${args.filePath}:\n\n${stdout || 'No changes'}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting diff: ${error.message}`,
        }],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Banking App MCP Server running on stdio');
  }
}

// Start the server
async function main() {
  try {
    const server = new BankingAppMcpServer();
    await server.run();
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();

