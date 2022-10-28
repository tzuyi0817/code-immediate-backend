import type { Types } from 'mongoose';

export interface ICode {
  title: string;
  HTML: CodeMap;
  CSS: CodeMap;
  JS: CodeMap;
  VUE: CodeMap;
  codeTemplate: CodeTemplate;
  importMap: ImportMap;
  userId: Types.ObjectId;
}

export interface CodeMap {
  language: string;
  content: string;
  resources?: string[];
}

export type CodeModel = 'HTML' | 'CSS' | 'JS' | 'VUE';
export type CodeTemplate = 'ES6' | 'Vue' | 'VueSFC' | 'React' | 'Angular';
export type ImportMap = string | Record<'imports', Record<string, string>>;
