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
    title: "Staying Alive and Grounded",
    focusArea: "Shame collapse, panic, isolation, support, and immediate stabilization",
    sections: [
      {
        heading: "Opening Orientation",
        content: `This week is about staying grounded enough to keep doing the work. Serious consequences can create panic, despair, numbness, sleeplessness, and the urge to disappear. This module is not therapy, crisis assessment, or a safety evaluation. It is structured recovery-accountability work that helps you name what is happening and choose stabilizing actions for the next seven days.

Plan for approximately 30 minutes of focused work. If you are in immediate danger, thinking about harming yourself or someone else, or unable to stay safe, use emergency services or your local crisis resources now. This app does not monitor emergencies, send alerts, or provide live clinical care.`,
      },
      {
        heading: "Shame Collapse Is Not Accountability",
        content: `Shame collapse can sound like accountability because it uses severe language about the self. But collapse often pulls attention away from responsibility and into survival theater: I am terrible, everything is over, no one can know, nothing matters, I cannot face this. That may feel honest, but it can become another form of avoidance.

Accountability requires enough stability to tell the truth, receive appropriate help, honor boundaries, and take the next right action. The goal is not to feel better quickly or punish yourself dramatically. The goal is to stay present enough to act with integrity today.`,
      },
      {
        heading: "Grounding Without Dumping",
        content: `Staying connected matters, but connection does not mean making other people responsible for your emotional survival. A spouse, partner, family member, or support person may be hurt, afraid, angry, or overwhelmed. They are not required to reassure you, regulate you, or carry details that belong with your attorney or clinical provider.

Grounding means you identify safe, appropriate supports and use them responsibly. It may mean contacting a therapist, supervised clinical provider, sponsor, group member, trusted friend, or crisis line. It may mean eating, sleeping, moving your body, breathing, turning off compulsive legal research, or choosing not to isolate. These actions do not solve the crisis. They keep you available for the next honest step.`,
      },
      {
        heading: "What Not to Do This Week",
        content: `Do not use panic as permission to pressure others. Do not demand reassurance from people who are affected by your choices. Do not turn this app into a legal journal. Do not enter offense details, victim names, investigative facts, illegal content descriptions, police facts, or legal strategy. Do not confuse a dramatic confession with repair. Do not isolate and call it protection.

Instead, keep the work bounded: name your emotional condition, name your supports, name what belongs with professionals, and choose one stabilizing practice you will repeat for seven days.`,
      },
      {
        heading: "This Week's Written Work",
        content:
          "Complete each response field separately. Focus on what you are experiencing now, what support and stabilization require, what belongs with a licensed therapist or supervised clinical provider, and how you will avoid making others carry your emotional survival. Do not include offense details, victim information, investigative facts, police facts, or legal strategy.",
      },
    ],
  },
  {
    weekNumber: 3,
    title: "Legal Trouble Is Not Recovery",
    focusArea: "Separating legal anxiety, image management, and actual recovery work",
    sections: [
      {
        heading: "Opening Orientation",
        content: `Legal consequences can become the center of every waking thought. You may find yourself measuring every action by whether it helps your case, protects your image, reassures someone, or makes you look changed. This week separates legal crisis management from recovery-accountability work.

This program does not provide legal advice, legal strategy, forensic evaluation, risk assessment, or court preparation. Your attorney handles legal questions. Your licensed therapist or supervised clinical provider handles clinical treatment. This app holds structured recovery reflection: what you are facing, what belongs to you, what you are practicing, and what you will do with integrity even when no one is applauding.`,
      },
      {
        heading: "Fear of Consequences Is Not the Same as Change",
        content: `Fear can interrupt behavior for a while. Fear can make you compliant, quiet, agreeable, or desperate. But fear alone is not recovery. A person can be terrified and still be self-protective. A person can want consequences to stop without yet becoming honest about the patterns that made consequences possible.

Recovery begins when you practice responsibility whether or not it improves your image. It asks what must change even if no legal outcome changes, even if no one gives you credit, and even if the work remains private, repetitive, and uncomfortable.`,
      },
      {
        heading: "Performance and Image Management",
        content: `Performance is the attempt to look changed before you have practiced change. Image management is the attempt to control what others conclude about you. Both can appear responsible from the outside while remaining self-protective on the inside.

This week, notice where you want your participation, remorse, insight, religious language, therapy attendance, or app work to function as proof. Do not use this program to build a court-facing story. Use it to practice the quieter work of honesty, restraint, repair posture, and right action without demanding recognition.`,
      },
      {
        heading: "Right Truth, Right Place",
        content: `Legal details belong with your attorney. Clinical material belongs with your licensed therapist or supervised clinical provider. Recovery reflection belongs here only when it stays inside the app's boundaries. Spouses, partners, family members, and support people should not be pressured to hear details, reassure you, or certify your change.

Role clarity is not avoidance. It is a way of protecting the work from becoming chaotic, performative, or harmful. Putting the right truth in the right place is part of integrity.`,
      },
      {
        heading: "This Week's Written Work",
        content:
          "Complete each response field separately. Focus on the difference between legal fear and recovery work, where you are tempted to perform change, what belongs with your attorney or clinical provider, and what integrity action you will practice without audience or reward.",
      },
    ],
  },
  {
    weekNumber: 4,
    title: "Who Belongs Where",
    focusArea: "Role clarity, boundaries, support, and putting the right truth in the right place",
    sections: [
      {
        heading: "Opening Orientation",
        content: `By Week 4, the central task is role clarity. In crisis, people often put the wrong material in the wrong place: legal questions into therapy, clinical distress onto a spouse or partner, reassurance needs onto family, offense details into an app, or emotional survival onto one support person. This creates confusion and can create more harm.

This module is a structured role map. It is not legal advice, therapy, family mediation, spouse communication coaching, or forensic evaluation. It helps you name which truths belong with which supports so you can act with more containment and less pressure on others.`,
      },
      {
        heading: "The Attorney's Role",
        content: `Your attorney is the appropriate person for legal questions, legal strategy, law enforcement questions, court process, case facts, investigative facts, police facts, and legal risk. This app should not receive those details, and neither should people who are not responsible for advising you legally.

Respecting the attorney role is not secrecy. It is containment. It keeps legal material in the place where it can be handled appropriately.`,
      },
      {
        heading: "The Clinical Provider's Role",
        content: `Your licensed therapist or supervised clinical provider is the appropriate person for clinical history, mental health concerns, treatment needs, deeper disclosure work, safety planning, compulsive patterns, trauma, diagnosis, and treatment decisions. This app can help you identify what needs to be brought there, but it does not replace that care.

When clinical material appears in your reflection, name that it belongs with your provider without using this app to process details that require clinical care.`,
      },
      {
        heading: "The Role of Support People and Family",
        content: `Support people can help you stay honest, grounded, and connected. They are not your attorney, therapist, judge, evaluator, or emotional container for every detail. A spouse, partner, family member, household member, or future relationship may need boundaries, space, truthfulness, and respect without being pressured to reassure you or participate in your recovery on demand.

Responsibility toward others includes restraint. It includes not asking affected people to carry what belongs with professionals. It includes practicing accountability without demanding immediate trust, hope, forgiveness, or closeness.`,
      },
      {
        heading: "This Week's Written Work",
        content:
          "Complete each response field separately. Name what belongs with your attorney, what belongs with your licensed therapist or supervised clinical provider, what does not belong in this app, what support can responsibly look like, and what boundary you will practice for the next seven days.",
      },
    ],
  },
];

export function getModule(weekNumber: number): CurriculumModule | undefined {
  return CURRICULUM_MODULES.find((m) => m.weekNumber === weekNumber);
}
