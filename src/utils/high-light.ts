import * as vscode from 'vscode';
import { getFnFromTsFile, FnInfo } from './index';
import { getFilePath } from './project-path';
import { fileName, filePath } from './config';

let collection = vscode.languages.createDiagnosticCollection('myExtension');

export function provideDocumentHighlights(document: vscode.TextDocument, position, token) {
  collection.clear();
  const _filePath = getFilePath(document, filePath);
  const _fnData = getFnFromTsFile(`${_filePath}.ts`);  
  const word = document.getText(); // 获取当前光标输入字符
  const _wordObj = JSON.parse(word);
  let index = 0;
  // TODO: 优化
  for(const key in _wordObj) {
    const _item = _wordObj[key];
    index++;
    if(Array.isArray(_item)) {
      // for(const item of _item) {
      //   index++;
      //   for(const _key in item) {
      //     const _keyItem = item[_key];
      //     index++;
      //     setErrorMsg(_fnData, _keyItem, index);
      //   }
      // }
    } else {
      setErrorMsg(_fnData, _item, index);
    }
  }
  const _range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
  const _kind = 1;
  return [new vscode.DocumentHighlight(_range, _kind)];
}

function setErrorMsg(fnData: FnInfo[], str: string, index: number) {
  const _reg = new RegExp(`${fileName}\..*`, 'g');
  if(_reg.test(str)) {
    const _fn = str.replace(new RegExp(`${fileName}\.|`, 'g'), '');
    if(!fnData.map((_fnItem => _fnItem.fnName)).includes(_fn)) {
      let uri = vscode.window.activeTextEditor.document.uri;
      collection.set(uri, [
          {
            range: new vscode.Range(new vscode.Position(index,2), new vscode.Position(index, 100)),
            message: 'The function name does not exist!',
            severity: 0
          }
      ]);
    }
  }
}