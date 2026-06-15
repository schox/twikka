import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface SimpleLexicalRendererProps {
  markdown: string;
  className?: string;
}

export default function SimpleLexicalRenderer({
  markdown,
  className = '',
}: SimpleLexicalRendererProps) {
  if (!markdown) {
    return <div className="text-gray-600">No content available.</div>;
  }

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-10 mb-6 first:mt-0 font-heading">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 p-4 bg-brand-primary/5 rounded-xl font-heading border border-brand-primary/10">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 font-heading">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-bold text-gray-900 mt-6 mb-3 font-heading">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-800 mb-5 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-8 mb-6 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-8 mb-6 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-800 leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand-primary pl-6 italic my-6 text-gray-700 bg-gray-50 py-4 rounded-r-lg">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className ?? '');
            const isInline = !match && !String(children).includes('\n');

            return isInline ? (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props}>
                {children}
              </code>
            ) : (
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6 text-sm font-mono">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            );
          },
          pre: ({ children }) => <>{children}</>,
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http');
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:text-brand-primary/80 underline"
                >
                  {children}
                </a>
              );
            }
            return (
              <Link
                href={href ?? '#'}
                className="text-brand-primary hover:text-brand-primary/80 underline"
              >
                {children}
              </Link>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-8">
              <table className="w-full text-left border-collapse min-w-[500px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-100">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50/50 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border-b-2 border-gray-200 p-4 font-semibold text-gray-900 text-sm uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-gray-100 p-4 text-gray-700">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-gray-200" />,
          img: ({ src, alt }: any) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? ''}
              className="rounded-lg max-w-full h-auto my-6"
            />
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
