# Simplified MCP Implementation - Code & GitHub Only

## What We're Building

A lightweight MCP server in your NestJS app that provides tools for:
- ✅ Code operations (read files, search code, analyze structure)
- ✅ GitHub operations (integrate with your existing GitHub MCP)
- ❌ No business logic (no user management, no banking operations)

**Time: 1-2 hours** (much simpler than the full plan!)

---

## Step 1: Install Dependencies (5 min)

```bash
npm install @nestjs-mcp/server @modelcontextprotocol/sdk zod
```

---

## Step 2: Create MCP Configuration (10 min)

Create `src/mcp/mcp.config.ts`:

```typescript
import { McpModuleOptions } from '@nestjs-mcp/server';

export const mcpConfig: McpModuleOptions = {
  name: 'Banking App Code & GitHub MCP',
  version: '1.0.0',
  instructions: 'MCP server for code operations and GitHub integration',
  logging: {
    enabled: true,
    level: 'info'
  },
  transports: {
    streamable: { enabled: true },
    sse: { enabled: false }
  }
};
```

---

## Step 3: Create Code Tools (30 min)

Create `src/mcp/tools/code-tools.resolver.ts`:

```typescript
import { Resolver, Tool } from '@nestjs-mcp/server';
import { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { RequestHandlerExtra } from '@nestjs-mcp/server';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const ReadFileParams = z.object({
  filePath: z.string(),
  startLine: z.number().optional(),
  endLine: z.number().optional()
});

const SearchCodeParams = z.object({
  query: z.string(),
  filePattern: z.string().optional().default('**/*.ts'),
  maxResults: z.number().optional().default(10)
});

@Resolver('code')
export class CodeToolsResolver {
  private readonly projectRoot = process.cwd();

  @Tool({
    name: 'read_file',
    description: 'Read a file from the project, optionally with line range',
    paramsSchema: ReadFileParams
  })
  readFile(
    params: z.infer<typeof ReadFileParams>,
    extra: RequestHandlerExtra
  ): CallToolResult {
    try {
      const fullPath = path.join(this.projectRoot, params.filePath);
      
      if (!fs.existsSync(fullPath)) {
        return {
          content: [{
            type: 'text',
            text: `File not found: ${params.filePath}`
          }]
        };
      }

      let content = fs.readFileSync(fullPath, 'utf-8');
      
      if (params.startLine || params.endLine) {
        const lines = content.split('\n');
        const start = (params.startLine || 1) - 1;
        const end = params.endLine || lines.length;
        content = lines.slice(start, end).join('\n');
      }

      return {
        content: [{
          type: 'text',
          text: `File: ${params.filePath}\n\n${content}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error reading file: ${error.message}`
        }]
      };
    }
  }

  @Tool({
    name: 'list_files',
    description: 'List files in a directory',
    paramsSchema: z.object({
      directory: z.string().optional().default('.'),
      pattern: z.string().optional(),
      recursive: z.boolean().optional().default(false)
    })
  })
  listFiles(
    params: { directory?: string; pattern?: string; recursive?: boolean },
    extra: RequestHandlerExtra
  ): CallToolResult {
    try {
      const dirPath = path.join(this.projectRoot, params.directory || '.');
      const files: string[] = [];

      const listDir = (dir: string, depth: number = 0) => {
        if (depth > 3 && !params.recursive) return; // Limit depth
        
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const relativePath = path.relative(this.projectRoot, fullPath);
          
          if (fs.statSync(fullPath).isDirectory()) {
            if (params.recursive) {
              listDir(fullPath, depth + 1);
            }
          } else {
            if (!params.pattern || relativePath.match(params.pattern)) {
              files.push(relativePath);
            }
          }
        }
      };

      listDir(dirPath);

      return {
        content: [{
          type: 'text',
          text: `Files in ${params.directory || 'root'}:\n${files.join('\n')}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error listing files: ${error.message}`
        }]
      };
    }
  }

  @Tool({
    name: 'search_code',
    description: 'Search for code patterns in the project',
    paramsSchema: SearchCodeParams
  })
  searchCode(
    params: z.infer<typeof SearchCodeParams>,
    extra: RequestHandlerExtra
  ): CallToolResult {
    try {
      const results: string[] = [];
      const searchInFile = (filePath: string) => {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n');
          
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(params.query.toLowerCase())) {
              results.push(`${filePath}:${index + 1} - ${line.trim()}`);
              if (results.length >= params.maxResults) return;
            }
          });
        } catch (e) {
          // Skip files that can't be read
        }
      };

      const searchRecursive = (dir: string) => {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          if (results.length >= params.maxResults) break;
          
          const fullPath = path.join(dir, item);
          if (fs.statSync(fullPath).isDirectory()) {
            if (!item.startsWith('.') && item !== 'node_modules') {
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
          text: `Found ${results.length} matches for "${params.query}":\n\n${results.join('\n')}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error searching code: ${error.message}`
        }]
      };
    }
  }

  @Tool({
    name: 'get_project_structure',
    description: 'Get the project structure and module organization'
  })
  getProjectStructure(extra: RequestHandlerExtra): CallToolResult {
    try {
      const structure = this.getDirectoryTree(path.join(this.projectRoot, 'src'), 0, 3);
      
      return {
        content: [{
          type: 'text',
          text: `Project Structure:\n\n${structure}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting structure: ${error.message}`
        }]
      };
    }
  }

  private getDirectoryTree(dir: string, depth: number, maxDepth: number): string {
    if (depth > maxDepth) return '';
    
    const indent = '  '.repeat(depth);
    let tree = '';
    
    try {
      const items = fs.readdirSync(dir).filter(item => 
        !item.startsWith('.') && item !== 'node_modules'
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
}
```

---

## Step 4: Create GitHub Integration Tools (30 min)

Create `src/mcp/tools/github-tools.resolver.ts`:

```typescript
import { Resolver, Tool } from '@nestjs-mcp/server';
import { CallToolResult } from '@modelcontextprotocol/sdk/types';
import { RequestHandlerExtra } from '@nestjs-mcp/server';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Resolver('github')
export class GitHubToolsResolver {
  @Tool({
    name: 'get_repo_info',
    description: 'Get information about the current GitHub repository',
    paramsSchema: z.object({
      owner: z.string().optional(),
      repo: z.string().optional()
    })
  })
  async getRepoInfo(
    params: { owner?: string; repo?: string },
    extra: RequestHandlerExtra
  ): CallToolResult {
    try {
      // Get git remote info
      const { stdout: remoteUrl } = await execAsync('git config --get remote.origin.url');
      const { stdout: currentBranch } = await execAsync('git branch --show-current');
      const { stdout: lastCommit } = await execAsync('git log -1 --pretty=format:"%h - %s (%an, %ar)"');
      
      return {
        content: [{
          type: 'text',
          text: `Repository Information:
          - Remote: ${remoteUrl.trim()}
          - Current Branch: ${currentBranch.trim()}
          - Last Commit: ${lastCommit.trim()}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting repo info: ${error.message}`
        }]
      };
    }
  }

  @Tool({
    name: 'get_git_status',
    description: 'Get the current git status (modified files, branches, etc.)'
  })
  async getGitStatus(extra: RequestHandlerExtra): CallToolResult {
    try {
      const { stdout: status } = await execAsync('git status --short');
      const { stdout: branches } = await execAsync('git branch -a');
      
      return {
        content: [{
          type: 'text',
          text: `Git Status:\n\nModified Files:\n${status || 'No changes'}\n\nBranches:\n${branches}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting git status: ${error.message}`
        }]
      };
    }
  }

  @Tool({
    name: 'get_recent_commits',
    description: 'Get recent commit history',
    paramsSchema: z.object({
      limit: z.number().optional().default(10)
    })
  })
  async getRecentCommits(
    params: { limit?: number },
    extra: RequestHandlerExtra
  ): CallToolResult {
    try {
      const { stdout } = await execAsync(
        `git log -${params.limit || 10} --pretty=format:"%h | %an | %ar | %s"`
      );
      
      return {
        content: [{
          type: 'text',
          text: `Recent Commits:\n\n${stdout}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting commits: ${error.message}`
        }]
      };
    }
  }

  @Tool({
    name: 'get_file_diff',
    description: 'Get the diff for a specific file',
    paramsSchema: z.object({
      filePath: z.string(),
      compareWith: z.string().optional().default('HEAD')
    })
  })
  async getFileDiff(
    params: { filePath: string; compareWith?: string },
    extra: RequestHandlerExtra
  ): CallToolResult {
    try {
      const { stdout } = await execAsync(
        `git diff ${params.compareWith} -- ${params.filePath}`
      );
      
      return {
        content: [{
          type: 'text',
          text: `Diff for ${params.filePath}:\n\n${stdout || 'No changes'}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting diff: ${error.message}`
        }]
      };
    }
  }
}
```

---

## Step 5: Update App Module (10 min)

Update `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
// ... existing imports ...
import { McpModule } from '@nestjs-mcp/server';
import { mcpConfig } from './mcp/mcp.config';
import { CodeToolsResolver } from './mcp/tools/code-tools.resolver';
import { GitHubToolsResolver } from './mcp/tools/github-tools.resolver';

@Module({
  imports: [
    // ... existing imports ...
    McpModule.forRoot(mcpConfig),
  ],
  controllers: [/* ... existing controllers ... */],
  providers: [
    // ... existing providers ...
    CodeToolsResolver,
    GitHubToolsResolver,
  ],
})
export class AppModule {}
```

---

## Step 6: Test It (15 min)

1. Start your app:
   ```bash
   npm run start:dev
   ```

2. Test with MCP Inspector:
   ```bash
   npx @modelcontextprotocol/inspector
   ```

3. Or use Codex CLI:
   ```bash
   npx @openai/codex "Read the file src/app.module.ts"
   npx @openai/codex "Get git status for this repository"
   ```

---

## Available Tools

### Code Tools:
- `read_file` - Read any file in your project
- `list_files` - List files in directories
- `search_code` - Search for code patterns
- `get_project_structure` - Get project structure

### GitHub Tools:
- `get_repo_info` - Get repository information
- `get_git_status` - Get current git status
- `get_recent_commits` - Get commit history
- `get_file_diff` - Get file diffs

---

## Usage Examples

```bash
# Read a file
npx @openai/codex "Read src/app.module.ts"

# Search code
npx @openai/codex "Search for 'UserRepository' in the codebase"

# Get git status
npx @openai/codex "What files have been modified?"

# Get project structure
npx @openai/codex "Show me the project structure"
```

---

## Summary

This gives you:
- ✅ Code reading and searching tools
- ✅ GitHub/git integration tools
- ✅ Simple, focused implementation
- ✅ No business logic complexity
- ✅ Works with your existing Codex CLI + GitHub MCP

**Total time: 1-2 hours** (much faster than the full plan!)

