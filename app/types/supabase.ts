import { MergeDeep } from 'type-fest'
import { Database as DatabaseGenerated, Json } from './supabase.autogen'
import { Guess } from './app'

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        daily_results: {
          Row: {
            results: {
              guesses: Guess[]
            }
          }
          Insert: {
            results: {
              guesses: Guess[]
            }
          }
          Update: {
            results?: {
              guesses: Guess[]
            }
          }
        }
      }
    }
  }
>