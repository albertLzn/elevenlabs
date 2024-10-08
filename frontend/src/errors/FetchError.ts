export class FetchError extends Error {
  public status: number;

  public statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.statusText = statusText;
  }
}
