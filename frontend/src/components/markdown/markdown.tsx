import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import ReactMarkdown, { Options } from 'react-markdown';
import { CodeBlock } from '../codeBlock';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';

interface Props {
  message: string;
}

const Markdown = ({ message }: Props) => (
  <ReactMarkdown
    className="prose dark:prose-invert"
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[rehypeMathjax]}
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');

        console.log('match language', match, className);
        return !inline ? (
          <CodeBlock
            key={Math.random()}
            language={(match && match[1]) || ''}
            value={String(children).replace(/\n$/, '')}
            {...props}
          />
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      table({ children }) {
        return <Table>{children}</Table>;
      },
      thead({ children }) {
        return <TableHead>{children}</TableHead>;
      },
      tbody({ children }) {
        return <TableBody>{children}</TableBody>;
      },
      tr({ children }) {
        return <TableRow>{children}</TableRow>;
      },
      th({ children }) {
        return <TableCell>{children}</TableCell>;
      },
      td({ children }) {
        return <TableCell>{children}</TableCell>;
      }
    }}
  >
    {message}
  </ReactMarkdown>
);

export default Markdown;
