'use client';

import type React from 'react';

import { useState } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Sample data structure
interface Item {
  id: string;
  name: string;
  time: string;
  inCharge: string;
  description: string;
}

// Empty item template for new items
const emptyItem: Item = {
  id: '',
  name: '',
  time: '',
  inCharge: '',
  description: '',
};

function InteractiveTable() {
  // Initial data
  const [items, setItems] = useState<Item[]>([
    {
      id: '001',
      name: 'Project Alpha',
      time: '2023-05-15',
      inCharge: 'John Doe',
      description:
        'This is a critical project focused on improving user experience across our platform. It involves redesigning the dashboard and optimizing performance.',
    },
    {
      id: '002',
      name: 'Feature Beta',
      time: '2023-06-20',
      inCharge: 'Jane Smith',
      description:
        'Implementing new analytics features to provide better insights for our customers. This includes custom reports and real-time data visualization.',
    },
    {
      id: '003',
      name: 'Maintenance Task',
      time: '2023-07-10',
      inCharge: 'Mike Johnson',
      description:
        'Regular system maintenance to ensure optimal performance. This includes database optimization, security updates, and bug fixes.',
    },
    {
      id: '004',
      name: 'Client Meeting',
      time: '2023-07-15',
      inCharge: 'Sarah Williams',
      description: 'Meeting with key stakeholders to discuss project progress and gather feedback on recent feature implementations.',
    },
    {
      id: '005',
      name: 'Product Launch',
      time: '2023-08-01',
      inCharge: 'Robert Chen',
      description:
        'Coordinating the launch of our new product line. This includes marketing coordination, technical preparation, and customer support readiness.',
    },
  ]);

  // State for selected items (checkboxes)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  // State for the currently viewed item details
  const [viewedItem, setViewedItem] = useState<Item | null>(null);

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for add mode
  const [isAdding, setIsAdding] = useState(false);

  // State for form data
  const [formData, setFormData] = useState<Item>(emptyItem);

  // Handle checkbox change
  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle row click to view details
  const handleRowClick = (item: Item) => {
    if (isEditing || isAdding) return; // Prevent changing selection while editing
    setViewedItem(item);
  };

  // Delete selected items
  const handleDelete = () => {
    const newItems = items.filter((item) => !selectedItems[item.id]);
    setItems(newItems);
    setSelectedItems({});

    // If we're viewing an item that's being deleted, clear the view
    if (viewedItem && selectedItems[viewedItem.id]) {
      setViewedItem(null);
    }
  };

  // Start editing an item
  const handleEdit = () => {
    if (viewedItem) {
      setFormData({ ...viewedItem });
      setIsEditing(true);
    }
  };

  // Start adding a new item
  const handleAdd = () => {
    setFormData({ ...emptyItem, id: generateId() });
    setIsAdding(true);
    setViewedItem(null);
  };

  // Generate a unique ID for new items
  const generateId = () => {
    const existingIds = items.map((item) => Number.parseInt(item.id));
    const maxId = Math.max(...existingIds, 0);
    return String(maxId + 1).padStart(3, '0');
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save edited item
  const handleSave = () => {
    // Validate form data
    if (!formData.name || !formData.time || !formData.inCharge) {
      alert('Please fill in all required fields');
      return;
    }

    if (isEditing) {
      // Update existing item
      setItems(items.map((item) => (item.id === formData.id ? formData : item)));
      setViewedItem(formData);
      setIsEditing(false);
    } else if (isAdding) {
      // Add new item
      setItems([...items, formData]);
      setViewedItem(formData);
      setIsAdding(false);
    }
  };

  // Cancel editing or adding
  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
  };

  // Check if any items are selected
  const hasSelectedItems = Object.values(selectedItems).some((value) => value);

  return (
    <div className="container mx-auto ml-4 mr-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAdd} className="flex items-center gap-2" size="lg" variant="default">
            <Plus className="h-5 w-5" />
            Add Item
          </Button>
          {hasSelectedItems && (
            <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>In Charge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={!!selectedItems[item.id]} onCheckedChange={() => handleCheckboxChange(item.id)} />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.inCharge}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="md:col-span-1">
          {isEditing || isAdding ? (
            <Card>
              <CardHeader>
                <CardTitle>{isAdding ? 'Add New Item' : 'Edit Item'}</CardTitle>
                <CardDescription>{isAdding ? 'Create a new task' : 'Update task details'}</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto pr-1">
                <form className="space-y-4 pb-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Task name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id">ID</Label>
                    <Input
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      disabled={true} // ID is auto-generated or fixed
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Date *</Label>
                    <Input id="time" name="time" type="date" value={formData.time} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inCharge">In Charge *</Label>
                    <Input
                      id="inCharge"
                      name="inCharge"
                      value={formData.inCharge}
                      onChange={handleInputChange}
                      placeholder="Person responsible"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Task description"
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </CardFooter>
            </Card>
          ) : viewedItem ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{viewedItem.name}</CardTitle>
                  <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
                    <Pencil className="h-5 w-5" />
                    Edit
                  </Button>
                </div>
                <CardDescription>
                  ID: {viewedItem.id} | In charge: {viewedItem.inCharge}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-muted-foreground">Date: {viewedItem.time}</p>
                <h3 className="mb-1 font-medium">Description:</h3>
                <p>{viewedItem.description}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>Click on a row to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No item selected</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default InteractiveTable;
