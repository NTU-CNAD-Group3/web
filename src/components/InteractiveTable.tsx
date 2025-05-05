'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Item {
  id: string;
  name: string;
  time: string;
  inCharge: string;
  description: string;
}

// Original task data
const sampleItems: Item[] = [
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
];

type OperationType = 'dc' | 'room' | 'rack';

interface Rack {
  rackName: string;
  serviceName: string;
  height: string;
}

function InteractiveTable() {
  // Original task data
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [viewedItem, setViewedItem] = useState<Item | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isAdding, setIsAdding] = useState(false);

  // add operation 
  const [operationType, setOperationType] = useState<OperationType>('dc');
  const [dcName, setDcName] = useState('');
  const [roomCount, setRoomCount] = useState<number>(0);
  const [roomNames, setRoomNames] = useState<string[]>([]);
  const [roomName, setRoomName] = useState('');
  const [rackCount, setRackCount] = useState<number>(0);
  const [racks, setRacks] = useState<Rack[]>([]);

  // Handle checkbox change for existing table items
  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRowClick = (item: Item) => {
    if (isEditing || isAdding) return;
    setViewedItem(item);
  };

  const handleDelete = () => {
    const newItems = items.filter((item) => !selectedItems[item.id]);
    setItems(newItems);
    setSelectedItems({});
    if (viewedItem && selectedItems[viewedItem.id]) {
      setViewedItem(null);
    }
  };

  const handleEdit = () => {
    if (viewedItem) {
      setIsEditing(true);
    }
  };

  // open add operation form and set default values
  const handleAdd = () => {
    setOperationType('dc');
    setDcName('');
    setRoomCount(0);
    setRoomNames([]);
    setRoomName('');
    setRackCount(0);
    setRacks([]);
    setIsAdding(true);
    setViewedItem(null);
  };

  const handleRoomNameChange = (index: number, value: string) => {
    const newRoomNames = [...roomNames];
    newRoomNames[index] = value;
    setRoomNames(newRoomNames);
  };

  const handleRackChange = (index: number, field: keyof Rack, value: string) => {
    const newRacks = [...racks];
    newRacks[index] = {
      ...newRacks[index],
      [field]: value,
    };
    setRacks(newRacks);
  };

  useEffect(() => {
    if (operationType === 'room') {
      setRoomNames(Array(roomCount).fill(''));
    }
  }, [roomCount, operationType]);

  useEffect(() => {
    if (operationType === 'rack') {
      setRacks(Array(rackCount).fill({ racktName: '', serviceName: '', height: '' }));
    }
  }, [rackCount, operationType]);

  // simulate save operation
  const handleSave = () => {
    if (operationType === 'dc') {
      if (!dcName) {
        alert('Please fill in DC Name');
        return;
      }
      // simulate API call for DC creation
      setTimeout(() => {
        alert(`DC created successfully! New DC ID: ${Math.floor(Math.random() * 1000)}`);
        setIsAdding(false);
      }, 500);
    } else if (operationType === 'room') {
      if (!dcName || roomCount <= 0 || roomNames.some((name) => !name)) {
        alert('Please fill in all required fields for Room creation');
        return;
      }
      // simulate API call for Room creation
      setTimeout(() => {
        alert(`Room(s) created successfully for DC "${dcName}"!`);
        setIsAdding(false);
      }, 500);
    } else if (operationType === 'rack') {
      if (!dcName || !roomName || rackCount <= 0 || racks.some(rac => !rac.rackName || !rac.serviceName || !rac.height)) {
        alert('Please fill in all required fields for Rack creation');
        return;
      }

      setTimeout(() => {
        alert(`Rack(s) created successfully in Room "${roomName}" for DC "${dcName}"!`);
        setIsAdding(false);
      }, 500);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
  };

  const hasSelectedItems = Object.values(selectedItems).some((v) => v);

  return (
    <div className="container mx-auto ml-4 mr-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Operation Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAdd} className="flex items-center gap-2" size="lg" variant="default">
            <Plus className="h-5 w-5" />
            Create Operation
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
                  <TableRow
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={!!selectedItems[item.id]}
                        onCheckedChange={() => handleCheckboxChange(item.id)}
                      />
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
          {isAdding ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Operation</CardTitle>
                <CardDescription>
                  Fill in the details and press Save.
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto pr-1">
                <form className="space-y-4 pb-2">
                  <div className="space-y-2">
                    <Label htmlFor="operationType">Operation Type</Label>
                    <select
                      id="operationType"
                      title="Operation Type"
                      value={operationType}
                      onChange={(e) => setOperationType(e.target.value as OperationType)}
                      className="border rounded p-1"
                    >
                      <option value="dc">Create DC</option>
                      <option value="room">Create Room</option>
                      <option value="rack">Create rack</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dcName">DC Name *</Label>
                    <Input
                      id="dcName"
                      name="dcName"
                      value={dcName}
                      onChange={(e) => setDcName(e.target.value)}
                      placeholder="Enter DC Name"
                      required
                    />
                  </div>

                  {operationType === 'room' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="roomCount">Number of Rooms *</Label>
                        <Input
                          id="roomCount"
                          name="roomCount"
                          type="number"
                          min="0"
                          value={roomCount}
                          onChange={(e) => setRoomCount(Number(e.target.value))}
                          required
                        />
                      </div>
                      {roomNames.map((room, index) => (
                        <div key={index} className="space-y-2">
                          <Label htmlFor={`roomName-${index}`}>Room {index + 1} Name *</Label>
                          <Input
                            id={`roomName-${index}`}
                            name={`roomName-${index}`}
                            value={room}
                            onChange={(e) => handleRoomNameChange(index, e.target.value)}
                            placeholder="Enter Room Name"
                            required
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {operationType === 'rack' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="roomName">Room Name *</Label>
                        <Input
                          id="roomName"
                          name="roomName"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                          placeholder="Enter Room Name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rackCount">Number of Racks *</Label>
                        <Input
                          id="rackCount"
                          name="rackCount"
                          type="number"
                          min="0"
                          value={rackCount}
                          onChange={(e) => setRackCount(Number(e.target.value))}
                          required
                        />
                      </div>
                      {racks.map((rac, index) => (
                        <div key={index} className="border p-2 rounded space-y-2">
                          <div className="space-y-2">
                            <Label htmlFor={`rackName-${index}`}>Rack {index + 1} Name *</Label>
                            <Input
                              id={`rackName-${index}`}
                              name={`rackName-${index}`}
                              value={rac.rackName}
                              onChange={(e) => handleRackChange(index, 'rackName', e.target.value)}
                              placeholder="Enter Rack Name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`serviceName-${index}`}>Service Name *</Label>
                            <Input
                              id={`serviceName-${index}`}
                              name={`serviceName-${index}`}
                              value={rac.serviceName}
                              onChange={(e) => handleRackChange(index, 'serviceName', e.target.value)}
                              placeholder="Enter Service Name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`height-${index}`}>Height (unit) *</Label>
                            <Input
                              id={`height-${index}`}
                              name={`height-${index}`}
                              value={rac.height}
                              onChange={(e) => handleRackChange(index, 'height', e.target.value)}
                              placeholder="Enter Height"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
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
