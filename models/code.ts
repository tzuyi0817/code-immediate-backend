import { Schema, model } from 'mongoose';
import type { ICode, CodeMap } from '../types/code';

const codeMapSchema = new Schema<CodeMap>({
  language: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
  },
  resources: [String],
}, { _id : false });

const codeSchema = new Schema<ICode>({
  title: {
    type: String,
    required: true,
  },
  HTML: {
    type: codeMapSchema,
    required: true,
  },
  CSS: {
    type: codeMapSchema,
    required: true,
  },
  JS: {
    type: codeMapSchema,
    required: true,
  },
  VUE: {
    type: codeMapSchema,
    required: true,
  },
  codeTemplate: {
    type: String,
    required: true,
  },
  importMap: {
    type: Schema.Types.Mixed,
    default: '',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  }
}, { timestamps: true });

const Code = model<ICode>('Code', codeSchema);

export { Code };