import * as vscode from 'vscode';
import * as jsonToAst from 'json-to-ast';
import { getFnFromTsFile } from './index';
import { getFilePath } from './project-path';
import { fileName, filePath } from './config';


interface JsonTextInfo {
  value?: string,
  loc?: jsonToAst.Location
}

export function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
  const _text = document.getText();
  const _jsonAst = jsonToAst(_text) as jsonToAst.ObjectNode;
  const _errorText: JsonTextInfo[] = [];
  const _filePath = getFilePath(document, filePath);
  const _fnData = getFnFromTsFile(`${_filePath}.ts`);  
  const recursiveJsonAst = (astArr: any[]) => {
    astArr.forEach((jsonAstItem) => {
      const _value = jsonAstItem?.value || jsonAstItem?.children;
      if(_value.children) {
        recursiveJsonAst(_value.children);
      } else if(Array.isArray(_value)) {
        recursiveJsonAst(_value);
      } else {
        const _textValue = _value.value;
        const _reg = new RegExp(`${fileName}\..*`, 'g');
        if(_reg.test(_textValue)) {
          const _fnVal = _textValue.replace(new RegExp(`${fileName}\.`, 'g'), '');
          if(!_fnData.map((_fnItem => _fnItem.fnName)).includes(_fnVal)) {
            _errorText.push({
              value: _fnVal,
              loc: _value.loc
            });
          }
        }
      }  
    });
  };
  recursiveJsonAst(_jsonAst.children);
  const _diagCollection = [];
  _errorText.forEach(_errTextItem => {
    const _start = _errTextItem.loc.start;
    const _end = _errTextItem.loc.end;
    const _fileNameLen = (fileName as string).length || 0;
    const _startPosition = new vscode.Position(_start.line - 1, _start.column + _fileNameLen + 1);
    const _endPosition = new vscode.Position(_end.line - 1, _end.column - 2);
    _diagCollection.push({
      message: `Function ${_errTextItem.value} does not exist`,
      range: new vscode.Range(_startPosition, _endPosition),
      severity: vscode.DiagnosticSeverity.Error,
    });
  });
  collection.set(document.uri, _diagCollection);
}