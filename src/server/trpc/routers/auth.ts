import { publicProcedure, router } from '../init';

/**
 * Auth procedures
 */
export const authRouter = router({
  /**
   * Get current session
   */
  getSession: publicProcedure.query(({ ctx }) => {
    return {
      user: ctx.user,
    };
  }),

  /**
   * Sign out
   */
  signOut: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) {
      throw new Error('Not authenticated');
    }

    await ctx.supabase.auth.signOut();
    return { success: true };
  }),

  /**
   * Get user profile (to be implemented with database)
   */
  getProfile: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null;
    }

    // TODO: Fetch from database once schema is set up
    return {
      id: ctx.user.id,
      email: ctx.user.email,
    };
  }),
});
