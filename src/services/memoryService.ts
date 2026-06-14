import { MOCK_MEMORIES } from '../mock-data/memories';
import { MemoryItem, MemoryType } from '../types';

export const memoryService = {
  getMemories: async (): Promise<MemoryItem[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_MEMORIES;
  },

  searchMemories: async (
    query: string,
    types: MemoryType[],
    sources?: string[]
  ): Promise<MemoryItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    let results = MOCK_MEMORIES;

    if (query.trim() !== '') {
      const q = query.toLowerCase();
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q) ||
          m.provenance.author.toLowerCase().includes(q) ||
          (m.provenance.raw_content && m.provenance.raw_content.toLowerCase().includes(q))
      );
    }

    if (types.length > 0) {
      results = results.filter((m) => types.includes(m.type));
    }

    if (sources && sources.length > 0) {
      results = results.filter((m) => sources.includes(m.provenance.source));
    }

    return results;
  },

  getMemoryById: async (id: string): Promise<{
    item: MemoryItem | null;
    relatedItems: MemoryItem[];
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const item = MOCK_MEMORIES.find((m) => m.id === id) || null;
    if (!item) return { item: null, relatedItems: [] };

    const relatedIds: string[] = [];

    // Resolve specific linkages
    if (item.type === 'Decision' && item.decisionDetails) {
      relatedIds.push(...(item.decisionDetails.blockerIds || []));
      relatedIds.push(...(item.decisionDetails.metricIds || []));
      
      // Also find commitments that link to this decision
      const linkedCommitments = MOCK_MEMORIES.filter(
        (m) => m.type === 'Commitment' && m.commitmentDetails?.decisionId === item.id
      ).map((m) => m.id);
      relatedIds.push(...linkedCommitments);
    } else if (item.type === 'Commitment' && item.commitmentDetails?.decisionId) {
      relatedIds.push(item.commitmentDetails.decisionId);
    } else if (item.type === 'Blocker') {
      // Find decisions that link to this blocker
      const linkedDecisions = MOCK_MEMORIES.filter(
        (m) => m.type === 'Decision' && m.decisionDetails?.blockerIds.includes(item.id)
      ).map((m) => m.id);
      relatedIds.push(...linkedDecisions);
    } else if (item.type === 'Metric') {
      // Find decisions that link to this metric
      const linkedDecisions = MOCK_MEMORIES.filter(
        (m) => m.type === 'Decision' && m.decisionDetails?.metricIds.includes(item.id)
      ).map((m) => m.id);
      relatedIds.push(...linkedDecisions);
    }

    const relatedItems = MOCK_MEMORIES.filter((m) => relatedIds.includes(m.id));
    return { item, relatedItems };
  },

  getMemoryGraph: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // We will generate the React Flow nodes and edges dynamically based on linked items
    const nodes: any[] = [];
    const edges: any[] = [];

    // Filter relevant nodes to keep the graph comprehensible but structured
    // Let's build nodes from our core pairs (Cognito delay, Pricing update, AWS EC2 migration, Mobile policy release, Auto Sandbox provisioning)
    // We only show items that are connected to make a stunning visual presentation.
    const connectedTypes = ['Blocker', 'Decision', 'Metric', 'Commitment'];
    
    // We'll focus the graph on the 25 most critical related items to keep it clean and performant
    const coreIds = new Set<string>([
      'blocker-1', 'metric-1', 'decision-1', 'commitment-1', 'commitment-2',
      'blocker-2', 'metric-2', 'decision-2', 'commitment-3',
      'blocker-3', 'metric-3', 'decision-3', 'commitment-4',
      'blocker-4', 'metric-4', 'decision-5', 'commitment-5', 'commitment-6',
      'blocker-5', 'metric-5', 'decision-6', 'commitment-7',
      'mem-18', 'mem-25', 'mem-26', 'mem-34', 'mem-35'
    ]);

    const activeItems = MOCK_MEMORIES.filter((m) => coreIds.has(m.id));

    // Position layouts (we'll arrange them in columns based on type: Blocker (x=100) -> Decision (x=400) -> Metric (x=700) -> Commitment (x=1000))
    // Or we arrange them vertically by story blocks:
    // Story 1: Staging Auth (y=50)
    // Story 2: Pricing seat structure (y=250)
    // Story 3: AWS dev bottleneck (y=450)
    // Story 4: App store guidelines rejection (y=650)
    // Story 5: TrustClaw sandbox provisioning (y=850)
    
    const getCoordinates = (item: MemoryItem) => {
      let x = 250;
      let y = 100;

      // Assign Y offsets based on story tracks to group them logically
      let trackY = 100;
      if (['blocker-1', 'metric-1', 'decision-1', 'commitment-1', 'commitment-2'].includes(item.id)) {
        trackY = 100;
      } else if (['blocker-2', 'metric-2', 'decision-2', 'commitment-3'].includes(item.id)) {
        trackY = 320;
      } else if (['blocker-3', 'metric-3', 'decision-3', 'commitment-4'].includes(item.id)) {
        trackY = 540;
      } else if (['blocker-4', 'metric-4', 'decision-5', 'commitment-5', 'commitment-6'].includes(item.id)) {
        trackY = 760;
      } else if (['blocker-5', 'metric-5', 'decision-6', 'commitment-7'].includes(item.id)) {
        trackY = 980;
      } else if (['mem-18', 'mem-25', 'mem-26', 'mem-34', 'mem-35'].includes(item.id)) {
        trackY = 1200;
      }

      // Assign X columns: Blocker (x=100) -> Decision (x=450) -> Metric (x=800) -> Commitment (x=1150)
      if (item.type === 'Blocker') {
        x = 50;
        y = trackY;
      } else if (item.type === 'Decision') {
        x = 400;
        y = trackY;
      } else if (item.type === 'Metric') {
        x = 750;
        y = trackY;
      } else if (item.type === 'Commitment') {
        x = 1100;
        // If there are multiple commitments in a track, stack them slightly
        if (item.id === 'commitment-2') y = trackY + 80;
        else if (item.id === 'commitment-6') y = trackY + 80;
        else if (item.id === 'mem-35') y = trackY + 80;
        else y = trackY;
      }

      return { x, y };
    };

    activeItems.forEach((item) => {
      const { x, y } = getCoordinates(item);
      nodes.push({
        id: item.id,
        type: 'memoryNode',
        position: { x, y },
        data: {
          id: item.id,
          type: item.type,
          title: item.title,
          source: item.provenance.source,
          timestamp: item.timestamp,
          status: item.blockerDetails?.status || item.commitmentDetails?.status || 'Active'
        }
      });

      // Draw Edges based on Relationships:
      // 1. Decision -> Blocker(s)
      if (item.type === 'Decision' && item.decisionDetails) {
        item.decisionDetails.blockerIds.forEach((bId) => {
          if (coreIds.has(bId)) {
            edges.push({
              id: `edge-${bId}-${item.id}`,
              source: bId,
              target: item.id,
              animated: true,
              style: { stroke: '#fb7185', strokeWidth: 2 } // Red for blocker relations
            });
          }
        });

        // 2. Decision -> Metric(s)
        item.decisionDetails.metricIds.forEach((mId) => {
          if (coreIds.has(mId)) {
            edges.push({
              id: `edge-${item.id}-${mId}`,
              source: item.id,
              target: mId,
              animated: true,
              style: { stroke: '#fbbf24', strokeWidth: 2 } // Amber for metric updates
            });
          }
        });
      }

      // 3. Commitment -> Decision
      if (item.type === 'Commitment' && item.commitmentDetails?.decisionId) {
        const dId = item.commitmentDetails.decisionId;
        if (coreIds.has(dId)) {
          edges.push({
            id: `edge-${dId}-${item.id}`,
            source: dId,
            target: item.id,
            animated: true,
            style: { stroke: '#34d399', strokeWidth: 2 } // Emerald for action/commitments
          });
        }
      }
    });

    return { nodes, edges };
  }
};
