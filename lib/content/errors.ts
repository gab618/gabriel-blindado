export class ContentError extends Error {
  public readonly filePath: string;
  public readonly issues?: Array<{ path: string; message: string }>;

  constructor(
    filePath: string,
    message: string,
    issues?: Array<{ path: string; message: string }>
  ) {
    const formattedIssues =
      issues && issues.length > 0
        ? `\n  - ${issues.map((i) => `[${i.path}]: ${i.message}`).join('\n  - ')}`
        : '';
    super(`[ContentError] Em "${filePath}": ${message}${formattedIssues}`);
    this.name = 'ContentError';
    this.filePath = filePath;
    this.issues = issues;
  }
}
