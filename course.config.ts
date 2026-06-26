export interface CourseSection {
  label: string;
  directory: string;
  showInIndex?: boolean;
  indexLabel?: string;
  showInPdf?: boolean;
}

export const courseSections: CourseSection[] = [
  {
    label: "Preface",
    directory: "preface",
  },
  {
    label: "Part.1",
    directory: "part.1",
    showInIndex: true,
    indexLabel: "Part 1",
    showInPdf: true,
  },
  {
    label: "Part.2",
    directory: "part.2",
    showInIndex: true,
    indexLabel: "Part 2",
    showInPdf: true,
  },
  {
    label: "Tutorials",
    directory: "tutorials",
    showInPdf: true,
  },
];

export function courseDirectoryToRouteSegment(directory: string) {
  return directory.replace(/\./g, "");
}
