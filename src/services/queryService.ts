import { MOCK_MEMORIES } from '../mock-data/memories';
import { MemoryItem } from '../types';

export interface AnswerPayload {
  answer: string;
  sources: MemoryItem[];
  relatedMemories: MemoryItem[];
  suggestedQuestions: string[];
}

export const queryService = {
  askQuestion: async (query: string): Promise<AnswerPayload> => {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate thinking latency
    const q = query.toLowerCase();

    // Answer 1: Launch delay / Cognito auth failure
    if (q.includes('delay') || q.includes('launch') || q.includes('postpone')) {
      const decisionNode = MOCK_MEMORIES.find((m) => m.id === 'decision-1')!;
      const blockerNode = MOCK_MEMORIES.find((m) => m.id === 'blocker-1')!;
      const metricNode = MOCK_MEMORIES.find((m) => m.id === 'metric-1')!;
      const commitments = MOCK_MEMORIES.filter((m) => ['commitment-1', 'commitment-2'].includes(m.id));

      return {
        answer: `We delayed our public beta launch from **June 12** to **June 19, 2026** (a one-week postponement) because of a critical integration failure with **AWS Cognito** in our staging environment.

### Supporting Details:
1. **The Root Blocker:** The Cognito authentication client wrapper is trapping users in redirect loops upon successful authorization, resulting in a **502 Bad Gateway** error. This completely blocked QA checks.
2. **Impact on Metrics:** Due to sign-up timeouts in user staging trials, the **Beta Sign-up Conversion Rate** crashed by **50%** (slipping from 24% to 12%).
3. **Corrective Commitments:**
   - **Alex Rivera (Tech Lead)** successfully drafted and deployed a Cognito credentials hotfix wrapper to staging.
   - **Sarah Jenkins (CEO)** drafted and dispatched the timeline adjustment explanation update email to lead investor **Ardent Ventures** on June 11.`,
        sources: [decisionNode, blockerNode, metricNode],
        relatedMemories: commitments,
        suggestedQuestions: [
          'What is the status of the Cognito auth hotfix?',
          'How did Ardent Ventures react to the delay update?',
          'What is the current beta conversion rate?'
        ]
      };
    }

    // Answer 2: Blockers
    if (q.includes('blocker') || q.includes('obstacle') || q.includes('stuck') || q.includes('open issues')) {
      const openBlockers = MOCK_MEMORIES.filter((m) => m.type === 'Blocker' && m.blockerDetails?.status === 'Open');
      
      return {
        answer: `There are currently **${openBlockers.length} open operational blockers** in FounderOps AI:

1. **Cognito Auth Redirect loops in Staging (\`LIN-9021\` - High Severity):** Blocking final marketing team QA on client onboarding flows.
2. **Manual TrustClaw sandbox provisioning pipeline bottlenecks (High Severity):** Creating an onboarding queue exceeding **48 hours** for 42 pending sign-ups.
3. **Composio integration tokens expiration (High Severity):** Notion connectors require repeated authorization under concurrent requests.
4. **Gmail API polling limits reached (Medium Severity):** Ingestion loops hit Google limits of 250 requests/min.
5. **Slack app store listing review verification rejection (Medium Severity):** Awaiting a sandboxing demonstration recording.
6. **SOC2 vendor legal compliance review delays (Medium Severity):** Core contracts are stuck awaiting partner legal counsel signatures.
7. **Gmail attachments exceeding 20MB extraction limits (Low Severity):** Large board report indexers are crashing background mail pipelines.`,
        sources: openBlockers.slice(0, 4),
        relatedMemories: MOCK_MEMORIES.filter((m) => ['decision-1', 'decision-6', 'commitment-7'].includes(m.id)),
        suggestedQuestions: [
          'How can we resolve the sandbox onboarding bottleneck?',
          'Who is responsible for the SOC2 legal contract reviews?',
          'What is the timeline to resubmit the Slack app listing?'
        ]
      };
    }

    // Answer 3: Commitments
    if (q.includes('commitment') || q.includes('overdue') || q.includes('todo') || q.includes('promise')) {
      const openCommitments = MOCK_MEMORIES.filter(
        (m) => m.type === 'Commitment' && m.commitmentDetails?.status !== 'Fulfilled'
      );
      
      return {
        answer: `There are currently **${openCommitments.length} active commitments** awaiting resolution. Among these, some are critical priorities:

1. **Deploy Stripe-to-TrustClaw sandbox provisioning API webhook**
   - **Owner:** Alex Rivera
   - **Status:** **Open (Due Today)**
   - **Context:** Automates secure environment registration to clear the 42-user onboarding queue.

2. **Draft contract brief for Upwork compliance copywriter**
   - **Owner:** Sarah Jenkins
   - **Status:** **Open (Overdue)**
   - **Context:** Hire an external copywriter to draft standard security manuals and unblock Vanta reviews.

3. **Provision read-only AWS IAM role credentials for Vanta audits**
   - **Owner:** Marcus Chen
   - **Status:** **Open (Due tomorrow)**
   - **Context:** Connect compliance tooling direct to cloud configuration console logs.`,
        sources: openCommitments.slice(0, 3),
        relatedMemories: MOCK_MEMORIES.filter((m) => ['decision-6', 'decision-8', 'mem-34'].includes(m.id)),
        suggestedQuestions: [
          'Is Alex Rivera working on the sandbox webhook right now?',
          'Did we hire the compliance writer yet?',
          'What is the deadline for the AWS IAM configuration?'
        ]
      };
    }

    // Answer 4: Pricing / Revenue / Stripe
    if (q.includes('price') || q.includes('pricing') || q.includes('stripe') || q.includes('revenue') || q.includes('mrr')) {
      const decisionNode = MOCK_MEMORIES.find((m) => m.id === 'decision-2')!;
      const metricNode = MOCK_MEMORIES.find((m) => m.id === 'metric-2')!;
      const churnBlocker = MOCK_MEMORIES.find((m) => m.id === 'blocker-2')!;

      return {
        answer: `We transitioned the **FounderOps Pro Plan** to a **$49 per-seat monthly billing structure** (away from flat monthly billing codes) and prioritized the development of **self-serve CSV/PDF export formats**.

### Background and Context:
* **The Opportunity:** Initial sales reports indicated our **Average Contract Value (ACV)** spiked by **50%** (growing from $1,200 to $1,800), suggesting enterprise buyers value seat scalability.
* **The Blocker:** Three critical startup trial accounts threatened cancellation due to missing compliance export tools, which we resolved by implementing standard markdown/PDF export blocks in Sprint 14.
* **Outcome:** Following the shift to seat-based parameters and the export fix, **Customer Churn dropped to 1.8%** (down from 3.5%), and total **MRR climbed to $10,500** (+25%).`,
        sources: [decisionNode, metricNode, churnBlocker],
        relatedMemories: MOCK_MEMORIES.filter((m) => ['commitment-3', 'metric-5', 'metric-13'].includes(m.id)),
        suggestedQuestions: [
          'What is our current monthly churn rate?',
          'Are there any other billing errors in Stripe?',
          'Do users require custom enterprise pricing options?'
        ]
      };
    }

    // Default Fallback Response
    return {
      answer: `Welcome to **FounderOps Decision Intelligence**. I have compiled your workspace activity history across Gmail, Slack, Linear, Notion, Calendar, and Stripe into **${MOCK_MEMORIES.length} structured memory items** (comprising Decisions, Blockers, Metrics, and Commitments).

Here is a summary of the current operational state:
* **Operational Health Score:** **89%** (up from 62% during our Cognito staging bottleneck on June 10).
* **Launch Date:** Shifted to **June 19, 2026** (to verify staging Cognito authentication patches).
* **Open Tasks:** ${MOCK_MEMORIES.filter(m => m.type === 'Commitment' && m.commitmentDetails?.status === 'Open').length} pending action items, primarily sandbox webhooks and compliance onboarding tasks.
* **Key Growth:** MRR reached **$10,500** (+25% MoM), driven by seat upgrades.

What would you like to review in detail?`,
      sources: MOCK_MEMORIES.slice(0, 3),
      relatedMemories: MOCK_MEMORIES.filter((m) => ['decision-1', 'decision-6', 'blocker-1'].includes(m.id)),
      suggestedQuestions: [
        'Why did we delay the public beta launch?',
        'What blockers are currently open?',
        'Tell me about our recent pricing changes and MRR trends'
      ]
    };
  }
};
