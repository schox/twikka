// Core utilities
export { cn } from './utils';

// Base components
export { Button, buttonVariants } from './components/button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './components/card';
export { Input } from './components/input';
export { Label } from './components/label';

// Form components
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './components/select';
export { Textarea } from './components/textarea';
export { Switch } from './components/switch';
export { OtpInput, type OtpInputProps } from './components/otp-input';
export {
  VerifyContactRow,
  type VerifyContactRowProps,
  type VerifyContactRowState,
} from './components/verify-contact-row';

// Layout components
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';
export {
  Tabs as EnhancedTabs,
  TabsList as EnhancedTabsList,
  TabsTrigger as EnhancedTabsTrigger,
  TabsContent as EnhancedTabsContent,
  IconTabGroup,
} from './components/enhanced-tabs';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/table';

// Feedback components
export { Badge, badgeVariants } from './components/badge';
export { Alert, AlertTitle, AlertDescription } from './components/alert';

// Popover & ScrollArea
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from './components/popover';
export { ScrollArea, ScrollBar } from './components/scroll-area';

// Phone input
export { PhoneInput, toE164, type PhoneInputProps } from './components/phone-input';

// Admin login
export { AdminLoginCard, type AdminLoginCardProps } from './components/admin-login-card';

// Overlay components
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './components/dialog';
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/alert-dialog';
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './components/sheet';

// Menu components
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './components/dropdown-menu';

// Navigation components
export { Pagination, type PaginationInfo } from './components/pagination';

// Data display components
export {
  ResponsiveTable,
  MobileCardView,
  ResponsiveTableContainer,
  ResponsiveTableHeader,
  ResponsiveTableBody,
  ResponsiveTableRow,
  ResponsiveTableHead,
  ResponsiveTableCell,
  MobileField,
} from './components/responsive-table';
export {
  ReferenceTable,
  type ReferenceTableItem,
  type ReferenceTableProps,
} from './components/reference-table';

// Utility components
export { Separator } from './components/separator';
export { ImageWithFallback } from './components/image-with-fallback';

// Typography components
export { H1, H2, H3, H4, P, Small, Lead } from './components/typography';

// State components
export { LoadingSpinner, LoadingOverlay, LoadingContent } from './components/loading-spinner';
export {
  EmptyState,
  NoResultsState,
  NoContentState,
  NoAccessState,
  ComingSoonState,
} from './components/empty-state';
export { ErrorState, ErrorBoundaryFallback, InlineError } from './components/error-state';
export { PrivateAppScreen, type PrivateAppScreenProps } from './components/private-app-screen';

// Content components
export { LexicalRenderer } from './components/lexical-renderer';
export { SimpleLexicalRenderer } from './components/simple-lexical-renderer';
export {
  LexicalEditor,
  type LexicalEditorProps,
  type LexicalEditorOnChangeData,
} from './components/lexical-editor';

// Image components
export { ImageUpload, type ImageUploadProps } from './components/image-upload';

// Theme system
export { ThemeProvider, useTheme } from './providers/ThemeProvider';
export { ThemeSettings, ThemeToggle } from './components/ThemeSettings';

// Re-export types for convenience
export type { VariantProps } from 'class-variance-authority';
