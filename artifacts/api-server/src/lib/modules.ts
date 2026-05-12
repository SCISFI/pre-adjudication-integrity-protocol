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
    title: "Orientation Intensive: The First 7 Days",
    focusArea:
      "Seriousness, stabilization, role clarity, support boundaries, and first action plan",
    sections: [
      {
        heading: "Opening Orientation",
        content: `This first assignment moves quickly on purpose. The first week is not only a welcome week. It is the place where you name the seriousness of the moment, slow down panic, separate legal crisis from recovery work, identify who belongs in which role, and choose concrete next actions for the next seven days.

Plan for at least 30 minutes of focused work, not counting daily check-ins. Read slowly. Write directly. Do not use this assignment to explain the case, defend yourself, investigate anything, or prove that you are safe. This is structured recovery-accountability work. It is not therapy, legal advice, forensic evaluation, risk scoring, relapse prediction, or court preparation.`,
      },
      {
        heading: "The Day Everything Changed",
        content: `Something has happened, been disclosed, been discovered, or reached a point where life cannot continue as if nothing has changed. You may be facing consequences in your household, marriage or partnership, work, community, finances, reputation, legal situation, or internal sense of self. The details of the situation do not belong in this app.

What does belong here is your present-tense response: whether you are becoming more honest or more evasive, more grounded or more chaotic, more connected to appropriate support or more isolated, more respectful of boundaries or more demanding of reassurance. The first seven days matter because panic can create additional harm if it is allowed to run the plan.`,
      },
      {
        heading: "Stabilization Is an Accountability Task",
        content: `Stabilization is not avoidance. Stabilization means you stop adding damage while you begin telling the truth in the right places. It means you do not use fear as permission to pressure others, flood people with details, disappear into isolation, obsess over legal information, or demand emotional rescue from people who may already be hurt or destabilized.

A grounded man can call the right professional, keep an appointment, sleep, eat, write honestly, accept a boundary, ask for appropriate support, and take one next-right action. These may look basic, but they are serious recovery-accountability practices in the first week.`,
      },
      {
        heading: "Legal Crisis Is Not Recovery",
        content: `Legal urgency can make everything feel strategic. You may want to measure each action by whether it helps your case, repairs your image, satisfies someone else, or reduces consequences. That is understandable, but it is not the same as recovery.

This program will not advise you about charges, court, law enforcement, investigation, custody, contact, employment, sentencing, evaluation, or legal strategy. Your attorney handles legal questions. Your licensed therapist or supervised clinical provider handles clinical treatment. This app holds structured reflection about responsibility, boundaries, emotions, support, and next-right actions.`,
      },
      {
        heading: "Role Map for the First Week",
        content: `Put the right truth in the right place. Legal facts, police facts, investigative facts, and legal strategy belong with your attorney. Clinical history, treatment needs, safety planning, compulsive patterns, trauma, diagnosis, and deeper disclosure work belong with your licensed therapist or supervised clinical provider. Daily structure, honest self-attestation, boundary practice, and next-right actions can be recorded here when they stay inside the app's limits.

A spouse, partner, family member, household member, or support person should not be treated as your attorney, therapist, evaluator, judge, or emotional survival system. Responsibility toward others includes restraint, patience, respect for boundaries, and not demanding reassurance.`,
      },
      {
        heading: "Reality Check",
        content: `Panic may tell you that everything has to be fixed immediately. Shame collapse may tell you that you are only your worst choices. Minimization may tell you this is not as serious as it is. Image management may tell you to focus on what people think instead of what is true. Bargaining may tell you one dramatic gesture will make consequences stop. Legal obsession may tell you recovery can wait. Isolation may tell you no one can know how you are really doing.

Treat those reactions as signals, not instructions. The first week assignment is to name what is happening, stay bounded, use the correct professional channels, stay connected to appropriate support, and commit to one concrete action before the week ends.`,
      },
      {
        heading: "Boundary Reminder",
        content:
          "Do not enter offense details, victim names, investigative facts, illegal content descriptions, police facts, or legal strategy in this app. Use this space for recovery reflection, accountability, boundaries, emotions, and next right actions. Discuss legal details with your attorney and clinical details with your licensed therapist or supervised clinical provider.",
      },
      {
        heading: "This Week's Written Work",
        content:
          "Complete each response field separately. This first week intentionally covers stabilization, legal/recovery separation, role clarity, relationship responsibility, and a first action plan. Short answers that avoid the question are not the goal. Stay specific, present-tense, and bounded without entering prohibited details.",
      },
    ],
  },
  {
    weekNumber: 2,
    title: "Thinking Patterns and Daily Honesty",
    focusArea:
      "Identifying thinking errors, minimization, blame, secrecy, and self-protective narratives",
    sections: [
      {
        heading: "Opening Orientation",
        content: `Week 2 moves from crisis orientation into thought-level honesty. The goal is not to list past acts or describe illegal material. The goal is to identify the thinking patterns that make secrecy, boundary violations, entitlement, minimization, fantasy, avoidance, or image management easier to justify.

Plan for at least 30 minutes of focused work. This module is not therapy, legal advice, forensic evaluation, risk scoring, relapse prediction, or a court document. It is structured recovery-accountability practice: noticing the thoughts that shape choices before those choices become harm.`,
      },
      {
        heading: "Thinking Errors Are Not Excuses",
        content: `A thinking error is a repeated internal move that makes responsibility smaller and self-protection larger. Examples may include: I deserve relief, no one understands me, this is not that serious, I can handle this alone, I am different, I already suffered enough, I just need people to see my side, or I will deal with it later.

Naming a thinking pattern does not excuse behavior. It increases responsibility because it shows where intervention is possible. You are not being asked to diagnose yourself. You are being asked to notice the mental habits that make honesty harder and boundaries weaker.`,
      },
      {
        heading: "The Thought Journal Practice",
        content: `This week introduces a simple thought journal pattern: situation, emotion, thought, body cue, action urge, better response. Keep it present-tense and bounded. Do not use it to document offense details, victim information, investigative facts, illegal content descriptions, police facts, or legal strategy.

A useful entry might identify a moment of isolation, shame, anger, fear, boredom, entitlement, self-pity, or pressure. The purpose is to catch the thought before it becomes a decision. The work is to practice interruption: I notice this thought; I do not have to obey it; I can choose the next right action.`,
      },
      {
        heading: "Minimization, Blame, and Image Management",
        content: `Minimization reduces seriousness. Blame moves responsibility outward. Image management tries to control what others think before the truth has been faced. These patterns can hide inside reasonable-sounding language: I was stressed, they do not know the full story, I am not as bad as people think, I need to explain myself, I am doing better now so they should see that.

This week asks you to become more precise. Where are you softening language? Where are you shifting attention? Where are you using fear, shame, or confusion as a reason not to tell the truth in the proper place?`,
      },
      {
        heading: "This Week's Written Work",
        content:
          "Complete each response field separately. Focus on current thinking patterns, not offense details. Use attorney and clinical-provider redirects when a thought belongs in those settings. The goal is to build honest observation before action.",
      },
    ],
  },
  {
    weekNumber: 3,
    title: "Before You Act: Choice Points and Self-Control",
    focusArea:
      "Slowing the chain from vulnerability to thought, urge, decision, and repair-oriented action",
    sections: [
      {
        heading: "Opening Orientation",
        content: `Week 3 is about the space before action. Recovery-accountability work cannot stop at insight. A man can understand his patterns and still act from panic, entitlement, secrecy, resentment, loneliness, or fear. This module focuses on choice points: the moments where you can pause, tell the truth, contact support, leave a risky situation, or choose a bounded action.

Plan for at least 30 minutes of focused work. This module does not ask for offense descriptions, victim information, investigative facts, illegal content descriptions, police facts, or legal strategy. It asks you to map present-tense vulnerability and practice interruption.`,
      },
      {
        heading: "The Chain Before a Choice",
        content: `Choices rarely appear from nowhere. There is usually a chain: stress, sleep loss, isolation, resentment, secrecy, fantasy, shame, entitlement, opportunity, self-talk, body cues, action urges, and then behavior. The purpose of a chain map is not to predict relapse or score risk. It is to identify where you can intervene earlier.

You are responsible for the chain before it becomes action. That does not mean you control every feeling. It means you practice responding to feelings without using them as instructions.`,
      },
      {
        heading: "Pause, Name, Choose",
        content: `A basic self-control practice for this week is: pause, name, choose. Pause before moving. Name the emotion, thought, urge, and boundary. Choose the next right action: contact an appropriate support, move to a safer environment, write a bounded thought journal, bring clinical material to your provider, bring legal material to your attorney, or complete a daily check-in.

This is not a guarantee of safety and not a risk-management score. It is a practical structure for slowing down when you are tempted to react automatically.`,
      },
      {
        heading: "Support Without Outsourcing Responsibility",
        content: `Support matters, but support is not the same as outsourcing responsibility. A support person can help you stay connected, remember commitments, attend appointments, and choose grounded action. They should not be asked to monitor you, police you, certify your change, hold legal details, or become responsible for your choices.

This week, define how you will use support appropriately. Be specific about what you can ask for and what you must not place on another person.`,
      },
      {
        heading: "This Week's Written Work",
        content:
          "Complete each response field separately. Map present-tense vulnerabilities and choice points without offense details. Identify practical interruption steps, appropriate support, and one self-control practice for the next seven days.",
      },
    ],
  },
  {
    weekNumber: 4,
    title: "Boundaries, Sexual Health, and Support Team",
    focusArea:
      "Defining healthy boundaries, support-team roles, and concrete safeguards without scoring or prediction",
    sections: [
      {
        heading: "Opening Orientation",
        content: `Week 4 moves into boundaries and sexual health in a guarded, non-explicit way. The purpose is not to describe sexual behavior, collect illegal content details, identify victims, or create a forensic narrative. The purpose is to define what healthy sexuality and relational integrity require now: consent, honesty, respect, containment, non-coercion, appropriate support, and professional treatment where needed.

Plan for at least 30 minutes of focused work. This module is not therapy, legal advice, forensic evaluation, risk scoring, relapse prediction, or a statement that you are safe or rehabilitated.`,
      },
      {
        heading: "Healthy Boundaries Are Behavioral",
        content: `A boundary is not an intention. It is a behavioral line you can practice and others can observe. Boundaries may involve technology, isolation, secrecy, contact, conversations, disclosure settings, therapy attendance, support meetings, sleep, substances, emotional flooding, fantasy, resentment, or pressure for reassurance.

This app does not tell you what legal restrictions apply to you and does not replace clinical treatment planning. Your task here is to name the boundaries you know you need to practice and bring legal or clinical questions to the correct professional.`,
      },
      {
        heading: "Sexual Health Without Explicit Detail",
        content: `Sexual health is not merely the absence of a crisis. It includes honesty, consent, respect for others' autonomy, non-coercion, patience, sobriety of mind, appropriate privacy, responsibility for fantasy life, and willingness to receive clinical help. You do not need to enter explicit details to reflect honestly about whether your sexual life has been secretive, entitled, disconnected, compulsive, avoidant, manipulative, or out of alignment with your values.

Use careful, general language. If specifics are clinically necessary, take them to your licensed therapist or supervised clinical provider. If specifics are legally relevant, take them to your attorney.`,
      },
      {
        heading: "The Containment Team",
        content: `A containment team is not a surveillance system. It is the set of appropriate people and practices that help you stay connected to truth: attorney for legal matters, licensed therapist or supervised clinical provider for clinical work, appropriate support people for grounded connection, and this app for structured self-attestation.

No spouse, partner, family member, or support person should be pressured into a role they did not agree to hold. No app notification, score, or automated escalation will replace human clinical judgment.`,
      },
      {
        heading: "This Week's Written Work",
        content:
          "Complete each response field separately. Focus on healthy boundaries, support-team roles, non-explicit sexual health reflection, and one concrete safeguard for the next seven days. Do not enter offense details, victim names, investigative facts, illegal content descriptions, police facts, or legal strategy.",
      },
    ],
  },
];

export function getModule(weekNumber: number) {
  return CURRICULUM_MODULES.find((m) => m.weekNumber === weekNumber);
}
