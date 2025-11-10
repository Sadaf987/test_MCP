import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

@Injectable()
export class GitHubToolsResolver {
  /**
   * Get information about the current GitHub repository
   */
  async getRepoInfo(params?: {
    owner?: string;
    repo?: string;
  }): Promise<ToolResult> {
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

  /**
   * Get the current git status (modified files, branches, etc.)
   */
  async getGitStatus(): Promise<ToolResult> {
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

  /**
   * Get recent commit history
   */
  async getRecentCommits(params?: {
    limit?: number;
  }): Promise<ToolResult> {
    try {
      const limit = params?.limit || 10;
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

  /**
   * Get the diff for a specific file
   */
  async getFileDiff(params: {
    filePath: string;
    compareWith?: string;
  }): Promise<ToolResult> {
    try {
      const compareWith = params.compareWith || 'HEAD';
      const { stdout } = await execAsync(
        `git diff ${compareWith} -- ${params.filePath}`
      );
      
      return {
        content: [{
          type: 'text',
          text: `Diff for ${params.filePath}:\n\n${stdout || 'No changes'}`,
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
}

