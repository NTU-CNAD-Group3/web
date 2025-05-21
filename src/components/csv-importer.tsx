'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Button } from '@/components/expand-search-ui/button';
import { Input } from '@/components/expand-search-ui/input';
import { Alert, AlertDescription } from '@/components/expand-search-ui/alert';
import { AlertCircle, FileUp, Loader2 } from 'lucide-react';
import Papa from 'papaparse';

interface CSVImporterProps {
  // 改用 Record<string,string> 以符合 CSV 中每一筆資料格式
  onImport: (data: Record<string, string>[]) => void;
  isLoading: boolean;
  requiredHeaders: string[];
}

export function CSVImporter({ onImport, isLoading, requiredHeaders }: CSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  // 將 parsedData 型態由 any 改為 Record<string,string>[] | null
  const [parsedData, setParsedData] = useState<Record<string, string>[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setParsedData(null);
      return;
    }

    // Check if it's a CSV file
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setFile(null);
      setParsedData(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ',',
      complete: (results) => {
        const realErrors = results.errors.filter((e) => e.code !== 'UndetectableDelimiter');
        if (realErrors.length > 0) {
          setError(`Error parsing CSV: ${realErrors[0].message}`);
          setParsedData(null);
          return;
        }

        // 指定 results.data 型別為 Record<string,string>[]
        const data = results.data as Record<string, string>[];
        const headers = Object.keys(data[0] || {});
        const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

        if (missingHeaders.length > 0) {
          setError(`Missing required headers: ${missingHeaders.join(', ')}`);
          setParsedData(null);
          return;
        }

        setParsedData(data);
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
        setParsedData(null);
      },
    });
  };

  const handleImport = () => {
    if (!parsedData) {
      setError('No data to import');
      return;
    }

    onImport(parsedData);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFile(null);
    setParsedData(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} disabled={isLoading} className="cursor-pointer" />
        <p className="text-xs text-muted-foreground">Upload a CSV file with the required format. Maximum file size: 10MB.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {file && parsedData && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{parsedData.length} records ready to import</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFileInput} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={isLoading || !parsedData.length}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Import Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
