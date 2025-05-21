'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/expand-search-ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/expand-search-ui/table';
import { Badge } from '@/components/expand-search-ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface ImportResultsProps {
  results: {
    total: number;
    successful: number;
    failed: number;
    details: Array<{
      item: unknown;
      success: boolean;
      message: string;
    }>;
  };
}

export function ImportResults({ results }: ImportResultsProps) {
  // Only show the first 10 details to avoid overwhelming the UI
  const displayDetails = results.details.slice(0, 10);
  const hasMore = results.details.length > 10;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Results</CardTitle>
        <CardDescription>
          Successfully imported {results.successful} of {results.total} items.
          {results.failed > 0 && ` Failed to import ${results.failed} items.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                <CheckCircle className="mr-1 h-3 w-3" />
                {results.successful} Successful
              </Badge>
            </div>
            {results.failed > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-3 w-3" />
                  {results.failed} Failed
                </Badge>
              </div>
            )}
          </div>

          {displayDetails.length > 0 && (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayDetails.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {detail.success ? (
                          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Success
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate font-mono text-xs">{JSON.stringify(detail.item)}</div>
                      </TableCell>
                      <TableCell>{detail.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {hasMore && (
            <p className="text-sm text-muted-foreground">
              Showing 10 of {results.details.length} results. See the logs for complete details.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
