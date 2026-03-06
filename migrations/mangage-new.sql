-- =====================================================
-- Delta Migration After schema.sql (+ add_defaults.sql)
-- Only adds missing admin-module objects used by current code.
-- =====================================================

-- Users extension
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN NOT NULL DEFAULT FALSE;

-- =====================================================
-- RBAC supplementary objects (schema.sql already has roles/user_roles)
-- =====================================================
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(128) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  module VARCHAR(64) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS api_permissions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(128) NOT NULL UNIQUE,
  method VARCHAR(12) NOT NULL,
  path_pattern VARCHAR(255) NOT NULL,
  name VARCHAR(128) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_api_permissions (
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  api_permission_id INTEGER NOT NULL REFERENCES api_permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, api_permission_id)
);

CREATE TABLE IF NOT EXISTS user_data_source_scopes (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_source_id INTEGER NOT NULL REFERENCES feed_sources(id) ON DELETE CASCADE,
  access_level VARCHAR(16) NOT NULL DEFAULT 'admin' CHECK (access_level IN ('read', 'write', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, data_source_id)
);

CREATE TABLE IF NOT EXISTS user_activity_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(128) NOT NULL,
  target_type VARCHAR(64) NOT NULL,
  target_id VARCHAR(128),
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address VARCHAR(64),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_role_api_permissions_role_id ON role_api_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_api_permissions_api_permission_id ON role_api_permissions(api_permission_id);
CREATE INDEX IF NOT EXISTS idx_user_data_source_scopes_user_id ON user_data_source_scopes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_source_scopes_data_source_id ON user_data_source_scopes(data_source_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_actor_user_id ON user_activity_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at DESC);

-- =====================================================
-- Content Management Center
-- =====================================================
CREATE TABLE IF NOT EXISTS cm_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  color VARCHAR(16) DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cm_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cm_content_items (
  id BIGSERIAL PRIMARY KEY,
  content_type VARCHAR(32) NOT NULL CHECK (content_type IN ('blog','email','patch','news','user_submission')),
  source_table VARCHAR(64),
  source_key VARCHAR(128),
  title TEXT NOT NULL,
  body TEXT,
  blog_summary TEXT,
  email_summary TEXT,
  patch_summary TEXT,
  news_summary TEXT,
  status VARCHAR(24) NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review','approved','rejected','published','hidden')),
  review_status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','approved','rejected','changes_requested')),
  trust_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  credibility_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  ai_summary_version INTEGER NOT NULL DEFAULT 1,
  ai_last_run_at TIMESTAMPTZ,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cm_content_item_tags (
  content_item_id BIGINT NOT NULL REFERENCES cm_content_items(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES cm_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_item_id, tag_id)
);

CREATE TABLE IF NOT EXISTS cm_content_item_categories (
  content_item_id BIGINT NOT NULL REFERENCES cm_content_items(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES cm_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (content_item_id, category_id)
);

CREATE TABLE IF NOT EXISTS cm_auto_tag_rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  content_type VARCHAR(32) DEFAULT 'all',
  match_mode VARCHAR(16) NOT NULL DEFAULT 'keyword' CHECK (match_mode IN ('keyword','regex','author','source')),
  pattern TEXT NOT NULL,
  tag_id INTEGER NOT NULL REFERENCES cm_tags(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  priority INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cm_reviews (
  id BIGSERIAL PRIMARY KEY,
  content_item_id BIGINT NOT NULL REFERENCES cm_content_items(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(32) NOT NULL CHECK (action IN ('approve','reject','request_changes','hide','unhide','pin','unpin','restore','soft_delete','edit')),
  note TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cm_hacker_email_debug (
  id BIGSERIAL PRIMARY KEY,
  threadid TEXT,
  subject TEXT,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cm_content_items_status ON cm_content_items(status);
CREATE INDEX IF NOT EXISTS idx_cm_content_items_review_status ON cm_content_items(review_status);
CREATE INDEX IF NOT EXISTS idx_cm_content_items_type ON cm_content_items(content_type);
CREATE INDEX IF NOT EXISTS idx_cm_content_items_deleted_at ON cm_content_items(deleted_at);
CREATE INDEX IF NOT EXISTS idx_cm_reviews_content_item_id ON cm_reviews(content_item_id);
CREATE INDEX IF NOT EXISTS idx_cm_reviews_created_at ON cm_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cm_hacker_email_debug_created_at ON cm_hacker_email_debug(created_at DESC);

-- =====================================================
-- Workflow / Pipeline Control
-- =====================================================
CREATE TABLE IF NOT EXISTS wf_workflows (
  id SERIAL PRIMARY KEY,
  code VARCHAR(128) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  trigger_mode VARCHAR(24) NOT NULL DEFAULT 'scheduled' CHECK (trigger_mode IN ('scheduled','manual','event','hybrid')),
  retry_count INTEGER NOT NULL DEFAULT 3 CHECK (retry_count >= 0 AND retry_count <= 20),
  alert_on_failure BOOLEAN NOT NULL DEFAULT TRUE,
  alert_rule JSONB NOT NULL DEFAULT '{}'::jsonb,
  queue_concurrency INTEGER DEFAULT 1 CHECK (queue_concurrency IS NULL OR queue_concurrency > 0),
  worker_count INTEGER DEFAULT 1 CHECK (worker_count IS NULL OR worker_count > 0),
  filter_strategy JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_model VARCHAR(32) NOT NULL DEFAULT 'gpt' CHECK (ai_model IN ('claude','minimax','gpt')),
  bilingual_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wf_runs (
  id BIGSERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL REFERENCES wf_workflows(id) ON DELETE CASCADE,
  trigger_type VARCHAR(24) NOT NULL CHECK (trigger_type IN ('manual','scheduled','event','retry')),
  status VARCHAR(24) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','success','failed','cancelled')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER,
  retry_attempt INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wf_errors (
  id BIGSERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL REFERENCES wf_workflows(id) ON DELETE CASCADE,
  run_id BIGINT REFERENCES wf_runs(id) ON DELETE SET NULL,
  level VARCHAR(16) NOT NULL DEFAULT 'error' CHECK (level IN ('warning','error','critical')),
  message TEXT NOT NULL,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wf_agent_prompts (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER REFERENCES wf_workflows(id) ON DELETE CASCADE,
  prompt_type VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  content TEXT NOT NULL,
  language VARCHAR(16) NOT NULL DEFAULT 'bilingual' CHECK (language IN ('en','zh','bilingual')),
  model VARCHAR(32) NOT NULL DEFAULT 'gpt' CHECK (model IN ('claude','minimax','gpt')),
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workflow_id, prompt_type)
);

ALTER TABLE wf_agent_prompts ALTER COLUMN language TYPE VARCHAR(16);

CREATE TABLE IF NOT EXISTS wf_global_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  default_model VARCHAR(32) NOT NULL DEFAULT 'gpt' CHECK (default_model IN ('claude','minimax','gpt')),
  bilingual_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  global_queue_concurrency INTEGER DEFAULT 2 CHECK (global_queue_concurrency IS NULL OR global_queue_concurrency > 0),
  global_worker_count INTEGER DEFAULT 2 CHECK (global_worker_count IS NULL OR global_worker_count > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (id = 1)
);

CREATE INDEX IF NOT EXISTS idx_wf_runs_workflow_id ON wf_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_wf_runs_status ON wf_runs(status);
CREATE INDEX IF NOT EXISTS idx_wf_runs_created_at ON wf_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wf_errors_workflow_id ON wf_errors(workflow_id);
CREATE INDEX IF NOT EXISTS idx_wf_errors_created_at ON wf_errors(created_at DESC);

INSERT INTO wf_global_settings(id, default_model, bilingual_enabled, global_queue_concurrency, global_worker_count)
VALUES (1, 'gpt', TRUE, 2, 2)
ON CONFLICT (id) DO NOTHING;
