import React from 'react';
import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon';

interface FileIconProps {
  fileName: string;
}

const extensionToDefault: Record<string, DefaultExtensionType> = {
  ai: 'ai',
  avi: 'avi',
  bmp: 'bmp',
  c: 'c',
  cpp: 'cpp',
  css: 'css',
  csv: 'csv',
  dmg: 'dmg',
  doc: 'doc',
  docx: 'docx',
  dwg: 'dwg',
  dxf: 'dxf',
  eps: 'eps',
  exe: 'exe',
  flv: 'flv',
  gif: 'gif',
  html: 'html',
  java: 'java',
  jpg: 'jpg',
  js: 'js',
  json: 'json',
  mid: 'mid',
  mp3: 'mp3',
  mp4: 'mp4',
  mpg: 'mpg',
  odp: 'odp',
  ods: 'ods',
  odt: 'odt',
  pdf: 'pdf',
  php: 'php',
  png: 'png',
  ppt: 'ppt',
  pptx: 'pptx',
  psd: 'psd',
  py: 'py',
  rar: 'rar',
  rb: 'rb',
  rtf: 'rtf',
  scss: 'scss',
  tif: 'tif',
  tiff: 'tiff',
  ts: 'ts',
  txt: 'txt',
  wav: 'wav',
  xls: 'xls',
  xlsx: 'xlsx',
  yml: 'yml',
  zip: 'zip'
};

const customStyles = {
  ...defaultStyles,
  borderRadius: '50%',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  height: '50px',
  width: '50px'
};

const getFileExtension = (filename: string): string => {
  return filename
    .slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
    .toLowerCase();
};

const FileIconComponent: React.FC<FileIconProps> = ({ fileName }) => {
  const fileExtension = getFileExtension(fileName.toLowerCase());
  const defaultExtension = extensionToDefault[fileExtension];
  const fileIconStyles = customStyles[
    defaultExtension
  ] as Partial<FileIconProps>;

  return (
    <div
      style={{
        maxWidth: '20px',
        maxHeight: '20px',
        minWidth: '20px',
        minHeight: '20px'
      }}
    >
      <FileIcon fold={false} extension={fileExtension} {...fileIconStyles} />
    </div>
  );
};

export default FileIconComponent;
