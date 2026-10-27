'use client';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { PLATFORM_DEFAULTS } from '@/features/settings/fixtures/settingsFixtures';
import {
  platformSchema,
  type PlatformDraft,
} from '@/features/settings/schemas/platformSchema';
export function usePlatformDraft() {
  const [editing, setEditing] = useState(false);
  const form = useForm<PlatformDraft>({
    defaultValues: PLATFORM_DEFAULTS,
    mode: 'onChange',
  });
  const values = useWatch({ control: form.control });
  const validation = platformSchema.safeParse(values);
  return {
    form,
    editing,
    begin: () => setEditing(true),
    cancel: () => {
      form.reset(PLATFORM_DEFAULTS);
      setEditing(false);
    },
    issues: validation.success ? [] : validation.error.issues,
  };
}
