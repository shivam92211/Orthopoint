"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalInstruments: 0,
    availableInstruments: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [instrumentsRes, categoriesRes] = await Promise.all([
        fetch("/api/instruments"),
        fetch("/api/categories"),
      ]);

      const instrumentsData = await instrumentsRes.json();
      const categoriesData = await categoriesRes.json();

      if (instrumentsData.success) {
        const instruments = instrumentsData.data;
        setStats({
          totalInstruments: instruments.length,
          availableInstruments: instruments.filter((i: any) => i.available)
            .length,
          categories: categoriesData.success ? categoriesData.data.length : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          Logout
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Instruments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInstruments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.availableInstruments}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.categories}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link href="/admin/instruments/add">
                  <Button>Add New Instrument</Button>
                </Link>
                <Link href="/admin/instruments">
                  <Button variant="outline">Manage Instruments</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
