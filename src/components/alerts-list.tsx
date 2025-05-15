'use client';

import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/external-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/external-ui/dropdown-menu';

type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertStatus = 'active' | 'acknowledged' | 'resolved';

interface Alert {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  source: string;
  timestamp: string;
}

const alerts: Alert[] = [
  {
    id: 'alert-001',
    severity: 'critical',
    status: 'active',
    message: 'DB-SRV-01 low disk space (5% available)',
    source: 'Storage Monitoring',
    timestamp: '10 minutes ago',
  },
  {
    id: 'alert-002',
    severity: 'warning',
    status: 'active',
    message: 'WEB-SRV-01 high CPU usage (92%)',
    source: 'Performance Monitoring',
    timestamp: '25 minutes ago',
  },
  {
    id: 'alert-003',
    severity: 'critical',
    status: 'acknowledged',
    message: 'BACKUP-SRV-01 backup failed',
    source: 'Backup System',
    timestamp: '1 hour ago',
  },
  {
    id: 'alert-004',
    severity: 'info',
    status: 'active',
    message: 'System update available',
    source: 'System Management',
    timestamp: '2 hours ago',
  },
  {
    id: 'alert-005',
    severity: 'warning',
    status: 'resolved',
    message: 'Network connectivity unstable',
    source: 'Network Monitoring',
    timestamp: '3 hours ago',
  },
];

export function AlertsList({ showAll = false }: { showAll?: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [alertsList, setAlertsList] = useState<Alert[]>(alerts);

  const displayAlerts = showAll ? alertsList : alertsList.slice(0, 3);

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'active':
        return <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Active</span>;
      case 'acknowledged':
        return <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">Acknowledged</span>;
      case 'resolved':
        return <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Resolved</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {displayAlerts.map((alert) => (
        <div key={alert.id} className="flex items-start space-x-4 rounded-md border p-4">
          <div>{getSeverityIcon(alert.severity)}</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{alert.message}</p>
              <div className="flex items-center space-x-2">
                {getStatusBadge(alert.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Acknowledge</DropdownMenuItem>
                    <DropdownMenuItem>Resolve</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>Source: {alert.source}</div>
              <div>{alert.timestamp}</div>
            </div>
          </div>
        </div>
      ))}
      {!showAll && alertsList.length > 3 && (
        <Button variant="outline" className="w-full">
          View All Alerts ({alertsList.length})
        </Button>
      )}
    </div>
  );
}
