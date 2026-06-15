"use client";

import { useState, useEffect } from "react";
import type { CountryCode } from "libphonenumber-js";
import { ArrowLeft, Loader2, Mail, Phone } from "lucide-react";
import { cn } from "../utils";
import { OtpInput } from "./otp-input";
import { PhoneInput, toE164 } from "./phone-input";

type LoginStep = "identifier" | "otp";
type InputMode = "email" | "phone";

export interface AdminLoginCardProps {
  appName: string;
  subtitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  onRequestOtp: (
    identifier: string,
    channel: "email" | "sms",
    e164Phone?: string
  ) => Promise<{ success: boolean; error?: string }>;
  onVerifyOtp: (
    code: string,
    identifier: string,
    channel: "email" | "sms"
  ) => Promise<{ success: boolean; error?: string }>;
  footerText?: string;
  defaultPhoneCountry?: CountryCode;
  alreadyAuthenticated?: boolean;
  privacyUrl?: string;
  termsUrl?: string;
}

export function AdminLoginCard({
  appName,
  subtitle,
  heroTitle,
  heroDescription,
  onRequestOtp,
  onVerifyOtp,
  footerText,
  defaultPhoneCountry,
  alreadyAuthenticated,
  privacyUrl,
  termsUrl,
}: AdminLoginCardProps) {
  const [step, setStep] = useState<LoginStep>("identifier");
  const [inputMode, setInputMode] = useState<InputMode>("email");
  const [email, setEmail] = useState("");
  const [phoneRaw, setPhoneRaw] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<CountryCode | undefined>(
    defaultPhoneCountry
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const displayIdentifier = inputMode === "email" ? email : phoneRaw;

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendTimer]);

  if (alreadyAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleRequestOtp = async () => {
    const identifier =
      inputMode === "email" ? email.trim() : phoneE164 || phoneRaw.trim();
    const channel = inputMode === "email" ? ("email" as const) : ("sms" as const);

    if (!identifier) {
      setError(
        inputMode === "email"
          ? "Please enter your email address"
          : "Please enter a valid phone number"
      );
      return;
    }

    if (inputMode === "phone" && !phoneE164) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onRequestOtp(
        identifier,
        channel,
        inputMode === "phone" ? phoneE164 : undefined
      );

      if (result.success) {
        setStep("otp");
        setResendTimer(60);
      } else {
        setError(result.error ?? "Failed to send verification code");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const verifyIdentifier =
        inputMode === "email" ? email.trim() : phoneE164;
      const verifyChannel =
        inputMode === "email" ? ("email" as const) : ("sms" as const);
      const result = await onVerifyOtp(code, verifyIdentifier, verifyChannel);
      if (!result.success) {
        setError(result.error ?? "Invalid verification code");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("identifier");
    setError(null);
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      handleRequestOtp();
    }
  };

  const toggleInputMode = () => {
    setInputMode((prev) => (prev === "email" ? "phone" : "email"));
    setError(null);
  };

  const authCard = (
    <div className="w-full max-w-md">
      <div className="bg-card border rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground lg:hidden">
            {appName}
          </h1>
          <h2 className="text-xl font-semibold text-foreground hidden lg:block">
            Sign in
          </h2>
          <p className="text-muted-foreground mt-2">
            {step === "identifier"
              ? subtitle ?? "Sign in with your work credentials"
              : "Enter verification code"}
          </p>
        </div>

        {step === "identifier" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRequestOtp();
            }}
            className="space-y-6"
          >
            {inputMode === "email" ? (
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="login-phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Phone number
                </label>
                <PhoneInput
                  id="login-phone"
                  value={phoneRaw}
                  onChange={setPhoneRaw}
                  onE164Change={setPhoneE164}
                  country={phoneCountry}
                  onCountryChange={setPhoneCountry}
                  autoFocus
                />
              </div>
            )}

            {/* Toggle between email / phone */}
            <button
              type="button"
              onClick={toggleInputMode}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={loading}
            >
              {inputMode === "email" ? (
                <>
                  <Phone className="w-3.5 h-3.5" />
                  Use mobile instead
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  Use email instead
                </>
              )}
            </button>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Code"
              )}
            </button>

            {/* Footer text */}
            {footerText && (
              <p className="text-xs text-center text-muted-foreground">
                {footerText}
              </p>
            )}
          </form>
        ) : (
          /* Step 2: Enter OTP */
          <div className="space-y-6">
            {/* Back button */}
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Info */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to
              </p>
              <p className="font-medium text-foreground mt-1">
                {displayIdentifier}
              </p>
            </div>

            {/* OTP Input */}
            <OtpInput
              onComplete={handleVerifyOtp}
              disabled={loading}
              error={!!error}
              autoFocus
            />

            {/* Error message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Verifying...</span>
              </div>
            )}

            {/* Resend option */}
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend code in {resendTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer links */}
      {(privacyUrl || termsUrl) && (
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
          {privacyUrl && (
            <a
              href={privacyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
          )}
          {privacyUrl && termsUrl && <span>·</span>}
          {termsUrl && (
            <a
              href={termsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Nav bar */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <span className="text-lg font-semibold text-foreground">
            {appName}
          </span>
        </div>
      </nav>

      {/* Split layout */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Left hero — hidden on mobile */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">
              {heroTitle ?? `Welcome to ${appName}`}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {heroDescription ??
                "Sign in to access your dashboard and manage your platform."}
            </p>
          </div>
        </div>

        {/* Right auth card */}
        <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
          {authCard}
        </div>
      </div>
    </div>
  );
}
