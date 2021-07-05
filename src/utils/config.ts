import * as vscode from 'vscode';

export const fileName = vscode.workspace.getConfiguration().get('jsonGoTs.fileName');

export const filePath: string = vscode.workspace.getConfiguration().get('jsonGoTs.filePath');
