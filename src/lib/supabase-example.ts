import { supabase } from './supabase';

// Example functions for using Supabase in your components

// Example: Fetch user data
export async function getUserData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Example: Save social interaction data
export async function saveSocialInteraction(interaction: {
  type: string;
  content: string;
  analysis: string;
  confidence: number;
  userId: string;
}) {
  try {
    const { data, error } = await supabase
      .from('social_interactions')
      .insert([interaction])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving social interaction:', error);
    return null;
  }
}

// Example: Get user's social interaction history
export async function getSocialHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('social_interactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching social history:', error);
    return [];
  }
}

// Example: Update user preferences
export async function updateUserPreferences(userId: string, preferences: any) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...preferences })
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating preferences:', error);
    return null;
  }
}
