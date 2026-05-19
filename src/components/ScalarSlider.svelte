<script lang="ts">
  interface Props {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (val: number) => void;
  }

  let { label, value, min, max, step = 1, onChange }: Props = $props();

  function handle(e: Event) {
    const next = parseFloat((e.target as HTMLInputElement).value);
    onChange(next);
  }
</script>

<div class="flex flex-col gap-1.5">
  <div class="flex justify-between items-center text-sm">
    <span class="text-slate-300">{label}</span>
    <span class="text-slate-500 tabular-nums text-xs">{value.toFixed(step < 1 ? 2 : 0)}</span>
  </div>
  <input
    type="range"
    aria-label={label}
    {min}
    {max}
    {step}
    {value}
    oninput={handle}
    class="w-full accent-blue-500 bg-slate-800 rounded-lg outline-none cursor-pointer h-2 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
  />
</div>
