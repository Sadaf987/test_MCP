import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

export interface ToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

@Injectable()
export class CodeToolsResolver {
  private readonly projectRoot = process.cwd();

  /**
   * Read a file from the project, optionally with line range
   */
  async readFile(params: {
    filePath: string;
    startLine?: number;
    endLine?: number;
  }): Promise<ToolResult> {
    try {
      const fullPath = path.join(this.projectRoot, params.filePath);
      
      if (!fs.existsSync(fullPath)) {
        return {
          content: [{
            type: 'text',
            text: `File not found: ${params.filePath}`,
          }],
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
          text: `File: ${params.filePath}\n\n${content}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error reading file: ${error.message}`,
        }],
      };
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(params: {
    directory?: string;
    pattern?: string;
    recursive?: boolean;
  }): Promise<ToolResult> {
    try {
      const dirPath = path.join(this.projectRoot, params.directory || '.');
      const files: string[] = [];

      const listDir = (dir: string, depth: number = 0) => {
        if (depth > 3 && !params.recursive) return;
        
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
          text: `Files in ${params.directory || 'root'}:\n${files.join('\n')}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error listing files: ${error.message}`,
        }],
      };
    }
  }

  /**
   * Search for code patterns in the project
   */
  async searchCode(params: {
    query: string;
    filePattern?: string;
    maxResults?: number;
  }): Promise<ToolResult> {
    try {
      const results: string[] = [];
      const maxResults = params.maxResults || 10;

      const searchInFile = (filePath: string) => {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n');
          
          lines.forEach((line, index) => {
            if (results.length >= maxResults) return;
            if (line.toLowerCase().includes(params.query.toLowerCase())) {
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
          text: `Found ${results.length} matches for "${params.query}":\n\n${results.join('\n')}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error searching code: ${error.message}`,
        }],
      };
    }
  }

  /**
   * Get the project structure and module organization
   */
  async getProjectStructure(): Promise<ToolResult> {
    try {
      const structure = this.getDirectoryTree(path.join(this.projectRoot, 'src'), 0, 3);
      
      return {
        content: [{
          type: 'text',
          text: `Project Structure:\n\n${structure}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting structure: ${error.message}`,
        }],
      };
    }
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
}

