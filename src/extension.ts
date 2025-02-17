import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "code-mentor-ai" is now active!');

	// Register the command
	const disposable = vscode.commands.registerCommand('code-mentor-ai.codementorai', () => {
		vscode.window.showInformationMessage('Activating your AI Code Mentor....');
	});

	// ✅ Create a Status Bar Button
	let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = "$(light-bulb) Code Mentor AI";  
	statusBarItem.command = "code-mentor-ai.codementorai"; 
	statusBarItem.tooltip = "Click to activate AI Code Mentor";
	statusBarItem.show();  

	// Push to subscriptions
	context.subscriptions.push(disposable);
	context.subscriptions.push(statusBarItem);
}

export function deactivate() {}
