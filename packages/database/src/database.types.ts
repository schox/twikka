export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          active: boolean
          created_at: string
          id: string
          name: string
          owner: string | null
          seat_count: number
          seat_limit: number | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          active?: boolean
          created_at?: string
          id?: string
          name: string
          owner?: string | null
          seat_count?: number
          seat_limit?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          owner?: string | null
          seat_count?: number
          seat_limit?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "v_user_profile_with_account_and_subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      argument: {
        Row: {
          belief_id: number
          boundaries: string | null
          created_at: string
          embedding: string | null
          id: number
          is_primary: boolean | null
          thesis: string
          updated_at: string
        }
        Insert: {
          belief_id: number
          boundaries?: string | null
          created_at?: string
          embedding?: string | null
          id?: never
          is_primary?: boolean | null
          thesis: string
          updated_at?: string
        }
        Update: {
          belief_id?: number
          boundaries?: string | null
          created_at?: string
          embedding?: string | null
          id?: never
          is_primary?: boolean | null
          thesis?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "argument_belief_id_fkey"
            columns: ["belief_id"]
            isOneToOne: false
            referencedRelation: "belief"
            referencedColumns: ["id"]
          },
        ]
      }
      argument_journey_stage: {
        Row: {
          argument_id: number
          created_at: string
          is_primary: boolean | null
          journey_stage_id: number
          notes: string | null
          strength: number | null
        }
        Insert: {
          argument_id: number
          created_at?: string
          is_primary?: boolean | null
          journey_stage_id: number
          notes?: string | null
          strength?: number | null
        }
        Update: {
          argument_id?: number
          created_at?: string
          is_primary?: boolean | null
          journey_stage_id?: number
          notes?: string | null
          strength?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "argument_journey_stage_argument_id_fkey"
            columns: ["argument_id"]
            isOneToOne: false
            referencedRelation: "argument"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "argument_journey_stage_journey_stage_id_fkey"
            columns: ["journey_stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stage"
            referencedColumns: ["id"]
          },
        ]
      }
      author: {
        Row: {
          bio: string | null
          brand: number | null
          created_at: string
          first_name: string | null
          id: number
          image: string | null
          last_name: string | null
          persona: string | null
        }
        Insert: {
          bio?: string | null
          brand?: number | null
          created_at?: string
          first_name?: string | null
          id?: number
          image?: string | null
          last_name?: string | null
          persona?: string | null
        }
        Update: {
          bio?: string | null
          brand?: number | null
          created_at?: string
          first_name?: string | null
          id?: number
          image?: string | null
          last_name?: string | null
          persona?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "author_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      awareness: {
        Row: {
          created_at: string
          description: string | null
          id: number
          stage: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          stage?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          stage?: string | null
        }
        Relationships: []
      }
      belief: {
        Row: {
          brand: number | null
          created_at: string
          embedding: string | null
          id: number
          metadata: Json | null
          product: number | null
          replace_with: number | null
          status: Database["public"]["Enums"]["belief_status"] | null
          title: string | null
          type: Database["public"]["Enums"]["belief_type"] | null
          updated_at: string | null
        }
        Insert: {
          brand?: number | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
          product?: number | null
          replace_with?: number | null
          status?: Database["public"]["Enums"]["belief_status"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["belief_type"] | null
          updated_at?: string | null
        }
        Update: {
          brand?: number | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
          product?: number | null
          replace_with?: number | null
          status?: Database["public"]["Enums"]["belief_status"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["belief_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "belief_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "belief_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "belief_replace_with_fkey"
            columns: ["replace_with"]
            isOneToOne: false
            referencedRelation: "belief"
            referencedColumns: ["id"]
          },
        ]
      }
      belief_awareness: {
        Row: {
          awareness: number | null
          belief: number | null
          created_at: string
          id: number
        }
        Insert: {
          awareness?: number | null
          belief?: number | null
          created_at?: string
          id?: number
        }
        Update: {
          awareness?: number | null
          belief?: number | null
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "belief_awareness_awareness_fkey"
            columns: ["awareness"]
            isOneToOne: false
            referencedRelation: "awareness"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "belief_awareness_belief_fkey"
            columns: ["belief"]
            isOneToOne: false
            referencedRelation: "belief"
            referencedColumns: ["id"]
          },
        ]
      }
      belief_journey_stage: {
        Row: {
          belief_id: number
          created_at: string
          is_primary: boolean | null
          journey_stage_id: number
          notes: string | null
          strength: number | null
        }
        Insert: {
          belief_id: number
          created_at?: string
          is_primary?: boolean | null
          journey_stage_id: number
          notes?: string | null
          strength?: number | null
        }
        Update: {
          belief_id?: number
          created_at?: string
          is_primary?: boolean | null
          journey_stage_id?: number
          notes?: string | null
          strength?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "belief_journey_stage_belief_id_fkey"
            columns: ["belief_id"]
            isOneToOne: false
            referencedRelation: "belief"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "belief_journey_stage_journey_stage_id_fkey"
            columns: ["journey_stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stage"
            referencedColumns: ["id"]
          },
        ]
      }
      belief_lightbulb: {
        Row: {
          belief: number | null
          created_at: string
          id: number
          lightbulb: number | null
        }
        Insert: {
          belief?: number | null
          created_at?: string
          id?: number
          lightbulb?: number | null
        }
        Update: {
          belief?: number | null
          created_at?: string
          id?: number
          lightbulb?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "belief_lightbulb_belief_fkey"
            columns: ["belief"]
            isOneToOne: false
            referencedRelation: "belief"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "belief_lightbulb_lightbulb_fkey"
            columns: ["lightbulb"]
            isOneToOne: false
            referencedRelation: "lightbulb"
            referencedColumns: ["id"]
          },
        ]
      }
      belief_topic: {
        Row: {
          belief_id: number
          created_at: string
          is_primary: boolean | null
          notes: string | null
          strength: number | null
          topic_id: number
        }
        Insert: {
          belief_id: number
          created_at?: string
          is_primary?: boolean | null
          notes?: string | null
          strength?: number | null
          topic_id: number
        }
        Update: {
          belief_id?: number
          created_at?: string
          is_primary?: boolean | null
          notes?: string | null
          strength?: number | null
          topic_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "belief_topic_belief_id_fkey"
            columns: ["belief_id"]
            isOneToOne: false
            referencedRelation: "belief"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "belief_topic_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_category: {
        Row: {
          brand: number
          created_at: string | null
          description: string | null
          id: number
          name: string
          show_in_blog: boolean
          slug: string
          updated_at: string | null
        }
        Insert: {
          brand: number
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          show_in_blog?: boolean
          slug: string
          updated_at?: string | null
        }
        Update: {
          brand?: number
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          show_in_blog?: boolean
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_category_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_domain: {
        Row: {
          blog_config: Json | null
          brand: number
          created_at: string | null
          domain: string
          id: number
          is_active: boolean | null
          theme_config: Json | null
          updated_at: string | null
        }
        Insert: {
          blog_config?: Json | null
          brand: number
          created_at?: string | null
          domain: string
          id?: number
          is_active?: boolean | null
          theme_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          blog_config?: Json | null
          brand?: number
          created_at?: string | null
          domain?: string
          id?: number
          is_active?: boolean | null
          theme_config?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_domain_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post: {
        Row: {
          author_id: number
          brand: number
          content: string
          content_html: string | null
          cover_image_alt: string | null
          cover_image_url: string | null
          created_at: string | null
          embedding: string | null
          excerpt: string
          featured: boolean | null
          id: number
          lexical_content: Json | null
          migrated_from_import_id: number | null
          published_at: string | null
          search_vector: unknown
          slug: string
          source_content_id: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: number
          brand: number
          content: string
          content_html?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          embedding?: string | null
          excerpt: string
          featured?: boolean | null
          id?: number
          lexical_content?: Json | null
          migrated_from_import_id?: number | null
          published_at?: string | null
          search_vector?: unknown
          slug: string
          source_content_id?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: number
          brand?: number
          content?: string
          content_html?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          embedding?: string | null
          excerpt?: string
          featured?: boolean | null
          id?: number
          lexical_content?: Json | null
          migrated_from_import_id?: number | null
          published_at?: string | null
          search_vector?: unknown
          slug?: string
          source_content_id?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_source_content_id_fkey"
            columns: ["source_content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_category: {
        Row: {
          category_id: number
          created_at: string | null
          is_primary: boolean | null
          post_id: number
        }
        Insert: {
          category_id: number
          created_at?: string | null
          is_primary?: boolean | null
          post_id: number
        }
        Update: {
          category_id?: number
          created_at?: string | null
          is_primary?: boolean | null
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_category_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_post"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tag: {
        Row: {
          post_id: number
          tag_id: number
        }
        Insert: {
          post_id: number
          tag_id: number
        }
        Update: {
          post_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tag_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tag"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_topic: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          post_id: number
          topic_id: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          post_id: number
          topic_id: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          post_id?: number
          topic_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_topic_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_topic_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tag: {
        Row: {
          brand: number
          created_at: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          brand: number
          created_at?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          brand?: number
          created_at?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_tag_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      bot: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      bot_user: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: number
          last_name: string
          mobile: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: number
          last_name: string
          mobile: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          mobile?: string
        }
        Relationships: []
      }
      bot_user_bot: {
        Row: {
          bot: number
          bot_user: number
          created_at: string
          id: number
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          bot: number
          bot_user: number
          created_at?: string
          id?: number
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          bot?: number
          bot_user?: number
          created_at?: string
          id?: number
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "bot_user_bot_bot_fkey"
            columns: ["bot"]
            isOneToOne: false
            referencedRelation: "bot"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_user_bot_bot_user_fkey"
            columns: ["bot_user"]
            isOneToOne: false
            referencedRelation: "bot_user"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_user_service: {
        Row: {
          api_key: string | null
          bot_user_bot: number
          created_at: string
          id: number
          service: string
        }
        Insert: {
          api_key?: string | null
          bot_user_bot: number
          created_at?: string
          id?: number
          service: string
        }
        Update: {
          api_key?: string | null
          bot_user_bot?: number
          created_at?: string
          id?: number
          service?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_user_service_bot_user_bot_fkey"
            columns: ["bot_user_bot"]
            isOneToOne: false
            referencedRelation: "bot_user_bot"
            referencedColumns: ["id"]
          },
        ]
      }
      brand: {
        Row: {
          account: string | null
          brand_personality: string | null
          created_at: string
          id: number
          name: string | null
          persona: string | null
          point_of_view: string | null
          theme_config: Json | null
        }
        Insert: {
          account?: string | null
          brand_personality?: string | null
          created_at?: string
          id?: number
          name?: string | null
          persona?: string | null
          point_of_view?: string | null
          theme_config?: Json | null
        }
        Update: {
          account?: string | null
          brand_personality?: string | null
          created_at?: string
          id?: number
          name?: string | null
          persona?: string | null
          point_of_view?: string | null
          theme_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_user: {
        Row: {
          brand: number | null
          created_at: string
          id: number
          user: string | null
        }
        Insert: {
          brand?: number | null
          created_at?: string
          id?: number
          user?: string | null
        }
        Update: {
          brand?: number | null
          created_at?: string
          id?: number
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_user_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_user_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_user_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "v_user_profile_with_account_and_subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_claim: {
        Row: {
          canonical_id: number
          claim_id: number
          created_at: string | null
        }
        Insert: {
          canonical_id: number
          claim_id: number
          created_at?: string | null
        }
        Update: {
          canonical_id?: number
          claim_id?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canonical_claim_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_claim_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_message: {
        Row: {
          canonical_id: number
          created_at: string | null
          message_id: number
        }
        Insert: {
          canonical_id: number
          created_at?: string | null
          message_id: number
        }
        Update: {
          canonical_id?: number
          created_at?: string | null
          message_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "canonical_message_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_message_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "message"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_topic: {
        Row: {
          canonical_id: number
          created_at: string | null
          is_primary: boolean | null
          notes: string | null
          strength: number | null
          topic_id: number
        }
        Insert: {
          canonical_id: number
          created_at?: string | null
          is_primary?: boolean | null
          notes?: string | null
          strength?: number | null
          topic_id: number
        }
        Update: {
          canonical_id?: number
          created_at?: string | null
          is_primary?: boolean | null
          notes?: string | null
          strength?: number | null
          topic_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "canonical_topic_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_topic_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
        ]
      }
      canonical_version: {
        Row: {
          canonical_id: number
          change_reason: string | null
          content_html: string | null
          content_snapshot: Json
          created_at: string | null
          created_by: string | null
          id: number
          version_number: number
        }
        Insert: {
          canonical_id: number
          change_reason?: string | null
          content_html?: string | null
          content_snapshot: Json
          created_at?: string | null
          created_by?: string | null
          id?: number
          version_number: number
        }
        Update: {
          canonical_id?: number
          change_reason?: string | null
          content_html?: string | null
          content_snapshot?: Json
          created_at?: string | null
          created_by?: string | null
          id?: number
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "canonical_version_canonical_id_fkey"
            columns: ["canonical_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_version_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canonical_version_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_profile_with_account_and_subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      claim: {
        Row: {
          brand_id: number
          claim_text: string
          confidence_level:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          created_at: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          scope: string | null
          status: Database["public"]["Enums"]["claim_status"] | null
          updated_at: string | null
        }
        Insert: {
          brand_id: number
          claim_text: string
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          created_at?: string | null
          embedding?: string | null
          id?: never
          metadata?: Json | null
          scope?: string | null
          status?: Database["public"]["Enums"]["claim_status"] | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: number
          claim_text?: string
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          created_at?: string | null
          embedding?: string | null
          id?: never
          metadata?: Json | null
          scope?: string | null
          status?: Database["public"]["Enums"]["claim_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_question: {
        Row: {
          claim_id: number
          created_at: string | null
          question_id: number
          relevance: string | null
        }
        Insert: {
          claim_id: number
          created_at?: string | null
          question_id: number
          relevance?: string | null
        }
        Update: {
          claim_id?: number
          created_at?: string | null
          question_id?: number
          relevance?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_question_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_question_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_reference: {
        Row: {
          claim_id: number
          created_at: string | null
          excerpt: string | null
          notes: string | null
          page_reference: string | null
          quality_tier:
            | Database["public"]["Enums"]["evidence_quality_tier"]
            | null
          reference_id: number
          strength: number | null
          supports: boolean
        }
        Insert: {
          claim_id: number
          created_at?: string | null
          excerpt?: string | null
          notes?: string | null
          page_reference?: string | null
          quality_tier?:
            | Database["public"]["Enums"]["evidence_quality_tier"]
            | null
          reference_id: number
          strength?: number | null
          supports: boolean
        }
        Update: {
          claim_id?: number
          created_at?: string | null
          excerpt?: string | null
          notes?: string | null
          page_reference?: string | null
          quality_tier?:
            | Database["public"]["Enums"]["evidence_quality_tier"]
            | null
          reference_id?: number
          strength?: number | null
          supports?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "claim_reference_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_reference_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "reference"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_reference_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "reference_with_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_topic: {
        Row: {
          claim_id: number
          created_at: string | null
          is_primary: boolean | null
          topic_id: number
        }
        Insert: {
          claim_id: number
          created_at?: string | null
          is_primary?: boolean | null
          topic_id: number
        }
        Update: {
          claim_id?: number
          created_at?: string | null
          is_primary?: boolean | null
          topic_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "claim_topic_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_topic_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor: {
        Row: {
          address: string | null
          brand: number | null
          created_at: string
          google_reviews: number | null
          google_score: number | null
          id: number
          latitude: number | null
          longitude: number | null
          name: string | null
          url: string | null
        }
        Insert: {
          address?: string | null
          brand?: number | null
          created_at?: string
          google_reviews?: number | null
          google_score?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          url?: string | null
        }
        Update: {
          address?: string | null
          brand?: number | null
          created_at?: string
          google_reviews?: number | null
          google_score?: number | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_id_link: {
        Row: {
          competitor: number | null
          created_at: string
          id: number
          identifier: number | null
        }
        Insert: {
          competitor?: number | null
          created_at?: string
          id?: number
          identifier?: number | null
        }
        Update: {
          competitor?: number | null
          created_at?: string
          id?: number
          identifier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_id_link_competitor_fkey"
            columns: ["competitor"]
            isOneToOne: false
            referencedRelation: "competitor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_id_link_identifier_fkey"
            columns: ["identifier"]
            isOneToOne: false
            referencedRelation: "competitor_identifier"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_identifier: {
        Row: {
          created_at: string
          id: number
          identifier: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          identifier?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          identifier?: string | null
        }
        Relationships: []
      }
      content: {
        Row: {
          asset_type: Database["public"]["Enums"]["content_asset_type"] | null
          at_id: number | null
          brand: number | null
          categories: string[] | null
          category_array: string | null
          content_long: string | null
          content_short: string | null
          content_standard: string | null
          created_at: string
          current_version: number | null
          description: string | null
          id: number
          idea: string | null
          image: string | null
          image_origin: string | null
          image_url: string | null
          modified_at: string | null
          organisation: string | null
          published: string | null
          references: string | null
          slug: string | null
          source_url: string | null
          source_url_name: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          tags: string[] | null
          title: string | null
        }
        Insert: {
          asset_type?: Database["public"]["Enums"]["content_asset_type"] | null
          at_id?: number | null
          brand?: number | null
          categories?: string[] | null
          category_array?: string | null
          content_long?: string | null
          content_short?: string | null
          content_standard?: string | null
          created_at?: string
          current_version?: number | null
          description?: string | null
          id?: number
          idea?: string | null
          image?: string | null
          image_origin?: string | null
          image_url?: string | null
          modified_at?: string | null
          organisation?: string | null
          published?: string | null
          references?: string | null
          slug?: string | null
          source_url?: string | null
          source_url_name?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title?: string | null
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["content_asset_type"] | null
          at_id?: number | null
          brand?: number | null
          categories?: string[] | null
          category_array?: string | null
          content_long?: string | null
          content_short?: string | null
          content_standard?: string | null
          created_at?: string
          current_version?: number | null
          description?: string | null
          id?: number
          idea?: string | null
          image?: string | null
          image_origin?: string | null
          image_url?: string | null
          modified_at?: string | null
          organisation?: string | null
          published?: string | null
          references?: string | null
          slug?: string | null
          source_url?: string | null
          source_url_name?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_inbox_product_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      content_category: {
        Row: {
          brand: number | null
          category: string | null
          created_at: string
          id: number
        }
        Insert: {
          brand?: number | null
          category?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          brand?: number | null
          category?: string | null
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "category_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_product_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      content_media: {
        Row: {
          content: number
          created_at: string
          current: boolean
          id: number
          media: number
        }
        Insert: {
          content: number
          created_at?: string
          current?: boolean
          id?: number
          media: number
        }
        Update: {
          content?: number
          created_at?: string
          current?: boolean
          id?: number
          media?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_media_content_fkey"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_media_media_fkey"
            columns: ["media"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      content_message: {
        Row: {
          content: number | null
          created_at: string
          id: number
          message: number | null
        }
        Insert: {
          content?: number | null
          created_at?: string
          id?: number
          message?: number | null
        }
        Update: {
          content?: number | null
          created_at?: string
          id?: number
          message?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_message_content_fkey"
            columns: ["content"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_message_message_fkey"
            columns: ["message"]
            isOneToOne: false
            referencedRelation: "message_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      dbg_log: {
        Row: {
          created_at: string
          id: number
          json: Json | null
          message: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          json?: Json | null
          message?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          json?: Json | null
          message?: string | null
        }
        Relationships: []
      }
      derived_asset: {
        Row: {
          author_id: number | null
          brand: number
          canonical_version_id: number | null
          content: Json
          cover_image_alt: string | null
          cover_image_url: string | null
          created_at: string | null
          embedding: string | null
          excerpt: string | null
          format: Database["public"]["Enums"]["derived_asset_format"]
          id: number
          published_at: string | null
          search_vector: unknown
          slug: string | null
          source_blog_post_id: number | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: number | null
          brand: number
          canonical_version_id?: number | null
          content?: Json
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          embedding?: string | null
          excerpt?: string | null
          format: Database["public"]["Enums"]["derived_asset_format"]
          id?: number
          published_at?: string | null
          search_vector?: unknown
          slug?: string | null
          source_blog_post_id?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: number | null
          brand?: number
          canonical_version_id?: number | null
          content?: Json
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          embedding?: string | null
          excerpt?: string | null
          format?: Database["public"]["Enums"]["derived_asset_format"]
          id?: number
          published_at?: string | null
          search_vector?: unknown
          slug?: string | null
          source_blog_post_id?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "derived_asset_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "derived_asset_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "derived_asset_canonical_version_id_fkey"
            columns: ["canonical_version_id"]
            isOneToOne: false
            referencedRelation: "canonical_version"
            referencedColumns: ["id"]
          },
        ]
      }
      derived_asset_media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          derived_asset_id: number
          is_primary: boolean | null
          media_id: number
          position: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          derived_asset_id: number
          is_primary?: boolean | null
          media_id: number
          position?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          derived_asset_id?: number
          is_primary?: boolean | null
          media_id?: number
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "derived_asset_media_derived_asset_id_fkey"
            columns: ["derived_asset_id"]
            isOneToOne: false
            referencedRelation: "derived_asset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "derived_asset_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      job: {
        Row: {
          brand_id: number
          callback_url: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          external_id: string | null
          id: number
          job_name: string | null
          job_type: string
          max_retries: number
          payload: Json
          priority: number
          result: Json | null
          retry_count: number
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"]
        }
        Insert: {
          brand_id: number
          callback_url?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: never
          job_name?: string | null
          job_type: string
          max_retries?: number
          payload?: Json
          priority?: number
          result?: Json | null
          retry_count?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
        }
        Update: {
          brand_id?: number
          callback_url?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: never
          job_name?: string | null
          job_type?: string
          max_retries?: number
          payload?: Json
          priority?: number
          result?: Json | null
          retry_count?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
        }
        Relationships: [
          {
            foreignKeyName: "job_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_profile_with_account_and_subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_stage: {
        Row: {
          brand_id: number
          created_at: string
          description: string | null
          id: number
          name: string
          stage_order: number
          updated_at: string
        }
        Insert: {
          brand_id: number
          created_at?: string
          description?: string | null
          id?: never
          name: string
          stage_order?: number
          updated_at?: string
        }
        Update: {
          brand_id?: number
          created_at?: string
          description?: string | null
          id?: never
          name?: string
          stage_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_stage_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      lightbulb: {
        Row: {
          business_perspective: string | null
          created_at: string
          customer_belief: string | null
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          business_perspective?: string | null
          created_at?: string
          customer_belief?: string | null
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          business_perspective?: string | null
          created_at?: string
          customer_belief?: string | null
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          brand: number | null
          bucket_url: string | null
          created_at: string
          description: string | null
          file_name: string | null
          id: number
          keywords: string | null
          size: number | null
          source_url: string | null
          type: Database["public"]["Enums"]["media_type"] | null
        }
        Insert: {
          brand?: number | null
          bucket_url?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          id?: number
          keywords?: string | null
          size?: number | null
          source_url?: string | null
          type?: Database["public"]["Enums"]["media_type"] | null
        }
        Update: {
          brand?: number | null
          bucket_url?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          id?: number
          keywords?: string | null
          size?: number | null
          source_url?: string | null
          type?: Database["public"]["Enums"]["media_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "media_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      message: {
        Row: {
          argument_id: number
          created_at: string
          expression: string
          id: number
          journey_stage_id: number | null
          updated_at: string
        }
        Insert: {
          argument_id: number
          created_at?: string
          expression: string
          id?: never
          journey_stage_id?: number | null
          updated_at?: string
        }
        Update: {
          argument_id?: number
          created_at?: string
          expression?: string
          id?: never
          journey_stage_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_argument_id_fkey"
            columns: ["argument_id"]
            isOneToOne: false
            referencedRelation: "argument"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_journey_stage_id_fkey"
            columns: ["journey_stage_id"]
            isOneToOne: false
            referencedRelation: "journey_stage"
            referencedColumns: ["id"]
          },
        ]
      }
      message_awareness: {
        Row: {
          awareness: number | null
          created_at: string
          id: number
          message: number | null
        }
        Insert: {
          awareness?: number | null
          created_at?: string
          id?: number
          message?: number | null
        }
        Update: {
          awareness?: number | null
          created_at?: string
          id?: number
          message?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "message_awareness_awareness_fkey"
            columns: ["awareness"]
            isOneToOne: false
            referencedRelation: "awareness"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_awareness_message_fkey"
            columns: ["message"]
            isOneToOne: false
            referencedRelation: "message_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      message_belief: {
        Row: {
          belief: number | null
          created_at: string
          id: number
          message: number | null
        }
        Insert: {
          belief?: number | null
          created_at?: string
          id?: number
          message?: number | null
        }
        Update: {
          belief?: number | null
          created_at?: string
          id?: number
          message?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "message_belief_belief_fkey"
            columns: ["belief"]
            isOneToOne: false
            referencedRelation: "belief"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_belief_message_fkey"
            columns: ["message"]
            isOneToOne: false
            referencedRelation: "message_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      message_claim_proof: {
        Row: {
          claim: string | null
          claim_description: string | null
          created_at: string
          id: number
          message: number | null
          proof: string | null
          proof_description: string | null
        }
        Insert: {
          claim?: string | null
          claim_description?: string | null
          created_at?: string
          id?: number
          message?: number | null
          proof?: string | null
          proof_description?: string | null
        }
        Update: {
          claim?: string | null
          claim_description?: string | null
          created_at?: string
          id?: number
          message?: number | null
          proof?: string | null
          proof_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_proof_message_fkey"
            columns: ["message"]
            isOneToOne: false
            referencedRelation: "message_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      message_legacy: {
        Row: {
          brand: number | null
          created_at: string
          description: string | null
          id: number
          message: string | null
        }
        Insert: {
          brand?: number | null
          created_at?: string
          description?: string | null
          id?: number
          message?: string | null
        }
        Update: {
          brand?: number | null
          created_at?: string
          description?: string | null
          id?: number
          message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_product_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      message_lightbulb: {
        Row: {
          created_at: string
          id: number
          lightbulb: number | null
          message: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          lightbulb?: number | null
          message?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          lightbulb?: number | null
          message?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "message_lightbulb_lightbulb_fkey"
            columns: ["lightbulb"]
            isOneToOne: false
            referencedRelation: "lightbulb"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_lightbulb_message_fkey"
            columns: ["message"]
            isOneToOne: false
            referencedRelation: "message_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt: {
        Row: {
          created_at: string
          id: number
          name: string
          prompt: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          prompt: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          prompt?: string
        }
        Relationships: []
      }
      question: {
        Row: {
          brand_id: number
          context: string | null
          created_at: string | null
          id: number
          priority: number | null
          question_text: string
          status: Database["public"]["Enums"]["question_status"] | null
          updated_at: string | null
        }
        Insert: {
          brand_id: number
          context?: string | null
          created_at?: string | null
          id?: never
          priority?: number | null
          question_text: string
          status?: Database["public"]["Enums"]["question_status"] | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: number
          context?: string | null
          created_at?: string | null
          id?: never
          priority?: number | null
          question_text?: string
          status?: Database["public"]["Enums"]["question_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      question_topic: {
        Row: {
          created_at: string | null
          is_primary: boolean | null
          question_id: number
          topic_id: number
        }
        Insert: {
          created_at?: string | null
          is_primary?: boolean | null
          question_id: number
          topic_id: number
        }
        Update: {
          created_at?: string | null
          is_primary?: boolean | null
          question_id?: number
          topic_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_topic_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_topic_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
        ]
      }
      reference: {
        Row: {
          backlink_count: number
          brand: number
          canonical: boolean
          created_at: string
          date: string | null
          description: string | null
          enrichment_error: string | null
          enrichment_status: string | null
          id: number
          keywords: string[] | null
          last_enrichment_attempt: string | null
          linked_urls: Json[] | null
          process: boolean
          raw_content: string | null
          reference_count: number
          reference_type: string | null
          reference_url: string | null
          summary: string | null
          title: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          backlink_count?: number
          brand: number
          canonical?: boolean
          created_at?: string
          date?: string | null
          description?: string | null
          enrichment_error?: string | null
          enrichment_status?: string | null
          id?: number
          keywords?: string[] | null
          last_enrichment_attempt?: string | null
          linked_urls?: Json[] | null
          process?: boolean
          raw_content?: string | null
          reference_count?: number
          reference_type?: string | null
          reference_url?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          backlink_count?: number
          brand?: number
          canonical?: boolean
          created_at?: string
          date?: string | null
          description?: string | null
          enrichment_error?: string | null
          enrichment_status?: string | null
          id?: number
          keywords?: string[] | null
          last_enrichment_attempt?: string | null
          linked_urls?: Json[] | null
          process?: boolean
          raw_content?: string | null
          reference_count?: number
          reference_type?: string | null
          reference_url?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reference_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_collection: {
        Row: {
          brand: number
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          is_public: boolean
          name: string
          updated_at: string
        }
        Insert: {
          brand: number
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          is_public?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          brand?: number
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          is_public?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reference_collection_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_collection_item: {
        Row: {
          added_at: string
          added_by: string | null
          collection_id: number
          id: number
          notes: string | null
          reference_id: number
          sort_order: number | null
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          collection_id: number
          id?: number
          notes?: string | null
          reference_id: number
          sort_order?: number | null
        }
        Update: {
          added_at?: string
          added_by?: string | null
          collection_id?: number
          id?: number
          notes?: string | null
          reference_id?: number
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reference_collection_item_collection_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "reference_collection"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_collection_item_reference_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "reference"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_collection_item_reference_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "reference_with_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_reference: {
        Row: {
          created_at: string
          id: number
          source: number | null
          target: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          source?: number | null
          target?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          source?: number | null
          target?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reference_reference_source_fkey"
            columns: ["source"]
            isOneToOne: false
            referencedRelation: "reference"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_reference_source_fkey"
            columns: ["source"]
            isOneToOne: false
            referencedRelation: "reference_with_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_reference_target_fkey"
            columns: ["target"]
            isOneToOne: false
            referencedRelation: "reference"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_reference_target_fkey"
            columns: ["target"]
            isOneToOne: false
            referencedRelation: "reference_with_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_tag: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          reference_id: number
          tag_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          reference_id: number
          tag_id: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          reference_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reference_tag_reference_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "reference"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_tag_reference_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "reference_with_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reference_tag_tag_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription: {
        Row: {
          account: string | null
          billing_mode: Database["public"]["Enums"]["billing_mode"]
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: number
          plan_code: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_price_id: string | null
          stripe_subscription_item_id: string | null
          updated_at: string | null
        }
        Insert: {
          account?: string | null
          billing_mode?: Database["public"]["Enums"]["billing_mode"]
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: number
          plan_code?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_price_id?: string | null
          stripe_subscription_item_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account?: string | null
          billing_mode?: Database["public"]["Enums"]["billing_mode"]
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: number
          plan_code?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_price_id?: string | null
          stripe_subscription_item_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      tag: {
        Row: {
          brand: number
          created_at: string
          id: number
          tag: string
        }
        Insert: {
          brand: number
          created_at?: string
          id?: number
          tag: string
        }
        Update: {
          brand?: number
          created_at?: string
          id?: number
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      topic: {
        Row: {
          brand: number
          category: number
          created_at: string
          description: string | null
          focus: boolean
          id: number
          name: string
          relevant: boolean
          slug: string | null
          synonyms: string[] | null
          updated_at: string | null
        }
        Insert: {
          brand: number
          category: number
          created_at?: string
          description?: string | null
          focus?: boolean
          id?: number
          name: string
          relevant?: boolean
          slug?: string | null
          synonyms?: string[] | null
          updated_at?: string | null
        }
        Update: {
          brand?: number
          category?: number
          created_at?: string
          description?: string | null
          focus?: boolean
          id?: number
          name?: string
          relevant?: boolean
          slug?: string | null
          synonyms?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "topic_category"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_category: {
        Row: {
          brand: number
          created_at: string
          description: string | null
          focus: boolean
          id: number
          name: string
          parent_category: number | null
          relevant: boolean
          updated_at: string | null
        }
        Insert: {
          brand: number
          created_at?: string
          description?: string | null
          focus?: boolean
          id?: number
          name: string
          parent_category?: number | null
          relevant?: boolean
          updated_at?: string | null
        }
        Update: {
          brand?: number
          created_at?: string
          description?: string | null
          focus?: boolean
          id?: number
          name?: string
          parent_category?: number | null
          relevant?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_category_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_category_parent_category_fkey"
            columns: ["parent_category"]
            isOneToOne: false
            referencedRelation: "topic_category"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_cluster: {
        Row: {
          brand: number | null
          created_at: string
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          brand?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          brand?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_cluster_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_cluster_topic: {
        Row: {
          brand: number | null
          cluster_id: number
          created_at: string
          id: number
          notes: string | null
          position: number
          topic_id: number
          updated_at: string | null
        }
        Insert: {
          brand?: number | null
          cluster_id: number
          created_at?: string
          id?: number
          notes?: string | null
          position: number
          topic_id: number
          updated_at?: string | null
        }
        Update: {
          brand?: number | null
          cluster_id?: number
          created_at?: string
          id?: number
          notes?: string | null
          position?: number
          topic_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_cluster_topic_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_cluster_topic_cluster_fk"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "topic_cluster"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_cluster_topic_topic_fk"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_keyword: {
        Row: {
          created_at: string
          id: number
          keyword: string
          long_tail: boolean
          topic: number
        }
        Insert: {
          created_at?: string
          id?: number
          keyword: string
          long_tail?: boolean
          topic: number
        }
        Update: {
          created_at?: string
          id?: number
          keyword?: string
          long_tail?: boolean
          topic?: number
        }
        Relationships: [
          {
            foreignKeyName: "topic_keyword_topic_fkey"
            columns: ["topic"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_link_category: {
        Row: {
          account_old: number | null
          brand: number | null
          created_at: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          account_old?: number | null
          brand?: number | null
          created_at?: string
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          account_old?: number | null
          brand?: number | null
          created_at?: string
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_link_category_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_link_type: {
        Row: {
          account_old: number | null
          brand: number | null
          category: number | null
          created_at: string
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          account_old?: number | null
          brand?: number | null
          category?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          account_old?: number | null
          brand?: number | null
          category?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_link_type_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_link_type_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "topic_link_category"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_relationship_topic: {
        Row: {
          brand: number | null
          cluster_id: number
          confidence: number | null
          created_at: string
          id: number
          link_type: number
          notes: string | null
          source: string | null
          topic_1_id: number
          topic_2_id: number
          updated_at: string | null
        }
        Insert: {
          brand?: number | null
          cluster_id: number
          confidence?: number | null
          created_at?: string
          id?: number
          link_type: number
          notes?: string | null
          source?: string | null
          topic_1_id: number
          topic_2_id: number
          updated_at?: string | null
        }
        Update: {
          brand?: number | null
          cluster_id?: number
          confidence?: number | null
          created_at?: string
          id?: number
          link_type?: number
          notes?: string | null
          source?: string | null
          topic_1_id?: number
          topic_2_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_relationship_topic_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_relationship_topic_cluster_fk"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "topic_cluster"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_relationship_topic_link_type_fk"
            columns: ["link_type"]
            isOneToOne: false
            referencedRelation: "topic_link_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_relationship_topic_topic1_fk"
            columns: ["topic_1_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_relationship_topic_topic2_fk"
            columns: ["topic_2_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_budget: {
        Row: {
          account_id: string
          alert_sent_at: string | null
          alert_threshold_percent: number
          budget_usd: number
          created_at: string
          hard_limit: boolean
          id: number
          is_active: boolean
          period_end: string
          period_start: string
          spent_usd: number
          updated_at: string
        }
        Insert: {
          account_id: string
          alert_sent_at?: string | null
          alert_threshold_percent?: number
          budget_usd?: number
          created_at?: string
          hard_limit?: boolean
          id?: never
          is_active?: boolean
          period_end: string
          period_start: string
          spent_usd?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          alert_sent_at?: string | null
          alert_threshold_percent?: number
          budget_usd?: number
          created_at?: string
          hard_limit?: boolean
          id?: never
          is_active?: boolean
          period_end?: string
          period_start?: string
          spent_usd?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_budget_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_log: {
        Row: {
          account_id: string
          brand_id: number | null
          cost_breakdown: Json | null
          cost_usd: number
          created_at: string
          duration_ms: number | null
          id: number
          input_tokens: number | null
          job_id: number | null
          metadata: Json | null
          model: string | null
          operation_name: string
          output_tokens: number | null
          provider: string
          units: number | null
          user_id: string | null
        }
        Insert: {
          account_id: string
          brand_id?: number | null
          cost_breakdown?: Json | null
          cost_usd?: number
          created_at?: string
          duration_ms?: number | null
          id?: never
          input_tokens?: number | null
          job_id?: number | null
          metadata?: Json | null
          model?: string | null
          operation_name: string
          output_tokens?: number | null
          provider: string
          units?: number | null
          user_id?: string | null
        }
        Update: {
          account_id?: string
          brand_id?: number | null
          cost_breakdown?: Json | null
          cost_usd?: number
          created_at?: string
          duration_ms?: number | null
          id?: never
          input_tokens?: number | null
          job_id?: number | null
          metadata?: Json | null
          model?: string | null
          operation_name?: string
          output_tokens?: number | null
          provider?: string
          units?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_log_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_log_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_log_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_profile_with_account_and_subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitation: {
        Row: {
          accepted_at: string | null
          account: string
          auth_user_id: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: number
          invited_by: string
          role: string
        }
        Insert: {
          accepted_at?: string | null
          account: string
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: number
          invited_by: string
          role: string
        }
        Update: {
          accepted_at?: string | null
          account?: string
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: number
          invited_by?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitation_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          account: string | null
          account_role: Database["public"]["Enums"]["user_role"]
          active: boolean
          app_access: string[]
          app_admin: boolean
          auth_id: string
          created_at: string
          email: string
          email_pending: string | null
          email_pending_verified: boolean
          email_verified: boolean
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          phone_pending: string | null
          phone_pending_verified: boolean
          phone_verified: boolean
          preferred_otp_channel: Database["public"]["Enums"]["otp_channel"]
          selected_brand: number | null
          updated_at: string | null
        }
        Insert: {
          account?: string | null
          account_role?: Database["public"]["Enums"]["user_role"]
          active?: boolean
          app_access?: string[]
          app_admin?: boolean
          auth_id: string
          created_at?: string
          email: string
          email_pending?: string | null
          email_pending_verified?: boolean
          email_verified?: boolean
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          phone_pending?: string | null
          phone_pending_verified?: boolean
          phone_verified?: boolean
          preferred_otp_channel?: Database["public"]["Enums"]["otp_channel"]
          selected_brand?: number | null
          updated_at?: string | null
        }
        Update: {
          account?: string | null
          account_role?: Database["public"]["Enums"]["user_role"]
          active?: boolean
          app_access?: string[]
          app_admin?: boolean
          auth_id?: string
          created_at?: string
          email?: string
          email_pending?: string | null
          email_pending_verified?: boolean
          email_verified?: boolean
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          phone_pending?: string | null
          phone_pending_verified?: boolean
          phone_verified?: boolean
          preferred_otp_channel?: Database["public"]["Enums"]["otp_channel"]
          selected_brand?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_selected_brand_fkey"
            columns: ["selected_brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      blog_post_compat: {
        Row: {
          author_id: number | null
          brand: number | null
          content: string | null
          content_html: string | null
          cover_image_alt: string | null
          cover_image_url: string | null
          created_at: string | null
          embedding: string | null
          excerpt: string | null
          featured: boolean | null
          id: number | null
          lexical_content: Json | null
          migrated_from_import_id: number | null
          published_at: string | null
          search_vector: unknown
          slug: string | null
          source_content_id: number | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: number | null
          brand?: number | null
          content?: never
          content_html?: never
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          embedding?: string | null
          excerpt?: string | null
          featured?: never
          id?: number | null
          lexical_content?: never
          migrated_from_import_id?: never
          published_at?: string | null
          search_vector?: unknown
          slug?: string | null
          source_content_id?: never
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: number | null
          brand?: number | null
          content?: never
          content_html?: never
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          embedding?: string | null
          excerpt?: string | null
          featured?: never
          id?: number | null
          lexical_content?: never
          migrated_from_import_id?: never
          published_at?: string | null
          search_vector?: unknown
          slug?: string | null
          source_content_id?: never
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "derived_asset_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "derived_asset_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_with_tags: {
        Row: {
          backlink_count: number | null
          brand: number | null
          canonical: boolean | null
          created_at: string | null
          date: string | null
          description: string | null
          enrichment_error: string | null
          enrichment_status: string | null
          id: number | null
          keywords: string[] | null
          last_enrichment_attempt: string | null
          linked_urls: Json[] | null
          process: boolean | null
          raw_content: string | null
          reference_count: number | null
          reference_type: string | null
          summary: string | null
          tags: Json[] | null
          title: string | null
          updated_at: string | null
          url: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reference_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      v_usage_summary: {
        Row: {
          account_id: string | null
          operation_count: number | null
          period: string | null
          provider: string | null
          total_cost_usd: number | null
          total_units: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_log_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_profile_with_account_and_subscription: {
        Row: {
          account: string | null
          account_active: boolean | null
          account_name: string | null
          account_role: Database["public"]["Enums"]["user_role"] | null
          account_type: Database["public"]["Enums"]["account_type"] | null
          active: boolean | null
          app_access: string[] | null
          app_admin: boolean | null
          auth_id: string | null
          billing_mode: Database["public"]["Enums"]["billing_mode"] | null
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          email: string | null
          email_pending: string | null
          email_pending_verified: boolean | null
          email_verified: boolean | null
          first_name: string | null
          id: string | null
          last_name: string | null
          phone: string | null
          phone_pending: string | null
          phone_pending_verified: boolean | null
          phone_verified: boolean | null
          preferred_otp_channel:
            | Database["public"]["Enums"]["otp_channel"]
            | null
          selected_brand: number | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_selected_brand_fkey"
            columns: ["selected_brand"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_create_invitation: {
        Args: { p_account_id: string; p_email: string; p_role?: string }
        Returns: {
          accepted_at: string | null
          account: string
          auth_user_id: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: number
          invited_by: string
          role: string
        }
        SetofOptions: {
          from: "*"
          to: "user_invitation"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      admin_delete_invitation: {
        Args: { p_invitation_id: number }
        Returns: boolean
      }
      admin_list_accounts: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          account_type: string
          active: boolean
          created_at: string
          id: string
          name: string
          owner: string
          owner_email: string
          seat_count: number
          seat_limit: number
          updated_at: string
          user_count: number
        }[]
      }
      admin_list_invitations: {
        Args: { p_account_id?: string; p_limit?: number; p_offset?: number }
        Returns: {
          accepted_at: string
          account: string
          account_name: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invited_by: string
          invited_by_email: string
          role: string
        }[]
      }
      admin_list_users: {
        Args: { p_account_id?: string; p_limit?: number; p_offset?: number }
        Returns: {
          account: string
          account_name: string
          account_role: string
          active: boolean
          app_access: string[]
          app_admin: boolean
          auth_id: string
          created_at: string
          email: string
          email_verified: boolean
          first_name: string
          id: number
          last_name: string
          phone: string
          phone_verified: boolean
          updated_at: string
        }[]
      }
      audit_reference_integrity: { Args: never; Returns: undefined }
      check_account_budget: {
        Args: { p_account_id: string }
        Returns: {
          budget_usd: number
          hard_limit: boolean
          percent_used: number
          remaining_usd: number
          spent_usd: number
          within_budget: boolean
        }[]
      }
      cleanup_expired_invitations: { Args: never; Returns: number }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      generate_uuidv7: { Args: never; Returns: string }
      get_blog_authors: {
        Args: { p_brand_id: number }
        Returns: {
          bio: string
          first_name: string
          id: number
          image: string
          last_name: string
          post_count: number
        }[]
      }
      get_blog_categories: {
        Args: { p_brand_id: number; p_show_in_blog_only?: boolean }
        Returns: {
          description: string
          id: number
          name: string
          post_count: number
          slug: string
        }[]
      }
      get_blog_post_by_slug: {
        Args: { p_brand_id: number; p_slug: string }
        Returns: {
          author_bio: string
          author_first_name: string
          author_image: string
          author_last_name: string
          category_name: string
          category_slug: string
          content: string
          content_html: string
          cover_image_alt: string
          cover_image_url: string
          excerpt: string
          featured: boolean
          id: number
          lexical_content: Json
          published_at: string
          slug: string
          tags: Json
          title: string
          updated_at: string
        }[]
      }
      get_blog_post_count: {
        Args: {
          p_brand_id: number
          p_category_slug?: string
          p_tag_slug?: string
        }
        Returns: number
      }
      get_blog_posts: {
        Args: {
          p_brand_id: number
          p_category_slug?: string
          p_limit?: number
          p_offset?: number
          p_tag_slug?: string
        }
        Returns: {
          author_bio: string
          author_first_name: string
          author_image: string
          author_last_name: string
          category_name: string
          category_slug: string
          content: string
          content_html: string
          cover_image_alt: string
          cover_image_url: string
          excerpt: string
          featured: boolean
          id: number
          published_at: string
          slug: string
          tags: Json
          title: string
          updated_at: string
        }[]
      }
      get_blog_tags: {
        Args: { p_brand_id: number }
        Returns: {
          id: number
          name: string
          post_count: number
          slug: string
        }[]
      }
      get_bot_user_info: { Args: { p_email: string }; Returns: Json }
      get_current_account_id: { Args: never; Returns: string }
      get_domains_for_brand: {
        Args: { brand_id: number }
        Returns: {
          blog_config: Json
          created_at: string
          domain: string
          id: number
          is_active: boolean
          theme_config: Json
        }[]
      }
      get_fall_cl_table_counts: {
        Args: never
        Returns: {
          row_count: number
          table_name: string
        }[]
      }
      get_fall_cl_table_stats: {
        Args: never
        Returns: {
          last_updated: string
          row_count: number
          table_name: string
          total_size_bytes: number
        }[]
      }
      get_featured_posts: {
        Args: { p_brand_id: number; p_limit?: number }
        Returns: {
          author_first_name: string
          author_last_name: string
          category_name: string
          category_slug: string
          cover_image_alt: string
          cover_image_url: string
          excerpt: string
          id: number
          published_at: string
          slug: string
          title: string
        }[]
      }
      get_invitation_details: {
        Args: { check_email: string }
        Returns: {
          account_id: string
          expires_at: string
          invitation_id: number
          invited_by: string
          role: string
        }[]
      }
      get_related_posts: {
        Args: { p_brand_id: number; p_limit?: number; p_post_id: number }
        Returns: {
          category_name: string
          category_slug: string
          cover_image_alt: string
          cover_image_url: string
          excerpt: string
          id: number
          published_at: string
          slug: string
          title: string
        }[]
      }
      get_table_row_counts: {
        Args: never
        Returns: {
          row_count: number
          table_name: string
        }[]
      }
      get_user_profile_by_email: { Args: { p_email: string }; Returns: Json }
      has_valid_invitation: { Args: { check_email: string }; Returns: boolean }
      import_keywords_from_csv: { Args: never; Returns: undefined }
      is_account_admin: { Args: never; Returns: boolean }
      is_app_admin: { Args: never; Returns: boolean }
      manage_reference_links: {
        Args: {
          brand_id: number
          new_linked_urls: Json[]
          old_linked_urls: Json[]
          reference_id: number
        }
        Returns: undefined
      }
      pgmq_archive: {
        Args: { message_id: number; queue_name: string }
        Returns: undefined
      }
      pgmq_delete: {
        Args: { message_id: number; queue_name: string }
        Returns: undefined
      }
      pgmq_pop: { Args: { queue_name: string }; Returns: Json }
      pgmq_read: {
        Args: { n: number; queue_name: string; sleep_seconds: number }
        Returns: Json
      }
      pgmq_send: {
        Args: { message: Json; queue_name: string; sleep_seconds?: number }
        Returns: number
      }
      pgmq_send_batch: {
        Args: { messages: Json[]; queue_name: string; sleep_seconds?: number }
        Returns: number[]
      }
      resolve_brand_by_domain: {
        Args: { domain_name: string }
        Returns: {
          blog_config: Json
          brand_id: number
          brand_name: string
          brand_slug: string
          theme_config: Json
        }[]
      }
      search_blog_posts: {
        Args: { p_brand_id: number; p_limit?: number; p_query: string }
        Returns: {
          category_name: string
          category_slug: string
          cover_image_url: string
          excerpt: string
          id: number
          published_at: string
          rank: number
          slug: string
          title: string
        }[]
      }
      search_blog_posts_fuzzy: {
        Args: {
          author_ids?: number[]
          brand_id: number
          category_ids?: number[]
          max_results?: number
          search_query: string
          tag_ids?: number[]
        }
        Returns: {
          author_id: number
          author_image: string
          author_name: string
          category_id: number
          category_name: string
          cover_image_url: string
          excerpt: string
          id: number
          published_at: string
          relevance: number
          slug: string
          title: string
        }[]
      }
      search_blog_posts_semantic: {
        Args: {
          author_ids?: number[]
          brand_id: number
          category_ids?: number[]
          max_results?: number
          query_embedding: string
          similarity_threshold?: number
        }
        Returns: {
          author_id: number
          author_image: string
          author_name: string
          category_id: number
          category_name: string
          cover_image_url: string
          excerpt: string
          id: number
          published_at: string
          similarity: number
          slug: string
          title: string
        }[]
      }
      setup_rls_authenticated_users: { Args: never; Returns: undefined }
      vacuum_log_tables: { Args: never; Returns: undefined }
    }
    Enums: {
      account_type: "internal" | "customer"
      belief_status: "candidate" | "active" | "deprecated"
      belief_type: "required" | "existing" | "missing" | "false"
      billing_mode: "internal" | "stripe" | "lifetime"
      claim_status: "hypothesis" | "supported" | "contested" | "refuted"
      confidence_level: "low" | "medium" | "high" | "very_high"
      content_asset_type: "persuasive" | "authority"
      content_status:
        | "idea"
        | "next"
        | "draft"
        | "ready"
        | "on_hold"
        | "published"
      derived_asset_format:
        | "blog"
        | "instagram_carousel"
        | "instagram_reel"
        | "tiktok"
        | "newsletter"
        | "linkedin_post"
        | "twitter_thread"
      evidence_quality_tier: "primary" | "secondary" | "tertiary"
      job_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      media_type: "image" | "video" | "audio" | "file"
      otp_channel: "email" | "sms"
      question_status: "open" | "researching" | "answered" | "deferred"
      subscription_status:
        | "internal"
        | "trialing"
        | "active"
        | "past_due"
        | "paused"
        | "canceled"
        | "expired"
      user_role: "owner" | "admin" | "editor" | "viewer" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["internal", "customer"],
      belief_status: ["candidate", "active", "deprecated"],
      belief_type: ["required", "existing", "missing", "false"],
      billing_mode: ["internal", "stripe", "lifetime"],
      claim_status: ["hypothesis", "supported", "contested", "refuted"],
      confidence_level: ["low", "medium", "high", "very_high"],
      content_asset_type: ["persuasive", "authority"],
      content_status: [
        "idea",
        "next",
        "draft",
        "ready",
        "on_hold",
        "published",
      ],
      derived_asset_format: [
        "blog",
        "instagram_carousel",
        "instagram_reel",
        "tiktok",
        "newsletter",
        "linkedin_post",
        "twitter_thread",
      ],
      evidence_quality_tier: ["primary", "secondary", "tertiary"],
      job_status: ["pending", "processing", "completed", "failed", "cancelled"],
      media_type: ["image", "video", "audio", "file"],
      otp_channel: ["email", "sms"],
      question_status: ["open", "researching", "answered", "deferred"],
      subscription_status: [
        "internal",
        "trialing",
        "active",
        "past_due",
        "paused",
        "canceled",
        "expired",
      ],
      user_role: ["owner", "admin", "editor", "viewer", "client"],
    },
  },
} as const
