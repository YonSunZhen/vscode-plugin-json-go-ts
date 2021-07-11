import * as vscode from 'vscode';
import * as fs from 'fs';
import { getFnFromTsFile } from './index';
import { getFilePath } from './project-path';
import { fileName, filePath } from './config';

export function provideDefinition(document: vscode.TextDocument, position: vscode.Position, token) {
  const _filePath = getFilePath(document, filePath);
  const _fnData = getFnFromTsFile(`${_filePath}.ts`);  
  const _wordRangePosition = document.getWordRangeAtPosition(position);
  const word = document.getText(_wordRangePosition); // 获取当前光标输入字符
  const _reg = new RegExp(`"${fileName}\..*"`);  
  if (_reg.test(word)) {
    // const _fnName = word.replace(/"index\.|"/g, '');
    const _fnName = word.replace(new RegExp(`"${fileName}\.|"`, 'g'), '');
    if(_fnData.map(_fnItem => _fnItem.fnName).includes(_fnName)) {
      const filePath = `${_filePath}.ts`;
      for(const _fnItem of _fnData) {
        if(_fnItem.fnName === _fnName) {
          const tmpPath = `file:///${filePath}`; // TODO: 踩坑记录 必须 ///
          if (fs.existsSync(filePath)) {
            const _targetUri = vscode.Uri.parse(tmpPath); // TODO: 踩坑记录 使用parse
            const _targetPosition = new vscode.Position(_fnItem.loc.start.line, _fnItem.loc.start.column);
            const _targetRange = new vscode.Range(_targetPosition, _targetPosition);
            const _fileNameLen = (fileName as string).length || 0;
            const _orgSelectionStartPosition = new vscode.Position(_wordRangePosition.start.line, _wordRangePosition.start.character + _fileNameLen + 2);
            const _orgSelectionEndPosition = new vscode.Position(_wordRangePosition.end.line, _wordRangePosition.end.character - 1);
            const _originSelectionRange = new vscode.Range(_orgSelectionStartPosition, _orgSelectionEndPosition);
            const _locationLink: vscode.LocationLink = {
              originSelectionRange: _originSelectionRange,
              targetUri: _targetUri,
              targetRange: _targetRange
            };
            return [_locationLink];
            // return new vscode.Location(vscode.Uri.parse(tmpPath), new vscode.Position(_fnItem.loc.start.line, _fnItem.loc.start.column));
          }
        }
      }
    }
  }
}
