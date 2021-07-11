import * as vscode from 'vscode';
import { provideCompletionItems, resolveCompletionItem } from './utils/auto-completion';
import { provideDefinition } from './utils/go-to-definition';
import { updateDiagnostics } from './utils/diagnostic';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// console.log('Congratulations, your extension "json-go-ts" is now active!');

	// let disposable = vscode.commands.registerCommand('json-go-ts.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Hello World from hello-world111!');
	// });
	// context.subscriptions.push(disposable);

	// 自动补全; 
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider({language: 'json', scheme: 'file'}, {
		provideCompletionItems, resolveCompletionItem
	}, '.'));

	// 跳转到定义
	context.subscriptions.push(vscode.languages.registerDefinitionProvider({language: 'json', scheme: 'file'}, {
		provideDefinition
	}));

	// 智能诊断
	const collection = vscode.languages.createDiagnosticCollection('testFnName');
	if (vscode.window.activeTextEditor) {
		collection.clear();
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}
	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(editor => {
		if (editor) {
			collection.clear();
			updateDiagnostics(editor.document, collection);
		}
	}));


}


// this method is called when your extension is deactivated
export function deactivate() {}
