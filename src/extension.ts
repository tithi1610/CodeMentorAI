import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    console.log('Code Mentor AI is now active!');

    // Register the command for AI explanation
    const disposable = vscode.commands.registerCommand('code-mentor-ai.codementorai', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage("Please open a file and select some code.");
            return;
        }

        const selectedText = editor.document.getText(editor.selection);
        if (!selectedText) {
            vscode.window.showWarningMessage("Select some code to explain.");
            return;
        }

        // Open Webview panel
        const panel = vscode.window.createWebviewPanel(
            'codeMentorAI', // Identifies the type of the webview
            'AI Code Mentor', // Title of the panel
            vscode.ViewColumn.Beside, // Show beside the editor
            { enableScripts: true } // Enable JavaScript in webview
        );

        // Set HTML content for the webview
        panel.webview.html = getWebviewContent("Loading explanation...");

        // Fetch AI-generated explanation
        const explanation = await getAIExplanation(selectedText);
        panel.webview.html = getWebviewContent(explanation);
    });

    // Create the status bar item
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(light-bulb) Explain Code";
    statusBarItem.command = "code-mentor-ai.codementorai";
    statusBarItem.tooltip = "Click to get AI explanation for selected code";
    statusBarItem.show();

    context.subscriptions.push(disposable);
    context.subscriptions.push(statusBarItem);
}

// Cleanup function
export function deactivate() {}

// Function to fetch AI-generated explanation from Google Gemini
async function getAIExplanation(code: string): Promise<string> {
    const GEMINI_API_KEY = "AIzaSyCaXmHEvnioAj4goDQx3ydBoG2sn9hW2dY"; // Replace with your actual API Key

    try {
        console.log("Fetching AI response from Google Gemini...");
        
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: `Explain the following code in short and simple terms:\n\n${code}
                    
                    please format it in a way that it looks formatted when i copy and paste it somewhere else` }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        // Extract response text
        const explanation = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        
        console.log("AI Response:", explanation);
        return explanation;
    } catch (error: any) {
        console.error("Error fetching AI response:", error.response?.data || error.message);
        return "⚠️ Failed to fetch explanation. Check your API key and internet connection.";
    }
}

// Function to generate HTML for the webview panel
function getWebviewContent(explanation: string) {
    return `
        <html>
        <body style="font-family: Arial, sans-serif; padding: 10px;">
            <h2>Code Explanation</h2>
            <p>${explanation.replace(/\n/g, "<br>")}</p>
        </body>
        </html>
    `;
}
