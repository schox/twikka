'use client';

import React, { useCallback, useEffect, useState } from 'react';
import './lexical-editor.css';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $convertToMarkdownString, $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode, $createHeadingNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode, AutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  type EditorState,
  type LexicalEditor as LexicalEditorType,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
  ListType,
} from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent } from '@lexical/utils';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Link,
  Code,
} from 'lucide-react';
import { cn } from '../utils';

const editorTheme = {
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    nested: { listitem: 'editor-nested-listitem' },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

const editorNodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode,
];

// --- Toolbar ---

type BlockType = 'paragraph' | 'h2' | 'h3' | 'h4' | 'quote' | 'bullet' | 'number' | 'code';

function ToolbarButton({
  active,
  disabled,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors',
        active
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  );
}

function ToolbarPlugin({ disabled }: { disabled?: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, e => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      // Check link
      const node = anchorNode.getParent();
      setIsLink($isLinkNode(node) || $isLinkNode(anchorNode));

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $findMatchingParent(anchorNode, node => $isListNode(node));
          const type: ListType = parentList
            ? (parentList as any).getListType()
            : (element as any).getListType();
          setBlockType(type === 'number' ? 'number' : 'bullet');
        } else {
          const type = element.getType();
          if (type === 'heading') {
            const tag = (element as any).getTag() as string;
            setBlockType(tag as BlockType);
          } else if (type === 'quote') {
            setBlockType('quote');
          } else if (type === 'code') {
            setBlockType('code');
          } else {
            setBlockType('paragraph');
          }
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatHeading = (headingTag: 'h2' | 'h3' | 'h4') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === headingTag) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(headingTag));
        }
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === 'quote') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          const { $createQuoteNode } = require('@lexical/rich-text');
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === 'code') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          const { $createCodeNode } = require('@lexical/code');
          $setBlocksType(selection, () => $createCodeNode());
        }
      }
    });
  };

  const insertLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      const url = prompt('Enter URL:');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    }
  };

  return (
    <div className="flex items-center gap-0.5 p-1.5 border-b bg-muted/30 flex-wrap">
      <ToolbarButton
        active={isBold}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        active={isItalic}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        active={isUnderline}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        active={blockType === 'h2'}
        disabled={disabled}
        onClick={() => formatHeading('h2')}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        active={blockType === 'h3'}
        disabled={disabled}
        onClick={() => formatHeading('h3')}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        active={blockType === 'h4'}
        disabled={disabled}
        onClick={() => formatHeading('h4')}
        title="Heading 4"
      >
        <Heading4 className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        active={blockType === 'bullet'}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        active={blockType === 'number'}
        disabled={disabled}
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-border mx-1" />

      <ToolbarButton
        active={blockType === 'quote'}
        disabled={disabled}
        onClick={formatQuote}
        title="Block Quote"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton active={isLink} disabled={disabled} onClick={insertLink} title="Link">
        <Link className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        active={blockType === 'code'}
        disabled={disabled}
        onClick={formatCode}
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

// --- Load initial state plugin ---

function LoadInitialStatePlugin({
  initialState,
  initialMarkdown,
  initialPlainText,
}: {
  initialState?: string | null;
  initialMarkdown?: string | null;
  initialPlainText?: string | null;
}) {
  const [editor] = useLexicalComposerContext();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    // Try Lexical JSON state first
    if (initialState) {
      try {
        const parsed = JSON.parse(initialState);
        // Check if state has actual content (not an empty root)
        const hasContent =
          parsed?.root?.children && parsed.root.children.length > 0;
        if (hasContent) {
          const state = editor.parseEditorState(parsed);
          editor.setEditorState(state);
          setLoaded(true);
          return;
        }
        // Empty Lexical state — fall through to plain text
      } catch {
        // Invalid JSON, fall through to plain text
      }
    }

    // Markdown is the canonical content format — parse it into Lexical nodes
    // so headings/lists/etc. render in the editor (not as literal "#"/"-").
    if (initialMarkdown) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        $convertFromMarkdownString(initialMarkdown, TRANSFORMERS);
      });
      setLoaded(true);
      return;
    }

    // Fall back to plain text (split by newlines into paragraphs)
    if (initialPlainText) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const lines = initialPlainText.split(/\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) {
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(trimmed));
            root.append(paragraph);
          }
        }
      });
      setLoaded(true);
    }
  }, [editor, initialState, initialMarkdown, initialPlainText, loaded]);

  return null;
}

// --- Main Component ---

export interface LexicalEditorOnChangeData {
  editorState: string;
  html: string;
  markdown: string;
  plainText: string;
}

export interface LexicalEditorProps {
  initialState?: string | null;
  /** Markdown source (canonical). Parsed into the editor when no Lexical state. */
  initialMarkdown?: string | null;
  initialPlainText?: string | null;
  onChange?: (data: LexicalEditorOnChangeData) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  className?: string;
}

export function LexicalEditor({
  initialState,
  initialMarkdown,
  initialPlainText,
  onChange,
  placeholder = 'Start writing...',
  minHeight = '200px',
  disabled = false,
  className,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'LexicalEditor',
    theme: editorTheme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: editorNodes,
    editable: !disabled,
  };

  const handleChange = useCallback(
    (editorState: EditorState, editor: LexicalEditorType) => {
      if (!onChange) return;

      editor.update(() => {
        const html = $generateHtmlFromNodes(editor, null);
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        const editorStateJson = JSON.stringify(editorState.toJSON());

        // Extract plain text
        const root = editorState._nodeMap;
        let plainText = '';
        root.forEach(node => {
          if ('__text' in node) {
            plainText += (node as any).__text + ' ';
          }
        });

        onChange({
          editorState: editorStateJson,
          html,
          markdown,
          plainText: plainText.trim(),
        });
      });
    },
    [onChange],
  );

  return (
    <div className={cn('lexical-editor-container border rounded-md overflow-hidden', className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin disabled={disabled} />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="lexical-editor p-3 focus:outline-none"
                style={{ minHeight }}
              />
            }
            placeholder={
              <div
                className="lexical-placeholder p-3 text-muted-foreground pointer-events-none"
                style={{ minHeight }}
              >
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <LoadInitialStatePlugin
          initialState={initialState}
          initialMarkdown={initialMarkdown}
          initialPlainText={initialPlainText}
        />
      </LexicalComposer>
    </div>
  );
}
