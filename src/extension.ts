import * as vscode from 'vscode';
import { provideCompletionItems, resolveCompletionItem } from './utils/auto-completion';
import { provideDefinition } from './utils/go-to-definition';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "json-go-ts" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hello-world.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from hello-world111!');
	});
	context.subscriptions.push(disposable);

	// 自动补全 
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider({language: 'json', scheme: 'file'}, {
		provideCompletionItems, resolveCompletionItem
	}, '.'));

	// 跳转到定义
	context.subscriptions.push(vscode.languages.registerDefinitionProvider({language: 'json', scheme: 'file'}, {
		provideDefinition
	}));


}



// this method is called when your extension is deactivated
export function deactivate() {}
