'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApi, Server } from '@/contexts/api-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/expand-search-ui/card';
import { MainNav } from '@/components/main-nav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/user-nav';
import { Button } from '@/components/expand-search-ui/button';
import { Input } from '@/components/expand-search-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/expand-search-ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/expand-search-ui/table';
import { AlertCircle, CheckCircle, SearchIcon } from 'lucide-react';
import { Badge } from '@/components/expand-search-ui/badge';

export default function SearchPage() {
  const api = useApi();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialKeyword = searchParams.get('keyword') || '';
  const initialType = searchParams.get('type') || 'name';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchType, setSearchType] = useState(initialType);
  const [searchResults, setSearchResults] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 修改 dcMapping 相關程式，使用 string 作為 key
  const [dcMapping, setDcMapping] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadDC() {
      try {
        const dc = await api.getAllDC();
        const mapping: Record<string, string> = {};
        Object.entries(dc).forEach(([key, value]) => {
          mapping[key] = value.name; // 不轉型，直接保存 key
        });
        setDcMapping(mapping);
      } catch (e) {
        console.error(e);
      }
    }
    loadDC();
  }, [api]);

  const performSearch = useCallback(
    async (kw: string, type: string, page: number, size: number) => {
      if (!kw.trim()) return;
      setIsLoading(true);
      setHasSearched(true);
      try {
        const results = await api.searchServers(kw, type, page, size);
        setSearchResults(results);
        const params = new URLSearchParams();
        params.set('keyword', kw);
        params.set('type', type);
        params.set('page', String(page));
        navigate(`/search?${params.toString()}`, { replace: true });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [api, navigate],
  );

  useEffect(() => {
    if (initialKeyword) {
      performSearch(initialKeyword, initialType, 0, 10);
    }
  }, [initialKeyword, initialType, performSearch]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Servers</CardTitle>
            <CardDescription>Search by name, service, or location</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                performSearch(keyword, searchType, 0, 10);
              }}
              className="flex flex-col items-end gap-4 md:flex-row"
            >
              <div className="flex-1">
                <Input placeholder="Enter keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              </div>
              <div className="w-full md:w-48">
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="fabId">Data Center</SelectItem>
                    <SelectItem value="roomId">Room</SelectItem>
                    <SelectItem value="rackId">Rack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isLoading} className="md:self-end">
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>

            <div className="mt-6">
              {isLoading ? (
                <div className="py-8 text-center">Loading...</div>
              ) : hasSearched && searchResults.length === 0 ? (
                <div className="py-8 text-center">No results found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((srv) => (
                      <TableRow key={srv.id}>
                        <TableCell>{srv.name}</TableCell>
                        <TableCell>{srv.service}</TableCell>
                        <TableCell>
                          {srv.healthy ? (
                            <Badge variant="outline" className="flex items-center border-green-200 bg-green-50 text-green-700">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Normal
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Broken
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {/* 修改連結，使用 'dc' + srv.fabid 作為 key */}
                          <Link to={`/room/${'dc' + srv.fabid}/${dcMapping['dc' + srv.fabid] || 'unknown'}/room${srv.roomid}`}>
                            <Button variant="outline" size="sm">
                              View Rack
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
