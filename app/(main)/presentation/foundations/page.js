"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Combine,
  Database,
  Route,
  Ruler,
  ScanText,
  Scissors,
  Search,
  SearchCode,
  Sigma,
  Waypoints,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/algorithms/animated-number";
import {
  PROFILE_VECTOR,
  JOB_VECTOR,
  PROFILE_WORDS,
  JOB_WORDS,
  SEMANTIC_SCORE,
} from "@/components/algorithms/sbert-demo";
import { TARGET_SCORE, InteractionTable } from "@/components/algorithms/ncf-demo";
import { SHUFFLED_JOBS } from "@/components/algorithms/hybrid-demo";
import {
  AngleDiagram,
  AttentionMatrix,
  DotProductWork,
  IconStats,
  MechanismFlow,
  NetworkDiagram,
  ReorderList,
  VectorFingerprint,
  WordWeightPanel,
  cosineSim,
} from "@/components/presentation/mini-charts";

const COSINE = cosineSim(PROFILE_VECTOR, JOB_VECTOR);
const ANGLE_DEG = (Math.acos(Math.min(Math.max(COSINE, -1), 1)) * 180) / Math.PI;

const MECHANISM_STEPS = [
  {
    icon: Scissors,
    title: "1. Tokenize",
    description:
      "The sentence is split into WordPiece subword tokens from BERT's ~30,000-piece vocabulary — e.g. “storefront” → [store, ##front]. [CLS]/[SEP] tokens mark the boundaries.",
  },
  {
    icon: Waypoints,
    title: "2. Self-attention × 6 layers",
    description:
      "Each token's vector is repeatedly updated by attending to every other token in the sentence — a learned softmax(Q·Kᵀ) score decides how much. Six of these layers are stacked; that's the “L6” in the model's name.",
  },
  {
    icon: Combine,
    title: "3. Mean pooling",
    description:
      "All 384-dim token vectors (ignoring padding) are averaged into one fixed-length vector — this is what turns a 5-word or 50-word sentence into the same-sized 384-number embedding.",
  },
  {
    icon: Ruler,
    title: "4. Normalize",
    description:
      "The pooled vector is L2-normalized, so cosine similarity compares pure direction — meaning — rather than being skewed by sentence length.",
  },
];

const ATTENTION_TOKENS = ["customer", "storefront", "components", "design", "backend"];
const ATTENTION_MATRIX = [
  [0.3, 0.2, 0.15, 0.2, 0.15],
  [0.15, 0.25, 0.35, 0.15, 0.1],
  [0.1, 0.3, 0.3, 0.2, 0.1],
  [0.15, 0.15, 0.2, 0.3, 0.2],
  [0.1, 0.1, 0.15, 0.25, 0.4],
];

const REORDER_ITEMS = SHUFFLED_JOBS.map((j) => ({
  id: j.id,
  label: j.title,
  sublabel: j.company,
  value: j.matchScore,
}));

const LATENCY_ROWS = [
  { label: "Brute-force scan", value: 480, unit: "ms", icon: Search, bg: "bg-chart-5/10", color: "text-chart-5" },
  { label: "pgvector ANN index", value: 14, unit: "ms", icon: Route, bg: "bg-chart-4/10", color: "text-chart-4" },
  { label: "Redis cache hit", value: 2, unit: "ms", icon: Zap, bg: "bg-primary/10", color: "text-primary" },
];

const STAGES = [
  {
    key: "nlp",
    subfield: "Natural Language Processing",
    hook: "Turning language into data",
    icon: ScanText,
    accent: "text-chart-1",
    accentBg: "bg-chart-1/10",
    body:
      "A resume skill (“React developer”) and a job requirement (“front-end engineer”) are just strings of text to a computer. Angkop uses the pretrained model all-MiniLM-L6-v2 (Wang et al.'s MiniLM architecture, distilled to 6 transformer layers and fine-tuned by Reimers & Gurevych's Sentence-BERT method) to read every word and fold it into one fixed-length 384-number embedding — without it, the system could only compare strings keyword-by-keyword, exactly the limitation of ordinary job boards.",
    visual: (
      <div>
        <div className="grid gap-6 sm:grid-cols-2">
          <WordWeightPanel title="Your profile — key words SBERT weighs" words={PROFILE_WORDS} accent="text-chart-4" />
          <WordWeightPanel title="Job description — key words SBERT weighs" words={JOB_WORDS} accent="text-chart-1" />
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Each weight above becomes one number in the sentence&rsquo;s
          embedding — shown here as color intensity, 8 of the real 384:
        </p>
        <div className="mt-3 grid gap-6 sm:grid-cols-2">
          <VectorFingerprint vector={PROFILE_VECTOR} colorVar="var(--color-chart-4)" />
          <VectorFingerprint vector={JOB_VECTOR} colorVar="var(--color-chart-1)" />
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            But where do those weights actually come from?
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Nobody hand-writes a rulebook of word weights. Inside
            all-MiniLM-L6-v2, a weight like &ldquo;components = 0.93&rdquo; is
            the end result of four mechanical steps:
          </p>
          <div className="mt-4">
            <MechanismFlow steps={MECHANISM_STEPS} />
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Step 2 is the one doing the real work. For the job posting, this
            is what a (simplified, illustrative) self-attention layer looks
            like for five of its tokens — each row is one token deciding how
            much of every other token to borrow from:
          </p>
          <div className="mt-4 flex justify-center">
            <AttentionMatrix
              tokens={ATTENTION_TOKENS}
              matrix={ATTENTION_MATRIX}
              note="darker cell = row token attends more strongly to that column token"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            &ldquo;components&rdquo; attends most strongly to
            &ldquo;storefront&rdquo; (0.35) — so after six layers of this,
            its vector no longer means &ldquo;generic UI parts,&rdquo; it
            means &ldquo;the UI parts of an e-commerce storefront,&rdquo;
            which is exactly why it lands close to &ldquo;React
            components&rdquo; on the profile side. The illustrative weight
            shown above each word approximates how much that token&rsquo;s
            final, attention-refined vector ends up contributing once
            everything is mean-pooled in Step 3.
          </p>
        </div>
      </div>
    ),
    caption: "“frontend” and “components” score high on both sides — that shared meaning is what keyword search would miss entirely",
  },
  {
    key: "linear-algebra",
    subfield: "Linear Algebra",
    hook: "Measuring “meaning distance” mathematically",
    icon: Sigma,
    accent: "text-chart-2",
    accentBg: "bg-chart-2/10",
    body:
      "Once skills and job descriptions are embeddings — points in a 384-dimensional vector space — comparing meaning becomes a geometry problem. Cosine similarity measures the angle between two vectors regardless of magnitude: multiply each matching pair of numbers, add them up, then divide by the vectors' lengths. A direct, textbook application of vector spaces and dot products.",
    visual: (
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
        <div>
          <AngleDiagram angleDeg={ANGLE_DEG} nameA="Profile" nameB="Job" />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            <span className="text-xl font-semibold text-foreground">
              <AnimatedNumber value={SEMANTIC_SCORE} duration={0.8} />%
            </span>{" "}
            similar
          </p>
        </div>
        <DotProductWork profileWords={PROFILE_WORDS} jobWords={JOB_WORDS} />
      </div>
    ),
    caption: "the same 8 weights from above, multiplied pair by pair and summed",
  },
  {
    key: "machine-learning",
    subfield: "Machine Learning",
    hook: "Learning from behavior instead of being told rules",
    icon: BrainCircuit,
    accent: "text-chart-3",
    accentBg: "bg-chart-3/10",
    body:
      "Two users with identical resumes can genuinely prefer different roles. Neural Collaborative Filtering is trained on each user’s own implicit feedback (views, saves, applications, dismissals) so the system learns the preference function from data instead of a hand-coded rule — and keeps improving as more data arrives.",
    visual: (
      <div>
        <InteractionTable showWeights />
        <div className="mt-6 border-t border-border pt-5">
          <NetworkDiagram
            layers={[
              { count: 4, label: "Interaction signals", colorClass: "bg-chart-2" },
              { count: 3, label: "Hidden layer", colorClass: "bg-chart-2" },
              { count: 1, label: "Predicted score", colorClass: "bg-primary" },
            ]}
          />
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Predicted score for a job this user has only viewed:{" "}
            <span className="text-lg font-semibold text-foreground">
              <AnimatedNumber value={TARGET_SCORE} duration={0.8} />%
            </span>
          </p>
        </div>
      </div>
    ),
    caption: "the network generalizes this user's save/apply pattern to score a job it hasn't seen them act on yet",
  },
  {
    key: "information-retrieval",
    subfield: "Information Retrieval",
    hook: "Ranking, not just matching",
    icon: SearchCode,
    accent: "text-chart-4",
    accentBg: "bg-chart-4/10",
    body:
      "Finding jobs that are simply relevant isn’t enough — the system has to decide which relevant jobs to show first. The Hybrid Ranking Engine produces a ranked list ordered by relevance to the user’s profile, evaluated with the same metrics search engines use: Precision@K and Recall@K.",
    visual: (
      <div className="mx-auto max-w-md">
        <ReorderList items={REORDER_ITEMS} beforeLabel="Candidates as found" afterLabel="Re-ranked by Match Score" />
      </div>
    ),
    caption: "same 5 jobs, resorted the moment scores come in",
  },
  {
    key: "data-structures",
    subfield: "Data Structures & Systems",
    hook: "Making it fast enough to be usable",
    icon: Database,
    accent: "text-chart-5",
    accentBg: "bg-chart-5/10",
    body:
      "Angkop stores roughly 10,000 active job embeddings. Comparing a user's vector against every single one — a brute-force scan — works, but scales linearly and gets slower as postings grow. pgvector's approximate nearest-neighbor index (HNSW) narrows that down to the closest candidates almost immediately. And if the same user reopens their dashboard a minute later, Redis returns the already-computed match scores from memory instead of recomputing anything — a classic space-time trade-off.",
    visual: <IconStats rows={LATENCY_ROWS} />,
    caption: "illustrative lookup time for one match request against ~10,000 jobs",
  },
];

export default function FoundationsPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Question 1
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          How does Computer Science come into play?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Every stage of Angkop&rsquo;s matching pipeline is built on a core
          CS subfield. Strip away the phrase &ldquo;job matching&rdquo; and
          this is what&rsquo;s actually underneath, worked out with the same
          example profile and job posting all the way through.
        </p>
      </motion.div>

      <div className="mt-8 space-y-6">
        {STAGES.map((stage, index) => (
          <PipelineStage key={stage.key} stage={stage} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 + STAGES.length * 0.08, ease: "easeOut" }}
        className="mt-6 rounded-xl border border-border bg-muted/30 p-5 sm:p-6"
      >
        <h2 className="text-sm font-semibold text-foreground">
          If asked to summarize in one paragraph
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          &ldquo;Computer Science enters at every layer of the matching
          process: NLP is used to convert skills and job descriptions into
          meaning-bearing numerical representations; linear algebra is used
          to mathematically measure how similar those representations are;
          machine learning is used to learn a personalized preference model
          directly from user behavior instead of hardcoded rules;
          information retrieval principles are used to rank, not just
          filter, the resulting candidates; and data structures and caching
          are used to make the entire pipeline fast enough to run in real
          time. Job matching here is not a database lookup, it is a
          computational pipeline spanning NLP, linear algebra, deep
          learning, and information retrieval.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}

function PipelineStage({ stage, index }) {
  const Icon = stage.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.08, ease: "easeOut" }}
      className="rounded-xl border border-border p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", stage.accentBg)}>
          <Icon className={cn("size-5", stage.accent)} strokeWidth={1.75} />
        </span>
        <span className="text-xs font-medium text-muted-foreground">1.{index + 1}</span>
        <h2 className="text-base font-semibold text-foreground">{stage.subfield}</h2>
        <span className={cn("text-xs font-medium", stage.accent)}>{stage.hook}</span>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{stage.body}</p>

      <div className="mt-5 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
        {stage.visual}
        <p className="mt-4 text-center text-xs text-muted-foreground">{stage.caption}</p>
      </div>
    </motion.div>
  );
}
