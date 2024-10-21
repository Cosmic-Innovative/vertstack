interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: unknown;
}

class Logger {
  private logQueue: LogEntry[] = [];

  private log(entry: LogEntry) {
    this.logQueue.push(entry);
    this.processQueue();
  }

  info(message: string, details?: unknown) {
    this.log({ level: 'info', message, details });
  }

  warn(message: string, details?: unknown) {
    this.log({ level: 'warn', message, details });
  }

  error(message: string, details?: unknown) {
    this.log({ level: 'error', message, details });
  }

  private async processQueue() {
    if (this.logQueue.length === 0) return;

    const batch = this.logQueue.splice(0, 10); // Process up to 10 logs at a time

    try {
      // In a real application, you would send these logs to your logging service
      // For now, we'll just console.log them
      batch.forEach((entry) => {
        console[entry.level](entry.message, entry.details);
      });

      // Simulate sending logs to a server
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(batch),
      // });
    } catch (error) {
      console.error('Failed to send logs:', error);
      // Re-add failed logs to the queue
      this.logQueue.unshift(...batch);
    }
  }
}

export const logger = new Logger();
