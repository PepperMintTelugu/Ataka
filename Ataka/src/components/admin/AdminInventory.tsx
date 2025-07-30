import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import books from '@/data/books';

// Enhanced books with stock information
const booksWithStock = books.map(book => ({
  ...book,
  stock: Math.floor(Math.random() * 100) + 1, // Random stock for demo
  lowStockThreshold: 10,
  supplier: 'Telugu Publishers Ltd.',
  lastRestocked: '2025-04-01',
}));

const AdminInventory = () => {
  const [inventory, setInventory] = useState(booksWithStock);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'low-stock') {
      return matchesSearch && item.stock <= item.lowStockThreshold;
    } else if (filter === 'out-of-stock') {
      return matchesSearch && item.stock === 0;
    }
    
    return matchesSearch;
  });

  const handleUpdateStock = (id: string, newStock: number) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, stock: newStock } : item
    ));
  };

  const handleRestockAll = () => {
    if (confirm('This will restock all low stock items. Continue?')) {
      setInventory(inventory.map(item => 
        item.stock <= item.lowStockThreshold ? 
          { ...item, stock: 50, lastRestocked: new Date().toISOString().split('T')[0] } : 
          item
      ));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Button onClick={handleRestockAll}>Restock Low Items</Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full h-10 rounded-md border border-input px-3 py-2 bg-background"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Books</p>
            <p className="text-2xl font-bold">{inventory.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <p className="text-2xl font-bold text-amber-500">
              {inventory.filter(item => item.stock <= item.lowStockThreshold).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-red-500">
              {inventory.filter(item => item.stock === 0).length}
            </p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.author}</TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  value={item.stock} 
                  onChange={(e) => handleUpdateStock(item.id, parseInt(e.target.value))}
                  min="0"
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                {item.stock === 0 ? (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    Out of Stock
                  </span>
                ) : item.stock <= item.lowStockThreshold ? (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Low Stock
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    In Stock
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStock(item.id, 50)}
                >
                  Restock
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminInventory;
