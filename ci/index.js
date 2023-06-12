const fs = require('fs');
const { execSync } = require('child_process');

function getChangedFiles(directoryPath) {
  // Change to the directory
  process.chdir(directoryPath);

  // Execute 'git status' command to get the changed files
  const gitStatusOutput = execSync('git status --porcelain').toString();

  // Split the output into individual lines
  const fileStatuses = gitStatusOutput.trim().split('\n');

  // Filter out the untracked files
  const changedFiles = fileStatuses
    .filter((status) => !status.startsWith('??'))
    .map((status) => status.substring(3));

  // Return the list of changed files
  return changedFiles;
}

// Example usage
const directoryPath = '/Users/rfcku/sites/rfcku/api/src';
const changedFiles = getChangedFiles(directoryPath);
console.log(changedFiles);
