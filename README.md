# GitHub Repository Reader - AnythingLLM Skill

This AnythingLLM skill allows you to read content from public GitHub repositories directly within your conversations.

## Features

- Read files from public GitHub repositories
- List directory contents
- Support for different branches
- Optional GitHub token for higher rate limits (60 req/hour without token, 5000 req/hour with token)

## Installation

### AnythingLLM Desktop for Mac

1. **Locate the skills directory**:

   ```bash
   ~/Library/Application Support/anythingllm-desktop/storage/plugins/agent-skills/
   ```

2. **Install the skill**:

   - Download or clone this repository
   - Copy the `anythingllm-github-skill` folder to the skills directory:

     ```bash
     cp -r anythingllm-github-skill ~/Library/Application\ Support/anythingllm-desktop/storage/plugins/agent-skills/
     ```

   - Alternatively, clone directly into the skills directory:

     ```bash
     cd ~/Library/Application\ Support/anythingllm-desktop/storage/plugins/agent-skills/
     git clone https://github.com/ericbrian/anythingllm-github-skill.git
     ```

3. **Restart AnythingLLM Desktop**: The skill will be automatically detected on restart

4. **(Optional) Configure GitHub Token**:
   - In AnythingLLM, go to Settings → Agent Skills
   - Find "AnythingLLM-GitHub-Skill" and click to configure
   - Add your GitHub Personal Access Token for higher rate limits (5000 req/hour vs 60 req/hour)

### General Installation

1. Copy this folder to your AnythingLLM skills directory
2. The skill will be automatically detected by AnythingLLM
3. (Optional) Configure a GitHub Personal Access Token in the skill settings for higher rate limits

## Usage

### Read a file

Read the README from microsoft/vscode repository

### Get directory contents

List files in the src directory of facebook/react

### Specify a branch

Get the package.json from the dev branch of nodejs/node

## Parameters

- **repository** (required): GitHub repository in format 'owner/repo'
- **path** (optional): Path to file or directory in the repository
- **branch** (optional): Branch name (default: 'main')

## Configuration

### GitHub Token (Optional)

To avoid rate limiting, you can provide a GitHub Personal Access Token:

1. Go to GitHub Settings > Developer Settings > Personal Access Tokens
2. Create a new token with `public_repo` scope
3. Add the token in the skill settings

## Examples

```javascript
// Read a specific file
{
  repository: "microsoft/vscode",
  path: "README.md",
  branch: "main"
}

// List directory contents
{
  repository: "facebook/react",
  path: "packages",
  branch: "main"
}

// Read from root directory
{
  repository: "nodejs/node",
  path: "",
  branch: "main"
}
```

## Response Format

### File Response

```json
{
  "success": true,
  "repository": "owner/repo",
  "path": "path/to/file.js",
  "type": "file",
  "size": 1234,
  "content": "file contents here...",
  "url": "https://github.com/owner/repo/blob/main/path/to/file.js"
}
```

### Directory Response

```json
{
  "success": true,
  "repository": "owner/repo",
  "path": "src",
  "type": "directory",
  "items": [
    {
      "name": "index.js",
      "path": "src/index.js",
      "type": "file",
      "size": 1234,
      "url": "https://github.com/owner/repo/blob/main/src/index.js"
    }
  ],
  "count": 1
}
```

## License

MIT
