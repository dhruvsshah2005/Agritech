'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function Onboarding() {
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    state: '',
    district: '',
    village: '',

    crop_name: '',
    season: '',
    area_acres: '',
    sowing_date: '',
    expected_harvest_date: ''
  });

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    // will connect to Supabase later
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl p-6 space-y-8">

        {/* Header */}
        <div className="text-center">
          <Leaf className="mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Farmer Details</h2>
          <p className="text-sm text-muted-foreground">
            You can skip this and complete later
          </p>
        </div>

        {/* Profile Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Personal Information</h3>

          <Input
            placeholder="Full Name"
            value={form.full_name}
            onChange={e => update('full_name', e.target.value)}
          />

          <Input
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={e => update('phone_number', e.target.value)}
          />

          <Input
            placeholder="State"
            value={form.state}
            onChange={e => update('state', e.target.value)}
          />

          <Input
            placeholder="District"
            value={form.district}
            onChange={e => update('district', e.target.value)}
          />

          <Input
            placeholder="Village"
            value={form.village}
            onChange={e => update('village', e.target.value)}
          />
        </div>

        {/* Crop Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Crop Information</h3>

          <Input
            placeholder="Crop Name (e.g. Wheat, Rice)"
            value={form.crop_name}
            onChange={e => update('crop_name', e.target.value)}
          />

          <Input
            placeholder="Season (Kharif / Rabi / Zaid)"
            value={form.season}
            onChange={e => update('season', e.target.value)}
          />

          <Input
            placeholder="Area in Acres"
            value={form.area_acres}
            onChange={e => update('area_acres', e.target.value)}
          />

          <Input
            type="date"
            placeholder="Sowing Date"
            value={form.sowing_date}
            onChange={e => update('sowing_date', e.target.value)}
          />

          <Input
            type="date"
            placeholder="Expected Harvest Date"
            value={form.expected_harvest_date}
            onChange={e =>
              update('expected_harvest_date', e.target.value)
            }
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="w-full" onClick={submit}>
            Save Details
          </Button>

          <Button variant="outline" className="w-full">
            Skip for Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
