export const EMAIL = "zachary.krivis@gmail.com";

export const GITHUB = "https://github.com/Zxchz";
export const LINKEDIN = "https://www.linkedin.com/in/zachary-krivis-947406309";

export const ESSAYS = {
  misdiagnosis:
    "https://docs.google.com/document/d/1xBlzbU96j7mIDcMmMZtc3y_ZjaAd_-wIiEKwWAHl_uI/edit?usp=sharing",
  qubits:
    "https://docs.google.com/document/d/1a6uny6BQTbIv3HxHEq4DkyFYHz4SQ1a6bkcKBE0TlxY/edit?usp=sharing",
};

export type Row = {
  role: string;
  date: string;
  org: string;
  desc?: string;
  extraLabel?: string;
  extra?: string;
  minimal?: boolean;
  aside?: string;
};

export const experience: Row[] = [
  {
    role: "Machine Learning Researcher",
    date: "2026 — Present",
    org: "With a research team · Remote",
    desc: "Interpretability and structured sparsity for audio foundation models. I probe which internal representations actually carry the signal, then prune aggressively to see what survives. Writeup in progress and under review.",
    extraLabel: "Stack",
    extra: "PyTorch · activation probing · structured + magnitude pruning",
  },
  {
    role: "Information Technology Intern",
    date: "2026 — Present",
    org: "Cleveland Clinic · On-site",
    desc: "Working with the IT infrastructure team on the systems that keep a hospital network running, across software infrastructure and enterprise information technology.",
    extraLabel: "Focus",
    extra: "Enterprise IT · network infrastructure · hospital systems",
  },
  {
    role: "Technology Assistant",
    date: "2022 — 2023",
    org: "Solon Senior Center · Part-time",
    desc: "Supported 50-plus seniors across phones, laptops, and car infotainment systems, ran VR sessions on the Oculus Quest 2, and built training modules that measurably improved digital confidence over six months.",
    extraLabel: "Tools",
    extra: "Oculus Quest 2 · device support · training modules",
  },
  {
    role: "Team Member",
    date: "2025 — Present",
    org: "Mitchell's Ice Cream",
    minimal: true,
    aside: "and yes, I scoop ice cream",
  },
];

export type Project = {
  title: string;
  date: string;
  org: string;
  desc: string;
  extraLabel: string;
  extra: string;
  source?: string;
  demo?: boolean;
};

export const projects: Project[] = [
  {
    title: "Audio Model Interpretability",
    date: "Ongoing",
    org: "Research",
    desc: "Finding the representations that matter inside audio foundation models, pruning the rest, and measuring how much you can take away before the model notices. Under review.",
    extraLabel: "Stack",
    extra: "PyTorch · probing · activation patching · structured sparsity",
  },
  {
    title: "The Useless Button",
    date: "2025",
    org: "1st Place · Scrapyard Cleveland",
    desc: "A machine with exactly one purpose: turning itself off. Tap the RFID tag, the button arms, and a servo arm flips it back off in about 50 milliseconds. Firmware in C++ on a microcontroller. It does nothing, precisely.",
    extraLabel: "Build",
    extra: "C++ firmware · RFID · servo arm · ~50 ms off-time · built in 24h",
    source: "https://github.com/Zxchz/uselessButton",
    demo: true,
  },
];

export type Article = {
  title: string;
  date: string;
  meta: string;
  pull: string;
  body: string;
  href: string;
  aside: string;
};

export const writing: Article[] = [
  {
    title: "The Misdiagnosis",
    date: "2025",
    meta: "On how schools respond to AI",
    pull: "A 70% flag from a probabilistic classifier is a hypothesis, not a finding.",
    body: "An argument that the most important effect of generative AI on education isn't the technology — it's how institutions react to it. Detector false positives, Bloom's 2-sigma problem, and the case for integration over prohibition.",
    href: ESSAYS.misdiagnosis,
    aside:
      "Bloom's 2-sigma problem (1984): one-on-one tutored students outperform 98% of a conventional classroom.",
  },
  {
    title: "A Million Noiseless Qubits",
    date: "2026",
    meta: "Rising Scholars Award",
    pull: "If a million-qubit computer can be built, why not 10 or 100 million?",
    body: "What changes when qubits stop making mistakes. From Majorana 1 to PsiQuantum's roadmap, a look at the race toward a million fault-free qubits and what boundless quantum compute would mean for medicine, cryptography, and physics.",
    href: ESSAYS.qubits,
    aside:
      "Majorana 1 is Microsoft's topological qubit chip; PsiQuantum is pursuing a photonic path to the same scale.",
  },
];

export const coursework: string[] = [
  "AP Computer Science A",
  "AP Calculus AB",
  "AP Physics 1",
  "AP Physics C: Mechanics",
  "AP English Language",
  "AP Environmental Science",
  "AP U.S. History",
  "Honors Precalculus",
];

export const skills: { label: string; value: string }[] = [
  {
    label: "Research",
    value:
      "Interpretability, structured sparsity, audio models, neural networks, applied ML, LLMs",
  },
  {
    label: "Engineering",
    value:
      "C++, software infrastructure, IT infrastructure, computer information systems",
  },
  { label: "Working style", value: "Teamwork, leadership" },
];

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];
