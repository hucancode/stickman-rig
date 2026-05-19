<script lang="ts">
  interface Props {
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
  }

  let { label, checked, onChange }: Props = $props();
</script>

<label class="flex items-center justify-between cursor-pointer group">
  <span class="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">{label}</span>
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onclick={() => onChange(!checked)}
    class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 {checked ? 'bg-blue-500' : 'bg-slate-700'}"
  >
    <span class="sr-only">Toggle {label}</span>
    <span
      class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out {checked ? 'translate-x-4' : 'translate-x-0'}"
    ></span>
  </button>
</label>
