<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<div class="space-y-4">
  <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
  <div class="space-y-3">
    {@render children()}
  </div>
</div>
