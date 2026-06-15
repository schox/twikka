'use client';

import { useEffect } from 'react';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';

const theme = {
  // Headings
  heading: {
    h1: 'text-3xl font-bold font-heading text-gray-900 mt-8 mb-6 first:mt-0',
    h2: 'text-2xl font-bold font-heading text-gray-900 mt-8 mb-5',
    h3: 'text-xl font-bold font-heading text-gray-900 mt-6 mb-4',
    h4: 'text-lg font-bold font-heading text-gray-900 mt-6 mb-3',
    h5: 'text-base font-bold font-heading text-gray-900 mt-4 mb-2',
    h6: 'text-sm font-bold font-heading text-gray-900 mt-4 mb-2',
  },
  // Paragraphs
  paragraph: 'text-gray-800 mb-5 leading-relaxed',
  // Lists
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal ml-6 mb-6 space-y-2',
    ul: 'list-none mb-6 space-y-2',
  },
  listitem: 'text-gray-800 leading-relaxed relative pl-6',
  // Text formatting
  text: {
    bold: 'font-bold text-gray-900',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800',
  },
  // Code blocks
  code: 'bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6 text-sm font-mono',
  codeHighlight: {
    atrule: 'text-purple-400',
    attr: 'text-blue-400',
    boolean: 'text-purple-400',
    builtin: 'text-yellow-400',
    cdata: 'text-gray-400',
    char: 'text-green-400',
    class: 'text-yellow-400',
    'class-name': 'text-yellow-400',
    comment: 'text-gray-400',
    constant: 'text-purple-400',
    deleted: 'text-red-400',
    doctype: 'text-gray-400',
    entity: 'text-yellow-400',
    function: 'text-blue-400',
    important: 'text-purple-400',
    inserted: 'text-green-400',
    keyword: 'text-purple-400',
    namespace: 'text-yellow-400',
    number: 'text-purple-400',
    operator: 'text-red-400',
    prolog: 'text-gray-400',
    property: 'text-blue-400',
    punctuation: 'text-gray-300',
    regex: 'text-green-400',
    selector: 'text-yellow-400',
    string: 'text-green-400',
    symbol: 'text-purple-400',
    tag: 'text-red-400',
    url: 'text-blue-400',
    variable: 'text-yellow-400',
  },
  // Links
  link: 'text-blue-600 hover:text-blue-800 transition-colors cursor-pointer',
  // Quotes
  quote: 'border-l-4 border-blue-500 pl-6 italic my-6 text-gray-700 bg-gray-50 py-4',
};

const nodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
];

interface LexicalRendererProps {
  markdown: string;
  className?: string;
}

function MarkdownPlugin({ markdown }: { markdown: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      $convertFromMarkdownString(markdown, TRANSFORMERS);
    });
  }, [markdown, editor]);

  return null;
}

export default function LexicalRenderer({ markdown, className = '' }: LexicalRendererProps) {
  const initialConfig = {
    namespace: 'BlogRenderer',
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes,
    editable: false,
  };

  return (
    <div className={`prose-lexical ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="outline-none resize-none text-base text-gray-800 leading-relaxed"
                style={{ minHeight: '200px' }}
              />
            }
            placeholder={<div></div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MarkdownPlugin markdown={markdown} />
          <HistoryPlugin />
        </div>
      </LexicalComposer>

      {/* Custom styles for bullet points since Lexical doesn't handle them in theme */}
      <style jsx>{`
        .prose-lexical :global(.list-none > li::before) {
          content: '•';
          position: absolute;
          left: 0;
          color: #6b7280;
          font-weight: bold;
        }

        .prose-lexical :global(ul ul li::before) {
          content: '◦';
        }

        .prose-lexical :global(ol ol) {
          margin-left: 1.5rem;
        }

        .prose-lexical :global(ul ul) {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
