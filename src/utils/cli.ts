export const cliExecute = async (commandStr: string) => {
  const response: string[] = [];

  switch (commandStr) {
    case "version":
      response.push('Lava suite. v0.1.1');
      break;
    case "help":
      response.push('Help message');
      break;
    case "list":
      response.push('Available commands:');
      response.push('list');
      response.push('help');
      response.push('version');
      response.push('clear');
      break;
    default:
      response.push('command not found')
  }

  return response;
}