export interface ModuleSection {
  heading: string;
  content: string;
}

export interface CurriculumModule {
  weekNumber: number;
  title: string;
  focusArea: string;
  sections: ModuleSection[];
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    weekNumber: 1,
    title: "Orientation and Foundations",
    focusArea: "Understanding the structure and purpose of this program",
    sections: [
      {
        heading: "What This Program Is",
        content:
          "This program provides a structured space for reflection and accountability during a significant period in your life. It is not therapy, legal counsel, or a risk assessment. It is a structured process designed to support honest self-examination through accountability practices that you own and document. The structure exists to hold space. You hold meaning.",
      },
      {
        heading: "What This Program Is Not",
        content:
          "Participation in this program does not constitute treatment, therapy, forensic evaluation, or legal representation. Nothing in this program should be interpreted as legal advice or as a promise regarding any legal outcome. If you have legal questions, direct them to your attorney. If you have clinical or mental health needs, speak with a licensed professional.",
      },
      {
        heading: "Integrity as a Practice",
        content:
          "Integrity is not a destination — it is a practice. It is choosing alignment between your stated values and your actions, repeatedly, even when it is uncomfortable. This week, consider what integrity has meant in your life, and where that alignment has broken down. You do not need to have answers. You need to be willing to look.",
      },
      {
        heading: "This Week's Focus",
        content:
          "This week, you are orienting. You are reading the framework. You are deciding what honest participation means to you. There is no performance required here. There is no audience for your entries except yourself and your assigned clinician, who reviews activity data only.",
      },
      {
        heading: "Reflection Prompt",
        content:
          "Reflect on the following: What does it mean to you to show up with integrity in a difficult situation? What has accountability looked like in your life when it has gone well? What conditions made that possible?",
      },
    ],
  },
  {
    weekNumber: 2,
    title: "Accountability and Responsibility",
    focusArea: "Examining patterns of responsibility and deflection",
    sections: [
      {
        heading: "The Difference Between Excuse and Explanation",
        content:
          "An explanation describes what happened and its context. An excuse deflects responsibility onto context. Accountability requires the ability to explain circumstances without using them to avoid ownership. This is not about punishing yourself. It is about developing a clear-eyed relationship with your own choices and their effects.",
      },
      {
        heading: "Deflection Patterns",
        content:
          "Common patterns that interrupt accountability include minimization (it wasn't that serious), externalization (they made me), compartmentalization (that part of me isn't the real me), and justification (given the circumstances, it was understandable). Recognizing these patterns in your own thinking is not a sign of failure — it is the beginning of clarity.",
      },
      {
        heading: "Responsibility Without Self-Destruction",
        content:
          "Taking responsibility does not require self-hatred. It requires honesty. A person who collapses under shame cannot act differently. The goal is to develop stable, honest ownership of choices and patterns — not to perform suffering, but to build the clarity that makes different choices possible.",
      },
      {
        heading: "This Week's Focus",
        content:
          "Consider a time when you chose accountability over deflection and what it cost you and gave you. Consider a time when you chose deflection and what that protected and what it cost. There are no correct answers. The practice is honest reflection, not self-condemnation.",
      },
      {
        heading: "Reflection Prompt",
        content:
          "Where in your life have you historically found it most difficult to take ownership? What has that pattern protected you from? What has it cost you and others? What would a fully accountable response to this period in your life look like?",
      },
    ],
  },
  {
    weekNumber: 3,
    title: "Relationships and Support Systems",
    focusArea: "Examining relational patterns and rebuilding honest connection",
    sections: [
      {
        heading: "Relationships Under Stress",
        content:
          "Significant legal and behavioral consequences reshape relationships. Some relationships may rupture or become strained. Others may surprise you with their stability. It is important not to conflate relationship damage with the totality of your identity or worth — and equally important not to use remaining relationships as evidence that the situation is less serious than it is.",
      },
      {
        heading: "What Support Actually Looks Like",
        content:
          "Support is not agreement. A person who supports you during a serious accountability process does so by remaining in honest relationship with you, not by minimizing the situation or the impact on others. Genuine support holds both care for you and clarity about what has occurred. If your support system only validates and does not challenge, it may be reinforcing rather than supporting.",
      },
      {
        heading: "Isolation and Its Risks",
        content:
          "Social isolation is a common response to shame and legal stress. It can feel protective. In reality, isolation removes the friction of honest relationship, which is one of the conditions that supports integrity. Accountability practices work best when they include structured human contact — whether with a therapist, group, mentor, or program structure like this one.",
      },
      {
        heading: "This Week's Focus",
        content:
          "Take an honest inventory of your current support system. Who is in your life? Who is providing genuine support versus enabling avoidance? What relationships need honesty from you that they are not currently receiving?",
      },
      {
        heading: "Reflection Prompt",
        content:
          "Describe your current support system honestly. Who do you lean on, and what do you lean on them for? Where are you asking people to protect you from honesty? What would it look like to invite honest accountability into at least one of those relationships?",
      },
    ],
  },
  {
    weekNumber: 4,
    title: "Behavioral Patterns and Integrity Practices",
    focusArea: "Identifying patterns and building forward-looking commitments",
    sections: [
      {
        heading: "Patterns and Their Origins",
        content:
          "Behavioral patterns do not appear from nowhere. They develop over time through repetition, reinforcement, and the accommodation of discomfort. Understanding a pattern is not the same as excusing it. It is the beginning of being able to interrupt it. The goal here is pattern recognition, not pattern prosecution.",
      },
      {
        heading: "The Role of Integrity Commitments",
        content:
          "An integrity commitment is a stated intention, made with full awareness of its difficulty. It is not a promise you are already keeping — it is a direction you are actively choosing. The value of stating a commitment is not in its perfection. It is in the act of naming what you are working toward and returning to that name when you drift.",
      },
      {
        heading: "Building Forward",
        content:
          "This program is oriented toward the present and future — toward what you are choosing now and what you are building. It does not ask you to relitigate the past or produce clinical self-disclosure. It asks you to practice integrity as a present-tense activity: honest check-ins, honest reflection, honest commitment.",
      },
      {
        heading: "This Week's Focus",
        content:
          "Identify one behavioral pattern you have recognized in yourself during this program. Describe it honestly. Name one specific integrity practice — one concrete, repeatable action — that you are committing to this week. Write it as a commitment, not a wish.",
      },
      {
        heading: "Reflection Prompt",
        content:
          "What behavioral pattern have you seen most clearly in your own reflection over these four weeks? What conditions tend to activate it? What single integrity practice could interrupt it at an early stage? State your integrity commitment for this week as clearly and concretely as you can.",
      },
    ],
  },
];

export function getModule(weekNumber: number): CurriculumModule | undefined {
  return CURRICULUM_MODULES.find((m) => m.weekNumber === weekNumber);
}
