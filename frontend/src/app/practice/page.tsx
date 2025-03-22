'use client';

import LevelBoard from '@/components/game/Level';
import level1 from '@/lib/game/levels/level1';

export default function Practice() {
  return (
    <div>
      <LevelBoard id="1" level={level1} />
    </div>
  );
}
