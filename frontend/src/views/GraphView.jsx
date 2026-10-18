import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function GraphView() {
  const previewPatterns = [
    { name: 'Arrays & Hashing', score: 8, status: 'Stable', category: 'Foundation' },
    { name: 'Two Pointers', score: 4, status: 'Needs Revision', category: 'Linear Scan' },
    { name: 'Sliding Window', score: 0, status: 'Unpracticed', category: 'Subarrays' },
    { name: 'Binary Search', score: 7, status: 'Stable', category: 'Divide & Conquer' },
    { name: 'Recursion & Backtracking', score: 6, status: 'Needs Revision', category: 'State Space' },
    { name: 'Tree Traversal', score: 0, status: 'Unpracticed', category: 'Hierarchical' },
    { name: 'Graph Algorithms', score: 0, status: 'Unpracticed', category: 'Networks' },
    { name: 'Dynamic Programming', score: 2, status: 'Needs Revision', category: 'Optimization' },
  ]

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Top Banner Card */}
      <Card className="p-6 bg-gradient-to-r from-white via-white to-[#FAF7F2]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-[#1C1C1C]">
                Memory Graph Canvas
              </h2>
              <Badge variant="mint" size="xs">
                Shell Active
              </Badge>
              <Badge variant="sage" size="xs">
                Step 1 Complete
              </Badge>
            </div>
            <p className="text-sm text-[#5C4033]">
              Visual DSA concept hierarchy powered by FalkorDB Cloud graph relations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">
              8 Concepts Ready
            </Badge>
            <Badge variant="neutral" size="sm">
              6 Dependency Edges
            </Badge>
          </div>
        </div>
      </Card>

      {/* Main Graph Canvas Canvas Shell */}
      <div className="flex-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl relative overflow-hidden flex flex-col p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#98D8B0]" />
            <span className="text-xs font-semibold text-[#5C4033] uppercase tracking-wider">
              Pattern Dependency Topology
            </span>
          </div>
          <span className="text-xs text-[#8C7E72]">
            Ready for Step 2 Canvas Rendering
          </span>
        </div>

        {/* Pattern Concept Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {previewPatterns.map((pattern) => (
            <Card
              key={pattern.name}
              hover
              className="p-4 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#8C7E72] uppercase tracking-wide">
                    {pattern.category}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#1C1C1C] text-white">
                    {pattern.score} / 10
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#1C1C1C]">
                  {pattern.name}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E2D8]/70 flex items-center justify-between">
                <Badge
                  variant={
                    pattern.status === 'Stable'
                      ? 'mint'
                      : pattern.status === 'Needs Revision'
                        ? 'terracotta'
                        : 'neutral'
                  }
                  size="xs"
                  dot
                >
                  {pattern.status}
                </Badge>
                <span className="text-[11px] text-[#8C7E72]">
                  {pattern.score > 0 ? 'Practiced' : 'Pending'}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Informative Step 2 Connection Footer */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-xs text-[#8C7E72]">
            <span className="font-semibold text-[#5C4033]">Next Step:</span> Interactive SVG connector edges and Concept Inspector panel will be wired up via <code className="px-1.5 py-0.5 rounded bg-white border border-[#E8E2D8] text-[#1C1C1C] font-mono text-[11px]">f-doc/step-02-graph-patterns.md</code>.
          </p>
        </div>
      </div>
    </div>
  )
}
