'use client';
import { useState } from 'react';
import { SPOTLIGHT_CANDIDATES } from '@/features/settings/fixtures/settingsFixtures';
export function useSpotlightSelection() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [expert, setExpert] = useState('expert-tokunbo');
  const [merchant, setMerchant] = useState('merchant-isaac');
  const candidates = SPOTLIGHT_CANDIDATES.filter(
    (candidate) =>
      (category === 'all' || candidate.category === category) &&
      `${candidate.name} ${candidate.username}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  return {
    search,
    setSearch,
    category,
    setCategory,
    candidates,
    expert,
    merchant,
    setExpert,
    setMerchant,
  };
}
