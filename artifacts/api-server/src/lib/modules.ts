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
    title: "The Day Everything Changed",
    focusArea: "Stabilization, honesty, and first-week recovery-accountability work",
    sections: [
      {
        heading: "Opening Orientation",
        content: `This week begins in a serious moment. Something has happened, been disclosed, been discovered, or reached a point where your life cannot continue as if nothing has changed. The purpose of this assignment is not to explain the legal situation, defend yourself, gather sympathy, or prove that you are safe. The purpose is to slow down, tell the truth about your present reality, and begin structured recovery-accountability work without making the crisis worse.

Set aside approximately 30 minutes of focused time for this week's assignment, not counting daily check-ins. Read the material slowly. Write directly. Do not perform for the app, your clinician, your attorney, your spouse or partner, your family, or anyone else. This is structured recovery-accountability work. It is not therapy, legal advice, forensic evaluation, or a risk assessment.`,
      },
      {
        heading: "What Changed",
        content: `The day everything changed may have involved discovery, confrontation, disclosure, arrest, separation, investigation, job consequences, family rupture, or the private realization that secrecy can no longer hold. The details of what happened do not belong in this app. What does belong here is the reality that your patterns, choices, secrecy, avoidance, and emotional survival strategies now require serious attention.

Early crisis often produces panic and a desperate desire to regain control. You may want to explain, minimize, bargain, research, confess everything everywhere, isolate, collapse, or manage how others see you. None of those reactions equals recovery. Recovery begins with staying grounded enough to take the next honest, bounded step.`,
      },
      {
        heading: "Stabilization Is Not Avoidance",
        content: `Stabilization means you stop adding damage. It means you do not use panic as permission to pressure others, violate boundaries, hide information from the appropriate professionals, or flood the wrong people with material they should not have to carry. Stabilization also means you do not disappear into isolation, numbness, fantasy, compulsive research, or image management.

The first week is not about solving your life. It is about establishing enough honesty and structure that you can keep doing the work. Your daily check-ins are one part of that structure. This weekly assignment is another. Your attorney, licensed therapist, supervised clinical provider, and appropriate support channels each have different roles. Putting the right truth in the right place is part of accountability.`,
      },
      {
        heading: "Recovery Is Different From Legal Crisis Management",
        content: `Legal crisis can take over your attention. It can make every conversation feel strategic and every hour feel urgent. But legal crisis is not the same as recovery. A man can be legally focused and still be dishonest with himself. A man can be terrified of consequences and still avoid accountability. A man can want his life back without yet understanding what must change.

This program will not advise you about your case, your charges, your attorney strategy, court, law enforcement, evaluation, sentencing, custody, contact, employment, or reputation. It will ask you to identify present-tense responsibility: what you are facing, what you are tempted to hide, what boundaries you must honor, who needs truthful support information, what belongs with professionals, and what next-right action you will take this week.`,
      },
      {
        heading: "Reality Check",
        content: `Panic may tell you that you have to fix everything immediately. Shame collapse may tell you that you are only your worst choices. Minimization may tell you that this is not as serious as it is. Image management may tell you to focus on what people think instead of what is true. Bargaining may tell you that one dramatic gesture will make the consequences stop. Legal obsession may tell you that recovery can wait until the case is resolved. Isolation may tell you that no one can know how you are really doing.

Treat each of those reactions as information, not instructions. This week, your task is to remain sober-minded enough to tell the truth, use appropriate support, honor boundaries, and take one concrete next-right action. You are not being asked to produce a legal narrative. You are being asked to begin a recovery-accountability practice.`,
      },
      {
        heading: "Boundary Reminder",
        content:
          "Do not enter offense details, victim names, investigative facts, illegal content descriptions, police facts, or legal strategy in this app. Use this space for recovery reflection, accountability, boundaries, emotions, and next right actions. Discuss legal details with your attorney and clinical details with your licensed therapist or supervised clinical provider.",
      },
      {
        heading: "This Week's Written Work",
        content:
          "After reading, complete each response field separately. Short answers that avoid the question are not the goal. Stay specific, present-tense, and bounded. If a question touches legal or clinical material, name where that material belongs without describing the details. The work is to practice honesty, role clarity, and containment.",
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
