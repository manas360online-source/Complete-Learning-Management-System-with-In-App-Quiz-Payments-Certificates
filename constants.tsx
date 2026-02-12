
import { NLPModule, ModuleLevel } from './types';

export const NLP_MODULES: NLPModule[] = [
  {
    id: 1,
    code: 'ATMT_0.1',
    title: 'NLP Orientation',
    description: 'Foundation module covering NLP basics and clinical ethics. Mandatory for all tracks.',
    level: ModuleLevel.INTRODUCTION,
    price: 0,
    early_bird_price: 0,
    prerequisite_modules: [],
    unlocks_modules: ['ATMT_1'],
    passing_score: 80,
    display_order: 1,
    narration_url: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
    quiz_questions: [
      {
        id: 'q1',
        question: 'What is the primary goal of the MindFlow Orientation?',
        options: ['Selling products', 'Establishing ethical clinical boundaries', 'Learning to code', 'Counting breathing cycles'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'Which is a core pillar of professional NLP?',
        options: ['Rapport', 'Sensory Awareness', 'Outcome Thinking', 'All of the above'],
        correctAnswer: 3
      }
    ]
  },
  {
    id: 2,
    code: 'ATMT_1',
    title: '5Why Empathy Framework',
    description: 'The mandatory core of the certification. Master root-cause empathy mapping.',
    level: ModuleLevel.MANDATORY,
    price: 399,
    early_bird_price: 319,
    prerequisite_modules: ['ATMT_0.1'],
    unlocks_modules: ['ATMT_2', 'ATMT_3', 'ATMT_4', 'ATMT_5', 'ATMT_6'],
    passing_score: 80,
    display_order: 2,
    quiz_questions: [
      {
        id: 'q1',
        question: 'In the 5Why framework, "Why" is asked to...',
        options: ['Annoy the client', 'Peel back layers of superficial defense', 'Delay the session', 'Test the therapist\'s memory'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'Which level of "Why" usually reveals core identity drivers?',
        options: ['The first', 'The second', 'Levels 4 and 5', 'None of them'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 3,
    code: 'ATMT_2',
    title: 'Reframing Techniques',
    description: 'Advanced specialization in cognitive shift and perspective transformation.',
    level: ModuleLevel.SPECIALIZATION,
    price: 299,
    early_bird_price: 239,
    prerequisite_modules: ['ATMT_1'],
    unlocks_modules: [],
    passing_score: 80,
    display_order: 3,
    quiz_questions: [
      {
        id: 'q1',
        question: 'What is the "Context Reframe"?',
        options: ['Changing the meaning of the event', 'Finding a setting where a behavior is useful', 'Ignoring the context entirely', 'Moving the session outdoors'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 4,
    code: 'ATMT_3',
    title: 'Anchoring & State Control',
    description: 'Clinical specialization in neuro-associative state management.',
    level: ModuleLevel.SPECIALIZATION,
    price: 399,
    early_bird_price: 319,
    prerequisite_modules: ['ATMT_1'],
    unlocks_modules: [],
    passing_score: 80,
    display_order: 4,
    quiz_questions: [
      {
        id: 'q1',
        question: 'An NLP anchor is successfully set when...',
        options: ['The client is bored', 'Stimulus and high-intensity state are linked', 'The session ends', 'The client falls asleep'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 5,
    code: 'ATMT_4',
    title: 'Submodalities Mastery',
    description: 'Fine-tuning internal representations for lasting psychological change.',
    level: ModuleLevel.SPECIALIZATION,
    price: 499,
    early_bird_price: 399,
    prerequisite_modules: ['ATMT_1'],
    unlocks_modules: [],
    passing_score: 80,
    display_order: 5,
    quiz_questions: [
      {
        id: 'q1',
        question: 'Changing an internal image from color to black-and-white is a change in...',
        options: ['Digital content', 'Submodalities', 'External reality', 'Physical vision'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 6,
    code: 'ATMT_5',
    title: 'Timeline Therapy',
    description: 'Specialization in encoding time and healing past trauma footprints.',
    level: ModuleLevel.SPECIALIZATION,
    price: 499,
    early_bird_price: 399,
    prerequisite_modules: ['ATMT_1'],
    unlocks_modules: [],
    passing_score: 80,
    display_order: 6,
    quiz_questions: [
      {
        id: 'q1',
        question: 'Timeline therapy primarily works by...',
        options: ['Buying a new watch', 'Changing the internal location of past/future events', 'Predicting the future', 'Writing a biography'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 7,
    code: 'ATMT_6',
    title: 'Neuro Associative Conditioning',
    description: 'The final specialization track for behavioral neuro-patterning.',
    level: ModuleLevel.SPECIALIZATION,
    price: 499,
    early_bird_price: 399,
    prerequisite_modules: ['ATMT_1'],
    unlocks_modules: [],
    passing_score: 80,
    display_order: 7,
    quiz_questions: [
      {
        id: 'q1',
        question: 'NAC focuses on creating change by...',
        options: ['Willpower alone', 'Conditioning new neural pathways via intensity', 'Reading more books', 'Taking notes'],
        correctAnswer: 1
      }
    ]
  }
];

export const BUNDLES = [
  {
    id: 'foundation',
    title: 'Foundation Access',
    price: 399,
    savings: 0,
    description: 'ATMT 1 (Core Empathy Framework)',
    modules: ['ATMT_1']
  },
  {
    id: 'professional',
    title: 'Professional Track',
    price: 1499,
    savings: 97,
    description: 'ATMT 1 + Choose 3 Specializations',
    modules: ['ATMT_1', 'ATMT_2', 'ATMT_3', 'ATMT_4']
  },
  {
    id: 'master',
    title: 'Master Certification',
    price: 1999,
    savings: 595,
    description: 'Full Clinical Registry Access (ATMT 1-6)',
    modules: ['ATMT_1', 'ATMT_2', 'ATMT_3', 'ATMT_4', 'ATMT_5', 'ATMT_6']
  }
];
