'use client';

import * as React from 'react';
import { cn } from '../utils';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

export interface PrivateAppScreenProps {
  /** App name to display */
  appName?: string;
  /** Company/organization name */
  companyName?: string;
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** URL to redirect to for login */
  loginUrl?: string;
  /** Contact email for admin access requests */
  contactEmail?: string;
  /** Contact URL for admin access requests */
  contactUrl?: string;
  /** Callback when login button is clicked */
  onLogin?: () => void;
  /** Callback when contact button is clicked */
  onContact?: () => void;
  /** Show login button */
  showLoginButton?: boolean;
  /** Show contact button */
  showContactButton?: boolean;
  /** Custom logo or icon */
  logo?: React.ReactNode;
  /** Additional class name */
  className?: string;
  /** Children to render below the main content */
  children?: React.ReactNode;
}

/**
 * PrivateAppScreen component for internal/private applications.
 * Displays a message that the app is private and provides options to login or contact admin.
 */
export function PrivateAppScreen({
  appName = 'Application',
  companyName,
  title = 'This is a private application',
  description = 'Access to this application is restricted to authorized users only.',
  loginUrl = '/login',
  contactEmail,
  contactUrl,
  onLogin,
  onContact,
  showLoginButton = true,
  showContactButton = true,
  logo,
  className,
  children,
}: PrivateAppScreenProps) {
  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else if (loginUrl) {
      window.location.href = loginUrl;
    }
  };

  const handleContact = () => {
    if (onContact) {
      onContact();
    } else if (contactEmail) {
      window.location.href = `mailto:${contactEmail}?subject=Access Request for ${appName}`;
    } else if (contactUrl) {
      window.location.href = contactUrl;
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30',
        className,
      )}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          {/* Logo or lock icon */}
          {logo ?? (
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-muted-foreground"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          )}

          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            {companyName && (
              <p className="text-sm text-muted-foreground mt-1">{companyName}</p>
            )}
          </div>

          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            {showLoginButton && (
              <Button onClick={handleLogin} className="w-full">
                Go to Login
              </Button>
            )}

            {showContactButton && (contactEmail || contactUrl || onContact) && (
              <Button variant="outline" onClick={handleContact} className="w-full">
                Request Access
              </Button>
            )}
          </div>

          {/* Additional info */}
          <p className="text-xs text-center text-muted-foreground pt-2">
            If you believe you should have access, please contact your administrator.
          </p>

          {/* Custom children */}
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
