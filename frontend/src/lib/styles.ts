// className ทั้งหมดของ UI — component เหลือแต่ logic กับโครง JSX

/**
 * ค่าสีอ้างผ่าน token ที่นิยามใน src/index.css (@theme) เท่านั้น
 * ห้ามใส่ hex ตรง ๆ ในไฟล์นี้
 */

export const app = {
  root: 'min-h-screen bg-page text-ink-body',
} as const

export const navbar = {
  header: 'sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur',
  bar: 'flex h-14 items-center gap-6 px-4 sm:px-6',

  brandGroup: 'flex shrink-0 items-center gap-2.5',
  logoSlot:
    'grid size-8 place-items-center rounded-lg border border-dashed border-brand-border text-[9px] leading-none text-ink-muted',
  brandName: 'text-base font-semibold tracking-tight text-ink',

  nav: 'min-w-0 flex-1 overflow-x-auto',
  list: 'flex items-center gap-1',
  item: {
    base: 'whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors',
    active: 'bg-brand-soft font-medium text-brand',
    idle: 'text-ink-body hover:bg-subtle hover:text-ink',
  },

  userGroup: 'flex shrink-0 items-center gap-2.5',
  userText: 'hidden text-right leading-tight sm:block',
  userName: 'text-sm text-ink',
  userRole: 'text-xs text-ink-muted',
  avatar:
    'grid size-8 place-items-center rounded-full bg-brand-soft text-xs font-medium text-brand',
} as const

export const pageShell = {
  header: 'border-b border-line bg-surface px-6 py-3',
  title: 'text-base font-semibold text-ink',
  description: 'text-sm text-ink-muted',
  main: 'p-6',
  placeholder:
    'grid place-items-center rounded-xl border border-dashed border-brand-border bg-surface p-16 text-sm text-ink-muted',
} as const

export const statCard = {
  card: 'rounded-xl border border-line bg-surface px-4 py-3 shadow-sm',
  label: 'text-xs text-ink-muted',
  value: 'mt-1 text-2xl font-semibold tabular-nums text-ink',
  valueAlert: 'mt-1 text-2xl font-semibold tabular-nums text-alert',
  unit: 'ml-1 text-sm font-normal text-ink-muted',
  caption: 'mt-1 text-xs text-ink-muted',
  captionAlert: 'mt-1 text-xs text-alert',
} as const

export const kpiRow = {
  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4',
} as const

export const dateStepper = {
  wrap: 'flex items-center gap-2',
  arrow:
    'grid size-8 place-items-center rounded-lg border border-line bg-surface text-ink-muted transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink-muted',
  arrowIcon: 'block size-4',
  chip: 'flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5',
  chipIcon: 'block size-4 text-ink-muted',
  chipText: 'text-sm text-ink',
} as const

export const stationDefectChart = {
  list: 'space-y-1',
  row: 'grid w-full grid-cols-[9rem_1fr_3.5rem] items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm',
  rowSelected:
    'grid w-full grid-cols-[9rem_1fr_3.5rem] items-center gap-3 rounded-lg bg-brand-soft px-2 py-1.5 text-left text-sm',
  order: 'mr-2 text-xs text-ink-muted tabular-nums',
  name: 'truncate text-ink',
  track: 'block h-2.5 w-full overflow-hidden rounded-full bg-subtle',
  bar: 'block h-full rounded-full bg-brand',
  barAlert: 'block h-full rounded-full bg-alert',
  value: 'text-right text-ink tabular-nums',
  valueAlert: 'text-right font-medium text-alert tabular-nums',
  legend: 'mt-4 flex items-center gap-2 text-xs text-ink-muted',
  legendDot: 'inline-block size-2 rounded-full bg-alert',
} as const

export const defectTypeDonut = {
  wrap: 'flex items-center gap-4',
  chart: 'h-36 w-36 shrink-0',
  legend: 'min-w-0 flex-1 space-y-1.5',
  legendRow: 'flex items-baseline gap-2 text-sm',
  legendDot: 'size-2.5 shrink-0 translate-y-0.5 rounded-full',
  legendValue: 'font-semibold text-ink tabular-nums',
  legendName: 'truncate text-ink-muted',
} as const

export const defectRatioGauge = {
  wrap: 'flex items-center gap-4',
  chart: 'relative h-36 w-36 shrink-0',
  center: 'pointer-events-none absolute inset-0 flex flex-col items-center justify-center',
  centerValue: 'text-xl font-semibold text-ink tabular-nums',
  centerValueAlert: 'text-xl font-semibold text-alert tabular-nums',
  centerTotal: 'text-xs text-ink-muted tabular-nums',
  legend: 'min-w-0 flex-1 space-y-1.5',
  legendRow: 'flex items-center gap-2 text-sm',
  legendDot: 'size-2.5 shrink-0 rounded-full',
  legendText: 'text-ink-muted',
} as const

export const stationRail = {
  wrap: 'sticky top-14 h-fit overflow-hidden rounded-xl border border-line bg-surface shadow-sm',
  header: 'border-b border-line bg-subtle px-3 py-2 text-xs font-medium text-ink-muted',
  list: 'max-h-[28rem] overflow-y-auto p-1',
  row: 'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-ink transition-colors hover:bg-subtle',
  rowSelected:
    'flex w-full items-center gap-2 rounded-lg bg-brand-soft px-2 py-1.5 text-left text-sm font-medium text-brand',
  rowAlert:
    'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-alert transition-colors hover:bg-alert-soft',
  rowAlertSelected:
    'flex w-full items-center gap-2 rounded-lg bg-alert-soft px-2 py-1.5 text-left text-sm font-medium text-alert',
  dot: 'size-2 shrink-0 rounded-full bg-brand-border',
  dotAlert: 'size-2 shrink-0 rounded-full bg-alert',
  order: 'text-xs text-ink-muted tabular-nums',
  name: 'min-w-0 flex-1 truncate',
  value: 'text-xs text-ink-muted tabular-nums',
  valueAlert: 'text-xs font-medium text-alert tabular-nums',
  empty: 'px-2 py-3 text-center text-xs text-ink-muted',
} as const

export const cycleTimeChart = {
  box: 'h-56',
  caption: 'mt-2 text-xs text-ink-muted',
  captionDot: 'mr-1.5 inline-block size-2 rounded-full bg-alert',
} as const

export const defectEventList = {
  list: 'space-y-2',
  row: 'flex items-center gap-2 rounded-lg bg-alert-soft px-3 py-2 text-sm',
  badge:
    'shrink-0 rounded-full bg-alert px-2 py-0.5 text-[10px] font-semibold leading-tight text-surface',
  text: 'min-w-0 flex-1 truncate text-alert',
  confidence: 'shrink-0 font-medium text-alert tabular-nums',
  empty: 'rounded-lg bg-subtle px-3 py-6 text-center text-sm text-ink-muted',
} as const

export const dashboard = {
  main: 'grid gap-6 p-6 lg:grid-cols-[1fr_260px]',
  content: 'min-w-0 space-y-6',
  toolbar: 'flex items-center justify-between gap-4',
  stationChip:
    'rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-surface',
  stationGrid: 'grid gap-6 lg:grid-cols-[2fr_1fr]',
  waitingPanel:
    'grid place-items-center rounded-xl border border-dashed border-brand-border bg-surface p-12 text-center text-sm text-ink-muted',
  panelGrid: 'grid gap-6 lg:grid-cols-[2fr_1fr]',
  sideColumn: 'space-y-6',
  panel: 'rounded-xl border border-line bg-surface p-4 shadow-sm',
  panelTitle: 'mb-4 text-sm font-medium text-ink',
  errorBanner: 'rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700',
  skeletonKpi: 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4',
  skeletonCard: 'h-20 animate-pulse rounded-xl border border-line bg-surface',
  skeletonPanels: 'grid gap-6 lg:grid-cols-[2fr_1fr]',
  skeletonPanelTall: 'h-80 animate-pulse rounded-xl border border-line bg-surface',
} as const

export const cameraFeed = {
  image: 'w-full bg-subtle object-cover',
  placeholder:
    'flex w-full flex-col items-center justify-center gap-1 bg-subtle text-sm text-ink-muted',
  placeholderHint: 'text-xs',
} as const

export const cameraTile = {
  button:
    'group block w-full overflow-hidden rounded-xl border border-line bg-surface text-left shadow-sm transition-colors hover:border-brand-border',
  feed: 'aspect-video',
  caption: 'flex items-baseline justify-between gap-2 px-4 py-2',
  name: 'text-sm font-medium text-ink group-hover:text-brand',
  location: 'text-xs text-ink-muted',
} as const

export const cameraPage = {
  header: 'flex items-center gap-4 border-b border-line bg-surface px-6 py-3',
  back: 'rounded-lg px-2 py-1 text-sm text-ink-muted transition-colors hover:bg-subtle hover:text-brand',
  title: 'text-base font-semibold text-ink',
  meta: 'text-sm text-ink-muted',
  errorBanner: 'border-b border-rose-200 bg-rose-50 px-6 py-2 text-sm text-rose-700',
  main: 'grid gap-6 p-6 lg:grid-cols-[2fr_1fr]',
  column: 'space-y-6',
  feedFrame: 'overflow-hidden rounded-xl border border-line bg-surface shadow-sm',
  feedHeader: 'flex items-center justify-between border-b border-line px-4 py-2 text-sm',
  feedSource: 'text-ink',
  feedFps: 'text-ink-muted tabular-nums',
  feedImage: 'aspect-video',
  statGrid: 'grid grid-cols-3 gap-4',
  panel: 'rounded-xl border border-line bg-surface p-4 shadow-sm',
  panelTitle: 'mb-3 text-sm font-medium text-ink',
} as const

export const monitor = {
  grid: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
} as const

export const emptyState = {
  box: 'flex flex-col items-center gap-2 rounded-xl border border-dashed border-brand-border bg-surface px-6 py-14 text-center',
  icon: 'mb-1 size-10 text-brand-border',
  title: 'text-sm font-medium text-ink',
  description: 'max-w-sm text-sm text-ink-muted',
  action:
    'mt-3 rounded-lg bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-surface',
} as const

export const detectionTable = {
  empty: 'text-sm text-ink-muted',
  table: 'w-full text-left text-sm',
  headRow: 'text-xs uppercase text-ink-muted',
  th: 'pb-2 font-medium',
  thRight: 'pb-2 text-right font-medium',
  body: 'divide-y divide-line',
  row: 'text-ink-body',
  td: 'py-1.5',
  tdRight: 'py-1.5 text-right tabular-nums',
  tdBbox: 'py-1.5 text-right font-mono text-xs text-ink-muted',
} as const

export const chartBox = 'h-40'

export const emptyHint = 'text-sm text-ink-muted'
