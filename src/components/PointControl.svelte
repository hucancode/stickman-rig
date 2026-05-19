<script lang="ts">
  import type { Point } from '../lib/rig';

  interface Props {
    label: string;
    value: Point;
    compact?: boolean;
    onChange: (val: Point) => void;
  }

  let { label, value, compact = false, onChange }: Props = $props();
</script>

<div class="flex flex-col gap-1.5">
  <span class="text-slate-300 text-sm truncate" title={label}>{label}</span>
  <div class="flex gap-2 {compact ? 'flex-col' : ''}">
    <label class="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-md flex-1 ring-1 ring-inset ring-slate-700/50 focus-within:ring-blue-500/50 transition-shadow">
      <span class="text-slate-500 text-xs font-mono">X</span>
      <input
        type="number"
        class="bg-transparent w-full outline-none text-slate-300 text-sm tabular-nums"
        value={Math.round(value.x)}
        oninput={(e) => onChange({ ...value, x: Number((e.target as HTMLInputElement).value) })}
      />
    </label>
    <label class="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-md flex-1 ring-1 ring-inset ring-slate-700/50 focus-within:ring-blue-500/50 transition-shadow">
      <span class="text-slate-500 text-xs font-mono">Y</span>
      <input
        type="number"
        class="bg-transparent w-full outline-none text-slate-300 text-sm tabular-nums"
        value={Math.round(value.y)}
        oninput={(e) => onChange({ ...value, y: Number((e.target as HTMLInputElement).value) })}
      />
    </label>
  </div>
</div>
