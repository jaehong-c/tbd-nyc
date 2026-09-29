// Topic definitions for NYC Wire. Each topic is a set of news-search queries;
// results are merged, de-duplicated and sorted newest first. Editing the
// queries here is the only tuning the module needs.
export const TOPICS = [
  {
    key: "conversions",
    name: "Conversions",
    hint: "Office-to-residential, 467-m, adaptive reuse, repositioning",
    queries: [
      '"New York" "office to residential" conversion',
      'Manhattan "office conversion" OR "residential conversion" OR "467-m"',
      'NYC "adaptive reuse" OR repositioning office building',
    ],
  },
  {
    key: "policy",
    name: "Zoning and policy",
    hint: "City of Yes, rezonings, ULURP, 485-x, tax incentives, City Planning",
    queries: [
      'NYC zoning "City of Yes" OR rezoning OR ULURP',
      '"New York" "485-x" OR "tax abatement" OR "housing policy" development',
      '"City Planning Commission" OR "Department of City Planning" New York',
    ],
  },
  {
    key: "deals",
    name: "Deals",
    hint: "Sales, financings, joint ventures, distressed office, land",
    queries: [
      'Manhattan office building sale OR "sells for" OR acquisition',
      '"New York" development site sale OR "land deal" OR "joint venture"',
      'NYC "construction loan" OR refinancing OR "distressed" office',
    ],
  },
  {
    key: "infrastructure",
    name: "Infrastructure",
    hint: "Transit, Con Edison, resiliency, Penn Station, Gateway, Hudson Yards",
    queries: [
      '"New York" transit OR MTA OR "Penn Station" development',
      'NYC "Con Edison" OR resiliency OR flood infrastructure development',
      'Manhattan "Hudson Yards" OR "Gateway" OR "Second Avenue subway"',
    ],
  },
];

export function topicByKey(key) {
  return TOPICS.find((t) => t.key === key);
}
