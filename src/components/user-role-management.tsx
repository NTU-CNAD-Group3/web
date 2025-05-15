import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/external-ui/table';
import { Badge } from '@/components/external-ui/badge';
import { Button } from '@/components/external-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/external-ui/dropdown-menu';
import { Input } from '@/components/external-ui/input';
import { MoreHorizontal, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/external-ui/alert-dialog';
import { UserRoleDialog } from '@/components/user-role-dialog';

// Mock data for users
const users = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'administrator',
    department: 'IT',
    lastLogin: '2023-05-15 09:30',
    status: 'active',
  },
  {
    id: 'user-002',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'user',
    department: 'Operations',
    lastLogin: '2023-05-14 14:45',
    status: 'active',
  },
  {
    id: 'user-003',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    role: 'administrator',
    department: 'Infrastructure',
    lastLogin: '2023-05-15 08:15',
    status: 'active',
  },
  {
    id: 'user-004',
    name: 'Emily Williams',
    email: 'emily.williams@example.com',
    role: 'user',
    department: 'Network',
    lastLogin: '2023-05-13 11:20',
    status: 'inactive',
  },
  {
    id: 'user-005',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'user',
    department: 'Security',
    lastLogin: '2023-05-14 16:30',
    status: 'active',
  },
];

export function UserRoleManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [usersList, setUsersList] = useState(users);
  const { toast } = useToast();

  const filteredUsers = usersList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUserUpdate = () => {
    toast({
      title: 'User Updated',
      description: 'User information has been successfully updated.',
    });
  };

  // const handleUserDelete = (userId: string) => {
  //   setUsersList(usersList.filter((user) => user.id !== userId));
  //   toast({
  //     title: 'User Deleted',
  //     description: 'The user has been successfully removed from the system.',
  //   });
  // };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'administrator':
        return <Badge className="bg-purple-500">Administrator</Badge>;
      case 'user':
        return <Badge variant="outline">User</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-9" />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <UserRoleDialog
            onSave={handleUserUpdate}
            trigger={
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            }
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <UserRoleDialog
                          userId={user.id}
                          onSave={handleUserUpdate}
                          initialData={{
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            department: user.department,
                            status: user.status,
                          }}
                          trigger={<div className="w-full">Edit User</div>}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Activity</DropdownMenuItem>
                      <DropdownMenuItem>Reset Password</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        <AlertDialog>
                          <AlertDialogTrigger className="w-full text-left">Delete User</AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this user? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
