import { Proposal } from '../types';
import { supabase } from '../lib/supabase';

export const proposalService = {
  saveProposal: async (proposal: Omit<Proposal, 'id' | 'submittedAt' | 'status'>): Promise<Proposal> => {
    const newProposal = {
      ...proposal,
      fundingAmount: Number(proposal.fundingAmount), // Ensure it's a number for the DB
      submittedAt: new Date().toISOString(),
      status: 'pending' as const
    };
    
    const { data, error } = await supabase
      .from('proposals')
      .insert([newProposal])
      .select()
      .single();

    if (error) {
      console.error('Error saving proposal:', error);
      throw error;
    }
    
    return data as Proposal;
  },

  getProposals: async (): Promise<Proposal[]> => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('submittedAt', { ascending: false });

    if (error) {
      console.error('Error fetching proposals:', error);
      return [];
    }
    
    return data as Proposal[];
  },

  updateStatus: async (id: string, status: Proposal['status']): Promise<void> => {
    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },

  updateAIReview: async (id: string, review: string): Promise<void> => {
    const { error } = await supabase
      .from('proposals')
      .update({ aiReview: review })
      .eq('id', id);

    if (error) {
      console.error('Error updating AI review:', error);
      throw error;
    }
  },

  deleteProposal: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting proposal:', error);
      throw error;
    }
  }
};