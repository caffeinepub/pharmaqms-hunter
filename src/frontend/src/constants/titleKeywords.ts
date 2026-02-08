export const TITLE_KEYWORDS = [
  'Quality Specialist',
  'QMS',
  'Market Complaints',
  'Product Compliance',
  'Complaint Handling',
  'Investigation',
  'Deviation',
  'GMP',
  'Regulatory Compliance',
  'Change Control',
  'Stability',
  'Risk Assessment',
  'Executive',
  'Senior Executive',
  'Specialist',
  'Corporate quality assurance',
  'Audit Compliance',
];

export function containsTitleKeyword(title: string): boolean {
  const normalizedTitle = title.toLowerCase();
  return TITLE_KEYWORDS.some((keyword) =>
    normalizedTitle.includes(keyword.toLowerCase())
  );
}
