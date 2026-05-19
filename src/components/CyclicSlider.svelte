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

  let trackEl: HTMLDivElement;
  let dragging = $state(false);
  let dragState: { startX: number; startValue: number; width: number } | null = null;

  const range = $derived(max - min);

  function wrap(v: number): number {
    const r = ((v - min) % range + range) % range;
    return r + min;
  }

  function quantize(v: number): number {
    return Math.round(v / step) * step;
  }

  const displayValue = $derived(wrap(value));
  const fraction = $derived((displayValue - min) / range);

  function onPointerDown(e: PointerEvent) {
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const initial = quantize(wrap(min + f * range));
    dragState = { startX: e.clientX, startValue: initial, width: rect.width };
    dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onChange(initial);
    e.preventDefault();
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragState) return;
    const dx = e.clientX - dragState.startX;
    const delta = (dx / dragState.width) * range;
    const next = quantize(wrap(dragState.startValue + delta));
    onChange(next);
  }

  function onPointerUp(e: PointerEvent) {
    dragState = null;
    dragging = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    const dir = e.deltaY > 0 ? -1 : 1;
    onChange(quantize(wrap(value + dir * step)));
  }
</script>

<div class="flex flex-col gap-1.5">
  <div class="flex justify-between items-center text-sm">
    <span class="text-slate-300">{label}</span>
    <span class="text-slate-500 tabular-nums text-xs">{displayValue.toFixed(step < 1 ? 2 : 0)}</span>
  </div>
  <div
    bind:this={trackEl}
    role="slider"
    tabindex="0"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={displayValue}
    aria-label={label}
    class="relative h-2 bg-slate-800 rounded-lg cursor-pointer select-none touch-none"
    class:ring-2={dragging}
    class:ring-blue-500={dragging}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    onwheel={onWheel}
  >
    <div class="absolute inset-y-0 left-0 bg-blue-500/30 rounded-lg pointer-events-none" style="width: {fraction * 100}%"></div>
    <div
      class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 shadow pointer-events-none"
      style="left: {fraction * 100}%"
    ></div>
  </div>
</div>
