-- =====================================================
-- PGNexus Admin Modules (Feed Sources Version)
-- Use after: schema.sql
-- Purpose:
--   1) Data Source Management based on feed_sources
--   2) RBAC extensions required by current admin APIs
--   3) Content Management Center tables
--   4) Workflow / Pipeline Control tables
-- =====================================================

-- =====================================================
-- 1) Data Source Management (feed_sources)
-- =====================================================
CREATE TABLE IF NOT EXISTS feed_sources (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(32) NOT NULL,
  platform VARCHAR(255),
  url TEXT,
  email VARCHAR(255),
  config TEXT,
  is_active BOOLEAN DEFAULT true,
  last_error TEXT,
  error_count INT NOT NULL DEFAULT 0,
  owner_id INT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_fetched_at TIMESTAMPTZ,
  CONSTRAINT one_identifier_only CHECK (url IS NULL OR email IS NULL)
);

CREATE INDEX IF NOT EXISTS idx_feed_sources_type ON feed_sources(type);
CREATE INDEX IF NOT EXISTS idx_feed_sources_is_active ON feed_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_feed_sources_last_fetched_at ON feed_sources(last_fetched_at);
CREATE INDEX IF NOT EXISTS idx_feed_sources_owner_id ON feed_sources(owner_id);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_feed_sources_rss_url
ON feed_sources(url) WHERE type = 'rss_feeds';

CREATE UNIQUE INDEX IF NOT EXISTS uniq_feed_sources_event_url
ON feed_sources(url) WHERE type = 'event_feeds';

CREATE UNIQUE INDEX IF NOT EXISTS uniq_feed_sources_email
ON feed_sources(email) WHERE type = 'email_feeds';

CREATE UNIQUE INDEX IF NOT EXISTS uniq_feed_sources_news_url
ON feed_sources(url) WHERE type = 'news_feeds' AND url IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_feed_sources_news_email
ON feed_sources(email) WHERE type = 'news_feeds' AND email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_feed_sources_social_platform_url
ON feed_sources(platform, url) WHERE type = 'social_feeds';

-- Seed sources (idempotent via ON CONFLICT DO NOTHING; conflicts rely on unique indexes above)
INSERT INTO feed_sources(name, type, url, owner_id)
VALUES
  ('postgresql.org', 'rss_feeds', 'https://www.postgresql.org/news.rss', 1),
  ('EDB', 'rss_feeds', 'https://www.enterprisedb.com/blog/rss.xml', 1),
  ('AWS', 'rss_feeds', 'https://aws.amazon.com/blogs/database/category/database/amazon-aurora/postgresql-compatible/feed/', 1),
  ('Robert Haas@EDB', 'rss_feeds', 'http://rhaas.blogspot.com/feeds/posts/default', 1),
  ('postgres.ai', 'rss_feeds', 'https://postgres.ai/blog/rss.xml', 1),
  ('PGmuster', 'rss_feeds', 'https://www.pgmustard.com/blog?format=rss', 1),
  ('Cybertec', 'rss_feeds', 'https://www.cybertec-postgresql.com/en/feed/', 1),
  ('Yugabyte', 'rss_feeds', 'https://www.yugabyte.com/blog/tag/postgresql/feed/', 1),
  ('Fujisu', 'rss_feeds', 'https://www.postgresql.fastware.com/blog/rss.xml', 1),
  ('Fundacion', 'rss_feeds', 'https://postgresql.fund/blog/index.xml', 1),
  ('Timescale', 'rss_feeds', 'https://www.timescale.com/blog/rss', 1),
  ('Pganalyze', 'rss_feeds', 'https://pganalyze.com/feed.xml', 1),
  ('PostgresPro', 'rss_feeds', 'https://postgrespro.com/rss', 1),
  ('Neon', 'rss_feeds', 'https://neon.com/blog/rss.xml', 1),
  ('Percona', 'rss_feeds', 'https://www.percona.com/blog/category/postgresql/feed/', 1),
  ('Paul Ramsey@Snowflake', 'rss_feeds', 'https://publish-p57963-e462109.adobeaemcloud.com/engineering-blog-feed/?lang=en&author=paul-ramsey', 1),
  ('DataBene', 'rss_feeds', 'https://www.data-bene.io/en/blog.xml', 1)
ON CONFLICT DO NOTHING;

INSERT INTO feed_sources(name, type, email, owner_id)
VALUES
  ('pg hacker discussion1', 'email_feeds', 'pgsql-hackers@lists.postgresql.org', 1),
  ('pg hacker discussion2', 'email_feeds', 'pgsql-hackers@postgresql.org', 1)
ON CONFLICT DO NOTHING;

INSERT INTO feed_sources(name, type, email, owner_id)
VALUES
  ('techcrunch.com', 'news_feeds', 'newsletters@techcrunch.com', 1)
ON CONFLICT DO NOTHING;

INSERT INTO feed_sources(name, type, platform, url, owner_id)
VALUES
  ('databricks', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/databricks/', 1),
  ('pgconf.dev', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/pgconf-dev', 1),
  ('posette', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/posetteconf', 1),
  ('pgedge', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/pgedge', 1),
  ('cybertec', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/cybertec-postgresql', 1)
ON CONFLICT DO NOTHING;

INSERT INTO feed_sources(name, type, url, owner_id)
VALUES
  ('postgresql.org', 'event_feeds', 'https://www.postgresql.org/events.rss', 1)
ON CONFLICT DO NOTHING;


-- =====================================================
-- 2) RBAC Extension Tables
-- =====================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN NOT NULL DEFAULT FALSE;

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

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

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

CREATE INDEX IF NOT EXISTS idx_role_api_permissions_role_id ON role_api_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_api_permissions_api_permission_id ON role_api_permissions(api_permission_id);

CREATE TABLE IF NOT EXISTS user_data_source_scopes (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_source_id INTEGER NOT NULL REFERENCES feed_sources(id) ON DELETE CASCADE,
  access_level VARCHAR(16) NOT NULL DEFAULT 'admin' CHECK (access_level IN ('read', 'write', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, data_source_id)
);

CREATE INDEX IF NOT EXISTS idx_user_data_source_scopes_user_id ON user_data_source_scopes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_source_scopes_data_source_id ON user_data_source_scopes(data_source_id);

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

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_actor_user_id ON user_activity_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at DESC);

INSERT INTO roles(name, description, is_system)
VALUES
  ('super_admin', '超级管理员', true),
  ('content_admin', '内容管理员', true),
  ('data_source_admin', '数据源管理员', true),
  ('automation_admin', '自动化管理员', true),
  ('contributor', '贡献者用户', true),
  ('member', '普通用户', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions(code, name, module, description)
VALUES
  ('users.view', '查看用户', 'users', '查看用户列表和状态'),
  ('users.manage', '管理用户', 'users', '新增用户、冻结/解冻、分配角色'),
  ('roles.view', '查看角色', 'roles', '查看角色和权限配置'),
  ('roles.manage', '管理角色', 'roles', '管理角色权限和成员'),
  ('subscriptions.view', '查看订阅状态', 'subscriptions', '查看用户订阅状态'),
  ('logs.view', '查看行为日志', 'logs', '查看用户行为日志'),
  ('datasources.manage', '管理数据源', 'datasources', '管理数据源及其配置'),
  ('automation.manage', '管理自动化', 'automation', '管理自动化任务'),
  ('api.access.control', 'API 权限控制', 'api', '配置角色 API 访问权限')
ON CONFLICT (code) DO NOTHING;

INSERT INTO api_permissions(code, method, path_pattern, name, description)
VALUES
  ('api.rbac.overview.read', 'GET', '/api/admin/rbac/overview', '查看 RBAC 总览', '查看用户、角色、权限和作用域概览'),
  ('api.rbac.users.write', 'POST', '/api/admin/rbac/users', '新增用户', '手动添加管理员或普通用户'),
  ('api.rbac.users.update', 'PATCH', '/api/admin/rbac/users/:id', '更新用户状态', '用户冻结/解冻与角色调整'),
  ('api.rbac.role_permissions.write', 'POST', '/api/admin/rbac/role-permissions', '角色权限配置', '配置角色颗粒度权限'),
  ('api.rbac.role_api_permissions.write', 'POST', '/api/admin/rbac/role-api-permissions', '角色 API 权限配置', '配置角色 API 访问权限'),
  ('api.rbac.source_scopes.write', 'POST', '/api/admin/rbac/source-scopes', '数据源作用域配置', '限制管理员可操作的数据源'),
  ('api.rbac.activity_logs.read', 'GET', '/api/admin/rbac/activity-logs', '查看行为日志', '查看用户行为日志')
ON CONFLICT (code) DO NOTHING;


-- =====================================================
-- 3) Content Management Center
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

  status VARCHAR(24) NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review','approved','rejected','published','hidden')),
  review_status VARCHAR(24) NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending','approved','rejected','changes_requested')),

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

CREATE INDEX IF NOT EXISTS idx_cm_content_items_status ON cm_content_items(status);
CREATE INDEX IF NOT EXISTS idx_cm_content_items_review_status ON cm_content_items(review_status);
CREATE INDEX IF NOT EXISTS idx_cm_content_items_type ON cm_content_items(content_type);
CREATE INDEX IF NOT EXISTS idx_cm_content_items_deleted_at ON cm_content_items(deleted_at);

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

CREATE INDEX IF NOT EXISTS idx_cm_reviews_content_item_id ON cm_reviews(content_item_id);
CREATE INDEX IF NOT EXISTS idx_cm_reviews_created_at ON cm_reviews(created_at DESC);

CREATE TABLE IF NOT EXISTS cm_hacker_email_debug (
  id BIGSERIAL PRIMARY KEY,
  threadid TEXT,
  subject TEXT,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cm_hacker_email_debug_created_at ON cm_hacker_email_debug(created_at DESC);

INSERT INTO cm_categories(name, description)
VALUES
  ('blog', 'Blog posts and long-form writeups'),
  ('email', 'Mailing list discussions'),
  ('patch', 'Patch analysis and technical review'),
  ('news', 'News and announcements'),
  ('submission', 'User-submitted content')
ON CONFLICT (name) DO NOTHING;

INSERT INTO cm_tags(name, color)
VALUES
  ('postgresql', '#2563EB'),
  ('performance', '#EA580C'),
  ('security', '#DC2626'),
  ('tooling', '#16A34A'),
  ('ai-summary', '#7C3AED')
ON CONFLICT (name) DO NOTHING;


-- =====================================================
-- 4) Workflow / Pipeline Control Panel
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

CREATE INDEX IF NOT EXISTS idx_wf_runs_workflow_id ON wf_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_wf_runs_status ON wf_runs(status);
CREATE INDEX IF NOT EXISTS idx_wf_runs_created_at ON wf_runs(created_at DESC);

CREATE TABLE IF NOT EXISTS wf_errors (
  id BIGSERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL REFERENCES wf_workflows(id) ON DELETE CASCADE,
  run_id BIGINT REFERENCES wf_runs(id) ON DELETE SET NULL,
  level VARCHAR(16) NOT NULL DEFAULT 'error' CHECK (level IN ('warning','error','critical')),
  message TEXT NOT NULL,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wf_errors_workflow_id ON wf_errors(workflow_id);
CREATE INDEX IF NOT EXISTS idx_wf_errors_created_at ON wf_errors(created_at DESC);

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

-- Backward compatibility: if table was created previously with VARCHAR(8), widen it.
ALTER TABLE wf_agent_prompts
  ALTER COLUMN language TYPE VARCHAR(16);

CREATE TABLE IF NOT EXISTS wf_global_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  default_model VARCHAR(32) NOT NULL DEFAULT 'gpt' CHECK (default_model IN ('claude','minimax','gpt')),
  bilingual_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  global_queue_concurrency INTEGER DEFAULT 2 CHECK (global_queue_concurrency IS NULL OR global_queue_concurrency > 0),
  global_worker_count INTEGER DEFAULT 2 CHECK (global_worker_count IS NULL OR global_worker_count > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (id = 1)
);

INSERT INTO wf_global_settings(id, default_model, bilingual_enabled, global_queue_concurrency, global_worker_count)
VALUES (1, 'gpt', TRUE, 2, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO wf_workflows(code, name, description, trigger_mode, filter_strategy, ai_model, bilingual_enabled)
VALUES
  ('hacker_email_pipeline', 'Hacker Email Pipeline', '邮件抓取、筛选、总结与发布流程', 'scheduled', '{"weightScoring":true,"contentRelevance":true}'::jsonb, 'gpt', TRUE),
  ('patch_pipeline', 'Patch Pipeline', 'patch 抓取、分析与总结流程', 'scheduled', '{"patchPriority":true}'::jsonb, 'gpt', TRUE),
  ('industry_news_pipeline', 'Industry News Pipeline', '行业新闻抓取、筛选与摘要流程', 'scheduled', '{"sourceCredibility":true}'::jsonb, 'gpt', TRUE),
  ('summary_pipeline', 'Summary Pipeline', '信息汇总与多语言输出流程', 'hybrid', '{"topicMerge":true}'::jsonb, 'gpt', TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO wf_agent_prompts(workflow_id, prompt_type, name, content, language, model)
SELECT w.id, p.prompt_type, p.name, p.content, 'bilingual', 'gpt'
FROM wf_workflows w
JOIN (
  VALUES
    ('hacker_email_pipeline','hacker_email_summary','hacker email 总结提示词','请提炼邮件讨论中的核心观点、争议点、技术结论，并给出中英文摘要。'),
    ('patch_pipeline','patch_processing','patch 处理提示词','请提取 patch 目标、影响范围、风险点与建议，并生成结构化总结。'),
    ('industry_news_pipeline','industry_news_filter','行业新闻筛选提示词','请筛选 PostgreSQL 与数据库行业高相关新闻，剔除低价值内容。'),
    ('summary_pipeline','information_summary','信息总结提示词','请对多源内容进行去重合并、主题聚类、输出可读摘要。')
) AS p(workflow_code, prompt_type, name, content)
ON w.code = p.workflow_code
ON CONFLICT (workflow_id, prompt_type) DO NOTHING;

-- =====================================================
-- End
-- =====================================================
