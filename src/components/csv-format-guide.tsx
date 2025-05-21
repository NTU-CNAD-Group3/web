'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/expand-search-ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/expand-search-ui/table';
import { Button } from '@/components/expand-search-ui/button';
import { Download } from 'lucide-react';

interface CSVFormatGuideProps {
  headers: string[];
  example: Record<string, string>[];
  description: string;
}

export function CSVFormatGuide({ headers, example, description }: CSVFormatGuideProps) {
  const generateExampleCSV = () => {
    // Create CSV header row
    const csvContent = [
      headers.join(','),
      // Create data rows
      ...example.map((row) => headers.map((header) => row[header] || '').join(',')),
    ].join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'example_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">CSV Format Guide</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={generateExampleCSV}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {example.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={`${index}-${header}`}>{row[header] || ''}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
