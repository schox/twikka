import { createEditor, LexicalEditor } from 'lexical';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';

// Define the nodes that our editor supports
const EDITOR_NODES = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
];

/**
 * Create a headless Lexical editor for conversions
 */
function createHeadlessEditor(): LexicalEditor {
  return createEditor({
    nodes: EDITOR_NODES,
    onError: error => {
      console.error('Lexical conversion error:', error);
    },
  });
}

/**
 * Convert Markdown string to Lexical JSON
 */
export function convertMarkdownToLexical(markdown: string): object | null {
  if (!markdown) return null;

  const editor = createHeadlessEditor();
  let lexicalState: object | null = null;

  editor.update(() => {
    try {
      // Convert markdown to Lexical nodes
      $convertFromMarkdownString(markdown, TRANSFORMERS);

      // Get the editor state as JSON
      lexicalState = editor.getEditorState().toJSON();
    } catch (error) {
      console.error('Error converting markdown to Lexical:', error);

      // Fallback: create a simple paragraph with the text
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(markdown));
      root.append(paragraph);
      lexicalState = editor.getEditorState().toJSON();
    }
  });

  return lexicalState;
}

/**
 * Convert HTML string to Lexical JSON
 */
export function convertHTMLToLexical(htmlString: string): object | null {
  if (!htmlString) return null;

  const editor = createHeadlessEditor();
  let lexicalState: object | null = null;

  editor.update(() => {
    try {
      // Parse HTML
      const parser = new DOMParser();
      const dom = parser.parseFromString(htmlString, 'text/html');

      // Convert DOM nodes to Lexical nodes
      const nodes = $generateNodesFromDOM(editor, dom);

      // Clear root and append new nodes
      const root = $getRoot();
      root.clear();
      root.append(...nodes);

      // Get the editor state as JSON
      lexicalState = editor.getEditorState().toJSON();
    } catch (error) {
      console.error('Error converting HTML to Lexical:', error);

      // Fallback: create a simple paragraph with the text
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(htmlString));
      root.append(paragraph);
      lexicalState = editor.getEditorState().toJSON();
    }
  });

  return lexicalState;
}

/**
 * Convert Lexical JSON to Markdown string
 */
export function convertLexicalToMarkdown(lexicalState: object): string {
  if (!lexicalState) return '';

  const editor = createHeadlessEditor();
  let markdown = '';

  try {
    // Set the editor state from JSON
    const editorState = editor.parseEditorState(lexicalState);
    editor.setEditorState(editorState);

    // Convert to markdown
    editor.update(() => {
      markdown = $convertToMarkdownString(TRANSFORMERS);
    });
  } catch (error) {
    console.error('Error converting Lexical to markdown:', error);
    return '';
  }

  return markdown;
}

/**
 * Convert Lexical JSON to HTML string
 */
export function convertLexicalToHTML(lexicalState: object): string {
  if (!lexicalState) return '';

  const editor = createHeadlessEditor();
  let html = '';

  try {
    // Set the editor state from JSON
    const editorState = editor.parseEditorState(lexicalState);
    editor.setEditorState(editorState);

    // Convert to HTML
    editor.update(() => {
      html = $generateHtmlFromNodes(editor, null);
    });
  } catch (error) {
    console.error('Error converting Lexical to HTML:', error);
    return '';
  }

  return html;
}

/**
 * Convert Lexical JSON to plain text (for excerpts, search indexing)
 */
export function convertLexicalToPlainText(lexicalState: object): string {
  if (!lexicalState) return '';

  const editor = createHeadlessEditor();
  let plainText = '';

  try {
    // Set the editor state from JSON
    const editorState = editor.parseEditorState(lexicalState);
    editor.setEditorState(editorState);

    // Extract plain text
    editor.update(() => {
      const root = $getRoot();
      plainText = root.getTextContent();
    });
  } catch (error) {
    console.error('Error converting Lexical to plain text:', error);
    return '';
  }

  return plainText;
}

/**
 * Validate that a Lexical state is valid JSON
 */
export function isValidLexicalState(lexicalState: any): boolean {
  try {
    if (!lexicalState || typeof lexicalState !== 'object') {
      return false;
    }

    // Basic structure validation
    return (
      lexicalState.root &&
      typeof lexicalState.root === 'object' &&
      Array.isArray(lexicalState.root.children)
    );
  } catch {
    return false;
  }
}

/**
 * Migration helper: Convert existing blog posts from markdown to Lexical
 */
export async function migrateBlogPostToLexical(
  postId: number,
  markdownContent: string,
): Promise<{ lexicalContent: object; htmlContent: string } | null> {
  try {
    // Convert markdown to Lexical JSON
    const lexicalContent = convertMarkdownToLexical(markdownContent);

    if (!lexicalContent) {
      throw new Error('Failed to convert markdown to Lexical');
    }

    // Generate HTML from Lexical for SEO/search
    const htmlContent = convertLexicalToHTML(lexicalContent);

    return {
      lexicalContent,
      htmlContent,
    };
  } catch (error) {
    console.error(`Error migrating post ${postId}:`, error);
    return null;
  }
}

// Type definitions for better TypeScript support
export interface ContentConversionResult {
  lexicalContent: object;
  htmlContent: string;
  markdownContent?: string;
  plainTextContent?: string;
}

/**
 * All-in-one conversion utility
 */
export function convertContent(
  input: string,
  inputFormat: 'markdown' | 'html',
): ContentConversionResult | null {
  try {
    // Convert input to Lexical
    const lexicalContent =
      inputFormat === 'markdown' ? convertMarkdownToLexical(input) : convertHTMLToLexical(input);

    if (!lexicalContent) {
      return null;
    }

    // Generate all output formats
    const htmlContent = convertLexicalToHTML(lexicalContent);
    const markdownContent = convertLexicalToMarkdown(lexicalContent);
    const plainTextContent = convertLexicalToPlainText(lexicalContent);

    return {
      lexicalContent,
      htmlContent,
      markdownContent,
      plainTextContent,
    };
  } catch (error) {
    console.error('Error in convertContent:', error);
    return null;
  }
}
