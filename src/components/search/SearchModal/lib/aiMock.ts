export interface AIResponseSegment {
  text: string;
  linked?: boolean;
  entityId?: string;
}

export interface MockAIResponse {
  segments: AIResponseSegment[];
  entityIds: string[];
  entityLabel: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMockAIResponse(query: string): MockAIResponse {
  return {
    segments: [
      { text: 'Kemi Adeyemi leads your team with 14 active listings, followed by ' },
      { text: 'Yemi Daniels (11)', linked: true, entityId: 'A004' },
      { text: ' and Tunde Bello (9). All three are currently active. Amara Okonkwo has 7 listings but is on leave under Abuja Central.' },
    ],
    entityIds: ['A001', 'A004', 'A002', 'A003'],
    entityLabel: 'Agents',
  };
}
