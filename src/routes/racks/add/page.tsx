import { MainNav } from '@/components/main-nav';
import { Search } from '@/components/search';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/external-ui/card';
import { RackEditForm } from '@/components/rack-edit-form';
import { Button } from '@/components/external-ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from '@/components/link';

export default function AddRackPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
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
        <div className="flex items-center space-x-2">
          <Link to="/racks">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              返回
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">添加新機架</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>機架信息</CardTitle>
            <CardDescription>填寫新機架的詳細信息</CardDescription>
          </CardHeader>
          <CardContent>
            <RackEditForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
