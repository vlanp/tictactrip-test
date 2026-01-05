import z from "zod/v4";

const ZEmail = z.strictObject({
  email: z.email(),
});

type IEmail = z.infer<typeof ZEmail>;

export { ZEmail };
export type { IEmail };
