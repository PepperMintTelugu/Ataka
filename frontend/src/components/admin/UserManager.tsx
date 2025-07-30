import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  UserPlus,
  Shield,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Eye,
  ShieldCheck,
  UserX,
  Calendar,
  Mail,
  Phone,
  Key
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'order_manager' | 'inventory_manager' | 'support_staff';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  phone?: string;
  department?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@ataka.com",
    fullName: "System Administrator",
    role: "super_admin",
    permissions: ["*"],
    isActive: true,
    lastLogin: "2024-12-10T10:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    phone: "+91 98765 43210",
    department: "Technology"
  },
  {
    id: "2",
    username: "orders",
    email: "orders@ataka.com",
    fullName: "Order Manager",
    role: "order_manager",
    permissions: ["orders.view", "orders.edit", "customers.view", "shipping.view"],
    isActive: true,
    lastLogin: "2024-12-10T09:15:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    phone: "+91 87654 32109",
    department: "Operations"
  },
  {
    id: "3",
    username: "inventory",
    email: "inventory@ataka.com",
    fullName: "Inventory Manager",
    role: "inventory_manager",
    permissions: ["books.view", "books.edit", "books.create", "authors.manage"],
    isActive: true,
    lastLogin: "2024-12-09T16:45:00Z",
    createdAt: "2024-02-15T00:00:00Z",
    phone: "+91 76543 21098",
    department: "Inventory"
  },
  {
    id: "4",
    username: "support",
    email: "support@ataka.com",
    fullName: "Support Staff",
    role: "support_staff",
    permissions: ["dashboard.view", "orders.view", "customers.view"],
    isActive: true,
    createdAt: "2024-03-01T00:00:00Z",
    phone: "+91 65432 10987",
    department: "Customer Service"
  },
  {
    id: "5",
    username: "manager",
    email: "manager@ataka.com",
    fullName: "Store Manager",
    role: "admin",
    permissions: ["dashboard.view", "books.manage", "orders.manage", "reports.view"],
    isActive: false,
    lastLogin: "2024-12-05T14:20:00Z",
    createdAt: "2024-01-15T00:00:00Z",
    phone: "+91 54321 09876",
    department: "Management"
  }
];

const roles = [
  { value: "super_admin", label: "Super Admin", color: "bg-red-100 text-red-800" },
  { value: "admin", label: "Admin", color: "bg-blue-100 text-blue-800" },
  { value: "order_manager", label: "Order Manager", color: "bg-green-100 text-green-800" },
  { value: "inventory_manager", label: "Inventory Manager", color: "bg-purple-100 text-purple-800" },
  { value: "support_staff", label: "Support Staff", color: "bg-gray-100 text-gray-800" }
];

const rolePermissions = {
  super_admin: ["*"],
  admin: ["dashboard.view", "books.manage", "orders.manage", "customers.manage", "reports.view"],
  order_manager: ["dashboard.view", "orders.view", "orders.edit", "customers.view", "shipping.view"],
  inventory_manager: ["dashboard.view", "books.view", "books.edit", "books.create", "authors.manage"],
  support_staff: ["dashboard.view", "orders.view", "customers.view", "support.manage"]
};

export default function UserManager() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "support_staff" as User['role'],
    phone: "",
    department: "",
    password: ""
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && user.isActive) ||
                         (filterStatus === "inactive" && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || roles[4];
  };

  const addUser = () => {
    if (!newUser.username || !newUser.email || !newUser.fullName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      permissions: rolePermissions[newUser.role],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setUsers([...users, user]);
    setIsAddingUser(false);
    setNewUser({
      username: "",
      email: "",
      fullName: "",
      role: "support_staff",
      phone: "",
      department: "",
      password: ""
    });

    toast({
      title: "User Added",
      description: `${user.fullName} has been added successfully.`,
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: user?.isActive ? "User Deactivated" : "User Activated",
      description: `${user?.fullName} account has been ${user?.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'super_admin') {
      toast({
        title: "Cannot Delete",
        description: "Super Admin accounts cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: `${user?.fullName} has been removed from the system.`,
    });
  };

  const exportUsers = () => {
    const dataStr = JSON.stringify(filteredUsers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'users-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const adminUsers = users.filter(u => u.role === 'super_admin' || u.role === 'admin').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Management
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage admin users, roles, and permissions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportUsers}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={newUser.department}
                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                        placeholder="Enter department"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value as User['role']})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsAddingUser(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addUser}>
                        Add User
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">{adminUsers}</p>
                <p className="text-sm text-gray-600">Admin Users</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-sm text-gray-600">@{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleInfo.color}>
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.department || 'Not specified'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.lastLogin ? (
                            <>
                              <p>{new Date(user.lastLogin).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(user.lastLogin).toLocaleTimeString()}
                              </p>
                            </>
                          ) : (
                            <span className="text-gray-400">Never</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() => toggleUserStatus(user.id)}
                            disabled={user.role === 'super_admin'}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                            disabled={user.role === 'super_admin'}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {searchTerm || filterRole !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No users have been added to the system yet"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details - {editingUser.fullName}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Personal Information</Label>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Full Name:</span> {editingUser.fullName}</p>
                    <p><span className="font-medium">Username:</span> @{editingUser.username}</p>
                    <p><span className="font-medium">Email:</span> {editingUser.email}</p>
                    {editingUser.phone && (
                      <p><span className="font-medium">Phone:</span> {editingUser.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Role & Permissions</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Role:</span>
                      <Badge className={getRoleInfo(editingUser.role).color}>
                        {getRoleInfo(editingUser.role).label}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Permissions:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {editingUser.permissions.includes("*") ? (
                          <Badge variant="outline" className="text-xs">All Permissions</Badge>
                        ) : (
                          editingUser.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Account Status</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Status:</span>
                      <Badge className={editingUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {editingUser.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p><span className="font-medium">Department:</span> {editingUser.department || 'Not specified'}</p>
                    <p><span className="font-medium">Created:</span> {new Date(editingUser.createdAt).toLocaleDateString()}</p>
                    {editingUser.lastLogin && (
                      <p><span className="font-medium">Last Login:</span> {new Date(editingUser.lastLogin).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Close
              </Button>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
