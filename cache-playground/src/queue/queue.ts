const queue: (() => Promise<void>)[] = [];

setInterval(async () => {
  if (!queue.length) return;

  const job = queue.shift();
  console.log("🟡 Async DB write...");
  if (job) await job();
}, 3000);

export const writeQueue = {
  enqueue(job: () => Promise<void>) {
    queue.push(job);
  }
};