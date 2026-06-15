'use client';

import { useEffect, useMemo } from 'react';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';

const theme = {
  heading: {
    h1: 'text-3xl font-bold text-gray-900 mt-8 mb-6 first:mt-0 font-heading',
    h2: 'text-2xl font-bold text-gray-900 mt-8 mb-5 font-heading',
    h3: 'text-xl font-bold text-gray-900 mt-6 mb-4 font-heading',
    h4: 'text-lg font-bold text-gray-900 mt-6 mb-3 font-heading',
  },
  paragraph: 'text-gray-800 mb-5 leading-relaxed',
  list: {
    ol: 'list-decimal ml-8 mb-6 space-y-2',
    ul: 'list-disc ml-8 mb-6 space-y-2',
  },
  listitem: 'text-gray-800 leading-relaxed',
  text: {
    bold: 'font-bold text-gray-900',
    italic: 'italic',
    code: 'bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800',
  },
  code: 'bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6 text-sm font-mono',
  quote: 'border-l-4 border-blue-500 pl-6 italic my-6 text-gray-700 bg-gray-50 py-4',
  link: 'text-blue-600 hover:text-blue-800 underline',
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

function MarkdownPlugin({ markdown }: { markdown: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (markdown) {
      editor.update(() => {
        try {
          $convertFromMarkdownString(markdown, TRANSFORMERS);
        } catch {
          // Silently handle markdown conversion errors
        }
      });
    }
  }, [markdown, editor]);

  return null;
}

interface SimpleLexicalRendererProps {
  markdown: string;
  className?: string;
}

export function SimpleLexicalRenderer({ markdown, className = '' }: SimpleLexicalRendererProps) {
  const initialConfig = useMemo(
    () => ({
      namespace: 'BlogRenderer',
      theme,
      onError: () => {
        // Error handling silenced for shared component
      },
      nodes,
      editable: false,
    }),
    [],
  );

  if (!markdown) {
    return <div className="text-gray-600">No content available.</div>;
  }

  return (
    <div className={`lexical-renderer ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none text-base text-gray-800 leading-relaxed min-h-0" />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MarkdownPlugin markdown={markdown} />
      </LexicalComposer>

      {/* List styles are handled by Tailwind classes in the theme */}
    </div>
  );
}
