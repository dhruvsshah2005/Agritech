'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Onboarding() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  /* ---------------- PROFILE ---------------- */
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');

  /* ---------------- CROPS ---------------- */
  const [cropName, setCropName] = useState('');
  const [season, setSeason] = useState('');
  const [area, setArea] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [harvestDate, setHarvestDate] = useState('');

  const submit = async () => {
    setLoading(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    /* ---------- UPDATE PROFILE (optional fields only) ---------- */
    await supabase
      .from('profiles')
      .update({
        full_name: fullName || null,
        phone_number: phone || null,
        state: state || null,
        district: district || null,
        village: village || null
      })
      .eq('id', user.id);

    /* ---------- INSERT CROP ONLY IF ENTERED ---------- */
    if (cropName) {
      await supabase.from('crops').insert({
        farmer_id: user.id,
        crop_name: cropName,
        season: season || null,
        area_acres: area ? Number(area) : null,
        sowing_date: sowingDate || null,
        expected_harvest_date: harvestDate || null
      });
    }

    router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-6 w-full max-w-xl space-y-6">

        <h2 className="text-xl font-bold text-center">
          Farmer Information (Optional)
        </h2>

        {/* PROFILE SECTION */}
        <div className="space-y-3">
          <h3 className="font-semibold">Personal Details</h3>

          <Input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
          <Input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input placeholder="State" value={state} onChange={e => setState(e.target.value)} />
          <Input placeholder="District" value={district} onChange={e => setDistrict(e.target.value)} />
          <Input placeholder="Village" value={village} onChange={e => setVillage(e.target.value)} />
        </div>

        {/* CROP SECTION */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold">Crop Details</h3>

          <Input placeholder="Crop Name" value={cropName} onChange={e => setCropName(e.target.value)} />
          <Input placeholder="Season (Kharif / Rabi / Zaid)" value={season} onChange={e => setSeason(e.target.value)} />
          <Input placeholder="Area (Acres)" value={area} onChange={e => setArea(e.target.value)} />
          <Input type="date" value={sowingDate} onChange={e => setSowingDate(e.target.value)} />
          <Input type="date" value={harvestDate} onChange={e => setHarvestDate(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/dashboard')}
          >
            Skip
          </Button>

          <Button
            className="w-full"
            disabled={loading}
            onClick={submit}
          >
            {loading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
