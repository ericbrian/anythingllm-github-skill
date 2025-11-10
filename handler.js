/**
 * AnythingLLM GitHub Repository Reader Skill
 * Reads content from public GitHub repositories using the GitHub API
 */

module.exports.runtime = {
  handler: async function ({ repository, path = "", branch = "main" }) {
    try {
      // Validate repository format
      if (!repository || !repository.includes('/')) {
        return {
          success: false,
          error: "Repository must be in format 'owner/repo'"
        };
      }

      const [owner, repo] = repository.split('/');
      
      // Get GitHub token from setup args if available
      const githubToken = this.config.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
      
      // Build headers
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AnythingLLM-GitHub-Skill'
      };
      
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      // GitHub API endpoint for repository contents
      const apiUrl = path 
        ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
        : `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;

      console.log(`Fetching from GitHub: ${apiUrl}`);

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: `Repository, path, or branch not found: ${repository}/${path} (${branch})`
          };
        }
        if (response.status === 403) {
          return {
            success: false,
            error: "GitHub API rate limit exceeded. Please provide a GitHub token in settings."
          };
        }
        return {
          success: false,
          error: `GitHub API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();

      // Handle single file
      if (data.type === 'file') {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return {
          success: true,
          repository,
          path: data.path,
          type: 'file',
          size: data.size,
          content: content,
          url: data.html_url
        };
      }

      // Handle directory
      if (Array.isArray(data)) {
        const items = data.map(item => ({
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size,
          url: item.html_url
        }));

        return {
          success: true,
          repository,
          path: path || 'root',
          type: 'directory',
          items: items,
          count: items.length
        };
      }

      return {
        success: false,
        error: "Unexpected response format from GitHub API"
      };

    } catch (error) {
      console.error("GitHub Skill Error:", error);
      return {
        success: false,
        error: error.message || "Unknown error occurred"
      };
    }
  }
};
