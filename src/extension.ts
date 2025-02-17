import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    console.log('Code Mentor AI is now active!');

    // Register the command for the status bar button
    const disposable = vscode.commands.registerCommand('code-mentor-ai.codementorai', async () => {
        // Open Webview panel
        const panel = vscode.window.createWebviewPanel(
            'codeMentorAI', // Identifies the type of the webview
            'AI Code Mentor', // Title of the panel
            vscode.ViewColumn.One, // Show in the first column
            {} // Additional options
        );

        // Set HTML content for the webview
        panel.webview.html = getWebviewContent();

        // Fetch AI suggestions or explanations here
        const explanation = await getAIExplanation('Explain recursion in simple terms');
        panel.webview.postMessage({ command: 'displayExplanation', explanation: explanation });
    });

    // Create the status bar item
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(light-bulb) Code Mentor AI";
    statusBarItem.command = "code-mentor-ai.codementorai";
    statusBarItem.tooltip = "Click to activate AI Code Mentor";
    statusBarItem.show();

    context.subscriptions.push(disposable);
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {}

// Helper function to fetch AI explanation
async function getAIExplanation(query: string): Promise<string> {
    try {
        const response = await axios.post("https://api.openai.com/v1/completions", {
            model: "gpt-4",
            prompt: query,
            max_tokens: 150
        }, {
            headers: { "Authorization": `Bearer YOUR_API_KEY` }
        });
        return response.data.choices[0].text;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Failed to fetch explanation.";
    }
}

// Helper function to generate the HTML for the webview
function getWebviewContent() {
    return `
        <html>
        <body>
            <h1>AI Code Mentor</h1>
            <div id="explanation">Loading...</div>
        </body>
        <script>
            const vscode = acquireVsCodeApi();
            window.addEventListener('message', (event) => {
                const message = event.data;
                if (message.command === 'displayExplanation') {
                    document.getElementById('explanation').innerText = message.explanation;
                }
            });
        </script>
        </html>
    `;
}
