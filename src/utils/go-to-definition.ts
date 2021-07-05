import * as vscode from 'vscode';
import * as fs from 'fs';
import { getFnFromTsFile } from './index';
import { getFilePath } from './project-path';
import { fileName, filePath } from './config';

export function provideDefinition(document, position, token) {
  const _filePath = getFilePath(document, filePath);
  const _fnData = getFnFromTsFile(`${_filePath}.ts`);  
  const word = document.getText(document.getWordRangeAtPosition(position)); // 获取当前光标输入字符
  const _reg = new RegExp(`"${fileName}\..*"`);  
  if (_reg.test(word)) {
    const _fnName = word.replace(/"index\.|"/g, '');
    if(_fnData.map(_fnItem => _fnItem.fnName).includes(_fnName)) {
      const filePath = `${_filePath}.ts`;
      for(const _fnItem of _fnData) {
        if(_fnItem.fnName === _fnName) {
          const tmpPath = `file:///${filePath}`; // TODO: 踩坑记录 必须 ///
          if (fs.existsSync(filePath)) {
            // TODO: 踩坑记录
            return new vscode.Location(vscode.Uri.parse(tmpPath), new vscode.Position(_fnItem.loc.start.line, _fnItem.loc.start.column));
          }
        }
      }
    }
  }
}
