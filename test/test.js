const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const babel = require('@babel/core');

// const index = fs.readFileSync(`${__dirname}/index.ts`)
// console.log(index);

const moduleAnalyser = (fileName) => {
  // 1.fs模块根据路径读取到了module的内容
  const content = fs.readFileSync(fileName, 'utf-8');
  // 2.使用@babel/parser将文件内容转换成抽象语法树AST
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: ['typescript'] 
  });
  // console.log('debug1');
  // console.log(ast);
  // 3.使用@babel/traverse遍历了AST ，对每个ImportDeclaration节点做映射，把依赖关系拼装在 dependencies对象里
  let dependencies = {};
  traverse.default(ast, {
    ExportDeclaration({ node }) {
      console.log('debug2');
      console.log(node);
      // const dirName = path.dirname(fileName);
      // const newFile = './' + path.join(dirName, node.source.value);
      // // key是相对于当前模块的路径，value为相对于bundler.js的路径。
      // dependencies[node.source.value] = newFile;
    }
  });
  // 4.使用@babel/core结合@babel/preset-env预设，将AST转换成了浏览器可以执行的代码
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  });
  return {
    fileName,
    dependencies,
    code
  };
};

const filename = `${__dirname}/index.ts`;
moduleAnalyser(filename);
// console.log(moduleAnalyser(filename));

