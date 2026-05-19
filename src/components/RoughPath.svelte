<script lang="ts">
  import { roughPathPaths } from '../lib/rough-util';

  interface Props {
    d: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'miter' | 'round' | 'bevel';
    roughness?: number;
    bowing?: number;
  }

  let {
    d,
    fill = 'none',
    stroke = 'currentColor',
    strokeWidth = 1,
    strokeLinecap,
    strokeLinejoin,
    roughness = 1.5,
    bowing = 1,
  }: Props = $props();

  const paths = $derived(roughPathPaths({ d, fill, stroke, strokeWidth, roughness, bowing }));
</script>

{#each paths as p, i (i)}
  <path
    d={p.d}
    fill={p.fill === 'currentColor' ? 'currentColor' : (p.fill || 'none')}
    {stroke}
    stroke-width={p.strokeWidth || strokeWidth}
    stroke-linecap={strokeLinecap}
    stroke-linejoin={strokeLinejoin}
  />
{/each}
