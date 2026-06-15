'use client';

import { Badge } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@novansa/ui';
import type { Staff, ImportStaff } from '@/contexts/StaffContext';

interface StaffDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: Staff;
  importStaff?: ImportStaff;
  type: 'current' | 'imported';
}

export function StaffDetailDialog({
  isOpen,
  onClose,
  staff,
  importStaff,
  type,
}: StaffDetailDialogProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'Not specified';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  const renderCurrentStaffDetails = (staffMember: Staff) => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-base font-semibold">
                {staffMember.first_name} {staffMember.last_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <p className="text-base">{staffMember.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Staff ID</label>
              <p className="text-base font-mono">#{staffMember.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-base">{formatDate(staffMember.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    staffMember.current
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {staffMember.current ? 'Currently Employed' : 'No Longer Employed'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bonus Eligibility</label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    staffMember.bonus ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {staffMember.bonus ? 'Eligible for Bonuses' : 'Not Eligible'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Management Role</label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    staffMember.management
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {staffMember.management ? 'Management' : 'Staff'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Telegram ID</label>
              <p className="text-base font-mono">{staffMember.telegram_id ?? 'Not configured'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Telegram Username</label>
              <p className="text-base">
                {staffMember.telegram_user_name != null && staffMember.telegram_user_name.length > 0
                  ? `@${staffMember.telegram_user_name}`
                  : 'Not configured'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Cliniko API Key</label>
              <p className="text-base font-mono text-xs">
                {staffMember.cliniko_api_key != null && staffMember.cliniko_api_key.length > 0
                  ? `${staffMember.cliniko_api_key.substring(0, 8)}...`
                  : 'Not configured'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Coda ID</label>
              <p className="text-base font-mono">{staffMember.coda_id ?? 'Not configured'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderImportedStaffDetails = (staffMember: ImportStaff) => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-base font-semibold">{staffMember['Full Name']}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">First Name</label>
              <p className="text-base">{staffMember['First Name']}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Name</label>
              <p className="text-base">{staffMember['Last Name']}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Staff ID</label>
              <p className="text-base font-mono">#{staffMember['Staff ID']}</p>
            </div>
            {staffMember.new_staff_id != null && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">New Staff ID</label>
                <p className="text-base font-mono">#{staffMember.new_staff_id}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <p className="text-base">{staffMember.Role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Job Title</label>
              <p className="text-base">{staffMember['Job Title']}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Groups</label>
              <p className="text-base">{staffMember.Groups}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Hourly Pay</label>
              <p className="text-base font-semibold text-primary">
                {formatCurrency(staffMember['Hourly Pay'])}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    staffMember.Current
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {staffMember.Current ? 'Currently Employed' : 'No Longer Employed'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bonus Eligibility</label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    staffMember.Bonus ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {staffMember.Bonus ? 'Eligible for Bonuses' : 'Not Eligible'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === 'current' && staff != null && `${staff.first_name} ${staff.last_name}`}
            {type === 'imported' && importStaff?.['Full Name']}
          </DialogTitle>
          <DialogDescription>
            {type === 'current' ? 'Current staff member details' : 'Imported staff data details'}
          </DialogDescription>
        </DialogHeader>

        {type === 'current' && staff && renderCurrentStaffDetails(staff)}
        {type === 'imported' && importStaff && renderImportedStaffDetails(importStaff)}
      </DialogContent>
    </Dialog>
  );
}
