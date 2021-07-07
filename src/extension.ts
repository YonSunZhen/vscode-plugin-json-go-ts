import * as vscode from 'vscode';
import { provideCompletionItems, resolveCompletionItem } from './utils/auto-completion';
import { provideDefinition } from './utils/go-to-definition';
import { provideDocumentHighlights } from './utils/high-light';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// console.log('Congratulations, your extension "json-go-ts" is now active!');

	// let disposable = vscode.commands.registerCommand('json-go-ts.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Hello World from hello-world111!');
	// });
	// context.subscriptions.push(disposable);

	// 监听窗口中的文件时执行这个
	// vscode.window.showInformationMessage('Hello World from hello-world111!');
	// let collection = vscode.languages.createDiagnosticCollection('myextension');
	// let uri = vscode.window.activeTextEditor.document.uri;
	// collection.set(uri, [
	// 		{
	// 			// range: new vscode.Range(2, 24, 1, 25),
	// 			range: new vscode.Range(new vscode.Position(1,23), new vscode.Position(1,37)),
	// 			message: 'We found an error',
	// 			severity: 0
	// 		}
	// ]);

	// 自动补全; 
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider({language: 'json', scheme: 'file'}, {
		provideCompletionItems, resolveCompletionItem
	}, '.'));

	// // 跳转到定义
	context.subscriptions.push(vscode.languages.registerDefinitionProvider({language: 'json', scheme: 'file'}, {
		provideDefinition
	}));

	// 高亮显示
	// context.subscriptions.push(vscode.languages.registerDocumentHighlightProvider({language: 'json', scheme: 'file'}, {
	// 	provideDocumentHighlights
	// }));


}



// this method is called when your extension is deactivated
export function deactivate() {}
