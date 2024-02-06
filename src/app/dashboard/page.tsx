'use client';

import {ProtectedView} from '@/app/components/ProtectedView';

export default function Dashboard() {
  return (
    <ProtectedView>
      <div>This is a dashboard</div>
    </ProtectedView>
  )
}
