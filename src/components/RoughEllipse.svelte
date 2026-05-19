<script lang="ts">
  import { roughEllipsePaths } from '../lib/rough-util';

  interface Props {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    roughness?: number;
    bowing?: number;
  }

  let { cx, cy, rx, ry, fill = 'none', stroke = 'currentColor', strokeWidth = 1, roughness = 1.5, bowing = 1 }: Props = $props();

  const paths = $derived(roughEllipsePaths({ cx, cy, rx, ry, fill, stroke, strokeWidth, roughness, bowing }));
</script>

{#each paths as p, i (i)}
  <path
    d={p.d}
    fill={p.fill === 'currentColor' ? 'currentColor' : (p.fill || 'none')}
    {stroke}
    stroke-width={p.strokeWidth || strokeWidth}
  />
{/each}
