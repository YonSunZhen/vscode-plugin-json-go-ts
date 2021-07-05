import * as vscode from 'vscode';
import { getFnFromTsFile } from './index';
import { getFilePath } from './project-path';
import { fileName, filePath } from './config';

export function provideCompletionItems(document, position, token, context) {
  console.log(filePath, fileName);
  const _filePath = getFilePath(document, filePath);
  const _fnData = getFnFromTsFile(`${_filePath}.ts`);
  const linePrefix = document.lineAt(position).text.substr(0, position.character);
  if (!linePrefix.endsWith(`"${fileName}.`)) {
    return undefined;
  }
  let myitem = (text: string) => {
    let item = new vscode.CompletionItem(text, vscode.CompletionItemKind.Function);
    item.range = new vscode.Range(position, position);
    return item;
  };
  return _fnData.map(_fnItem => myitem(_fnItem.fnName));
}

export function resolveCompletionItem(item, token) {
  return null;
}