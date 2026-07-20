export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="pbar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="small muted" style={{ marginTop: 4 }}>
        {value}/{total} séances · {pct}%
      </div>
    </div>
  )
}
