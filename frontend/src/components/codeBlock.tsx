import { Button, Grid } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { FC, memo, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from '@mui/system';

import { generateRandomString, programmingLanguages } from '../utils/codeblock';

interface Props {
  language: string;
  value: string;
}

export const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const theme = useTheme();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };
  const downloadAsFile = () => {
    const fileExtension = programmingLanguages[language] || '.file';
    const suggestedFileName = `file-${generateRandomString(
      3,
      true
    )}${fileExtension}`;
    const fileName = window.prompt('Enter file name' || '', suggestedFileName);

    if (!fileName) {
      // user pressed cancel on prompt
      return;
    }

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <Grid
      sx={{ backgroundColor: theme.palette.grey[900], p: 1, borderRadius: 2 }}
    >
      <Grid>
        <span className="text-xs lowercase text-white">{language}</span>

        <Grid>
          <Button
            onClick={copyToClipboard}
            sx={{ color: theme.palette.text.icon }}
          >
            {isCopied ? <CheckBoxIcon /> : <ContentPasteIcon />}
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            onClick={downloadAsFile}
            sx={{ color: theme.palette.text.icon }}
          >
            <DownloadIcon />
          </Button>
        </Grid>
      </Grid>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </Grid>
  );
});
CodeBlock.displayName = 'CodeBlock';
