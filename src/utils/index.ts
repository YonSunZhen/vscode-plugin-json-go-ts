
import * as fs from 'fs';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import { SourceLocation } from '@babel/types';

export interface FnInfo {
  fnName?: string, 
  loc?: SourceLocation
}

export function getFnFromTsFile(path: string) {
  // 1.fs模块根据路径读取到了module的内容
  const content = fs.readFileSync(path, 'utf-8');
  // 2.使用@babel/parser将文件内容转换成抽象语法树AST
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['typescript'] 
  });
  // 3.使用@babel/traverse遍历了AST ，对每个ImportDeclaration节点做映射，把依赖关系拼装在 dependencies对象里
  const fnNameList: FnInfo[] = [];
  traverse(ast, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ExportDeclaration(node: any) {
      const _fnName = node.node.declaration.id.name;
      const _loc = node.node.declaration.id.loc;
      fnNameList.push({
        fnName: _fnName,
        loc: _loc
      });
    }
  });
  return fnNameList;
}
