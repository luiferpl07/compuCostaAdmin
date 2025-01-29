"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    date: "2024-01-20",
    total: 1299.99,
    status: "Completed",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    date: "2024-01-19",
    total: 459.99,
    status: "Processing",
  },
  {
    id: "#ORD-003",
    customer: "Robert Wilson",
    date: "2024-01-18",
    total: 789.99,
    status: "Shipped",
  },
  {
    id: "#ORD-004",
    customer: "Sarah Davis",
    date: "2024-01-17",
    total: 129.99,
    status: "Pending",
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500";
    case "processing":
      return "bg-blue-500";
    case "shipped":
      return "bg-yellow-500";
    case "pending":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}