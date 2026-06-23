import { inngest } from '@/features/inngest/client';

export const processTask = inngest.createFunction(
  { id: 'process-task', triggers: { event: 'app/task.created' } },
  async ({ event, step }) => {
    const result = await step.run('handle-task', async () => {
      return { processed: true, id: event.data.id };
    });

    await step.sleep('pause', '1s');
    return { message: `Task ${event.data.id} complete`, result };
  },
);

export const greetFunc = inngest.createFunction(
  { id: 'greet', triggers: { event: 'app/greet' } },
  async ({ event, step }) => {
    await step.run('greet', async () => {
      return { processed: true, id: event.data };
    });

    return {
      message: `Hello ${event.data?.name} from ${event.data?.from} and my age is ${event.data?.age} AND HELLO ${event.data.home}`,
    };
  },
);
