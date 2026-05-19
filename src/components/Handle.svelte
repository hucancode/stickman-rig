<script lang="ts">
  import type { Point } from '../lib/rig';

  type Shape = 'square' | 'circle' | 'diamond' | 'target';

  interface Props {
    id: string;
    pt: Point;
    label: string;
    color?: string;
    shape?: Shape;
    dragging: boolean;
    onPointerDown: (id: string, e: PointerEvent) => void;
  }

  let { id, pt, label, color = '#3b82f6', shape = 'circle', dragging, onPointerDown }: Props = $props();
</script>

<g
  transform={`translate(${pt.x}, ${pt.y})`}
  style:cursor={dragging ? 'grabbing' : 'grab'}
  onpointerdown={(e) => onPointerDown(id, e)}
  class="group relative"
  role="button"
  tabindex="0"
  aria-label={label}
>
  <circle r={25} fill="transparent" />

  {#if shape === 'circle'}
    <g>
      <circle r={dragging ? 7 : 5} fill="none" stroke={color} stroke-width={dragging ? 2 : 1.5} stroke-dasharray={dragging ? 'none' : '2 2'} />
      <circle r={2} fill={color} />
    </g>
  {:else if shape === 'square'}
    <g>
      <rect x={-5} y={-5} width={10} height={10} fill="none" stroke={color} stroke-width={dragging ? 2 : 1.5} stroke-dasharray={dragging ? 'none' : '2 2'} rx={1} />
      <rect x={-2} y={-2} width={4} height={4} fill={color} rx={0.5} />
    </g>
  {:else if shape === 'diamond'}
    <g>
      <polygon points="0,-7 7,0 0,7 -7,0" fill="none" stroke={color} stroke-width={dragging ? 2 : 1.5} stroke-dasharray={dragging ? 'none' : '2 2'} />
      <polygon points="0,-2 2,0 0,2 -2,0" fill={color} />
    </g>
  {:else if shape === 'target'}
    <g>
      <circle r={7} fill="none" stroke={color} stroke-width={dragging ? 2 : 1.5} />
      <line x1={-12} y1={0} x2={12} y2={0} stroke={color} stroke-width={1} opacity={0.6} />
      <line x1={0} y1={-12} x2={0} y2={12} stroke={color} stroke-width={1} opacity={0.6} />
      <circle r={2} fill={color} />
    </g>
  {/if}

  <g class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
    <rect x={12} y={-10} width={label.length * 6 + 16} height={20} fill="#1e293b" rx={4} stroke={color} stroke-width={1} />
    <text x={20} y={4} fill="#f8fafc" font-size={11} font-family="sans-serif" font-weight="500">{label}</text>
  </g>
</g>
