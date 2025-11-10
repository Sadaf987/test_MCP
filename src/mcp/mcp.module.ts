import { Module } from '@nestjs/common';
import { CodeToolsResolver } from './tools/code-tools.resolver';
import { GitHubToolsResolver } from './tools/github-tools.resolver';

@Module({
  providers: [
    CodeToolsResolver,
    GitHubToolsResolver,
  ],
  exports: [
    CodeToolsResolver,
    GitHubToolsResolver,
  ],
})
export class McpModule {}

