import * as path from 'path';
import * as vscode from 'vscode';

function getJsonPath(document) {
    if (!document) {
        document = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document : null;
    }
    if (!document) {
        this.showError('当前激活的编辑器不是文件或者没有文件被打开！');
        return '';
    }
    const test = document.uri;
    //  const fileName = document.fileName;
    //  const workDir = path.dirname(fileName); // 获取文件所在目录
    const currentFile = (document.uri ? document.uri : document).fsPath;
    return currentFile;
}

export function getFilePath(document, filePath) {
    const _jsonPath = getJsonPath(document);
    const _filePath = path.join(_jsonPath, '..', filePath);
    return _filePath;
}