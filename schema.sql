-- =====================================================
-- PGNexus Database Schema
-- =====================================================
-- This schema creates all required tables for PGNexus
-- Run this BEFORE starting the application
-- =====================================================

-- =====================================================
-- 1. USER AUTHENTICATION & SUBSCRIPTIONS
-- =====================================================
-- These tables are also created by the migration script
-- but included here for completeness

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
	telegram_secret VARCHAR(128) DEFAULT NULL,
	telegram_status VARCHAR(32) DEFAULT 'inactive',
	telegram_chatid BIGINT DEFAULT NULL,
	bio VARCHAR(300) DEFAULT NULL,
	country CHAR(2) DEFAULT NULL,
	imgurl TEXT DEFAULT NULL,
	organization VARCHAR(255),
	position VARCHAR(255)
);
CREATE INDEX user_index ON users(telegram_secret);
CREATE INDEX user_index2 ON users(telegram_chatid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    feed_type VARCHAR(50) NOT NULL CHECK (feed_type IN ('rss', 'email', 'news')),
    source_identifier TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
	status VARCHAR(32),
    UNIQUE(user_id, feed_type, source_identifier)
);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_feed_type ON user_subscriptions(feed_type);

-- n8n poll jobs
CREATE TABLE IF NOT EXISTS poll_jobs (
    jobid BIGINT PRIMARY KEY,
    DATE TIMESTAMPTZ,
    status INT
);

-- n8n poll timestamps
CREATE TABLE IF NOT EXISTS poll_ts(
        jobtype         TEXT NOT NULL PRIMARY KEY,
        last_poll_ts    TIMESTAMPTZ
);

-- n8n github discussions
CREATE TABLE IF NOT EXISTS github_hacker_discussions (
        subject                 TEXT NOT NULL PRIMARY KEY,
        issueid                 INT,
        url                     TEXT,
        lastupdate              TIMESTAMPTZ
);

-- =====================================================
-- 2. DATA FEED TABLES
-- =====================================================
-- These tables store the actual content from various sources

-- RSS Feeds (Tech Blogs)
CREATE TABLE IF NOT EXISTS rss_feeds (
        jobid                   BIGINT REFERENCES poll_jobs(jobid),
        title                   TEXT NOT NULL,
		title_zh				TEXT,
        url                     TEXT NOT NULL,
		imgurl					TEXT DEFAULT NULL,
        author                  TEXT NOT NULL,
        pubdate                 TIMESTAMPTZ NOT NULL,
        content                 TEXT,
        snippet                 TEXT,
        summary                 TEXT,
        summary_zh              TEXT
);
CREATE INDEX rss_feeds_index ON rss_feeds(jobid);
CREATE UNIQUE INDEX rss_feeds_index2 ON rss_feeds(jobid, title);

-- Email Feeds (Hacker Discussions - PostgreSQL Mailing Lists)
CREATE TABLE IF NOT EXISTS email_feeds (
        jobid                   BIGINT REFERENCES poll_jobs(jobid),
        threadId                TEXT NOT NULL,
        subject                 TEXT NOT NULL,
        subject_zh				TEXT,
        participants            TEXT,
        messages                TEXT,
        summary                 TEXT,
        summary_zh              TEXT,
        lastActivity            TIMESTAMPTZ
);
CREATE INDEX email_feeds_index ON email_feeds(jobid);
CREATE UNIQUE INDEX email_feeds_index2 ON email_feeds(jobid, threadId);

-- Email Feeds (Hacker Discussions - PostgreSQL Mailing Lists)
CREATE TABLE IF NOT EXISTS patch_reports (
        jobid                   BIGINT REFERENCES poll_jobs(jobid),
        threadId                TEXT NOT NULL,
		messageId				TEXT NOT NULL,
		patchFile				TEXT NOT NULL,
		summary					TEXT,
		summary_zh				TEXT,
        risk					TEXT,
		risk_zh					TEXT,
		details					TEXT
);
CREATE INDEX patch_reports_index ON patch_reports(jobid);
CREATE UNIQUE INDEX patch_reports_index2 ON patch_reports(jobid, threadId, patchFile);

-- News Feeds (Industry News)
CREATE TABLE IF NOT EXISTS news_feeds (
        jobid                   BIGINT REFERENCES poll_jobs(jobid),
        subject                 TEXT NOT NULL,
        subject_zh				TEXT,
        source                  TEXT NOT NULL,
        pubdate                 TIMESTAMPTZ NOT NULL,
        messages                TEXT,
        summary                 TEXT,
        summary_zh              TEXT
);
CREATE INDEX news_feeds_index ON news_feeds(jobid);
CREATE UNIQUE INDEX news_feeds_index2 ON news_feeds(jobid, subject);

CREATE TABLE IF NOT EXISTS event_feeds (
		title					TEXT PRIMARY KEY,
		title_zh				TEXT,
		url						TEXT NOT NULL,
		pubdate                 TIMESTAMPTZ NOT NULL,
		content                 TEXT,
		snippet                 TEXT
);

-- email statistics
CREATE TABLE IF NOT EXISTS daily_email_stats (
		day 					DATE PRIMARY KEY,
		type					TEXT NOT NULL DEFAULT 'hacker',
		total_message			INT NOT NULL DEFAULT 0,
		attachment_count		INT NOT NULL DEFAULT 0,
		unique_patch_count		INT NOT NULL DEFAULT 0,
		unique_contrib_count	INT NOT NULL DEFAULT 0,
		patches					TEXT DEFAULT NULL,
		contribs				TEXT DEFAULT NULL,
		collect_time			TIMESTAMPTZ
);
CREATE INDEX daily_email_stats_index ON daily_email_stats(day);
CREATE UNIQUE INDEX daily_email_stats_index2 on daily_email_stats(day, type);


CREATE TABLE IF NOT EXISTS weekly_email_stats (
        day                     DATE PRIMARY KEY,
        type                    TEXT NOT NULL DEFAULT 'hacker',
        total_message           INT NOT NULL DEFAULT 0,
        attachment_count        INT NOT NULL DEFAULT 0,
        unique_patch_count      INT NOT NULL DEFAULT 0,
        unique_contrib_count    INT NOT NULL DEFAULT 0,
        patches                 TEXT DEFAULT NULL,
        contribs                TEXT DEFAULT NULL,
        collect_time            TIMESTAMPTZ
);
CREATE INDEX weekly_email_stats_index ON weekly_email_stats(day);
CREATE UNIQUE INDEX weekly_email_stats_index2 on weekly_email_stats(day, type);

CREATE TABLE IF NOT EXISTS user_reviews (
  id           BIGSERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id),
  target_type  VARCHAR(32) NOT NULL,   -- e.g. 'post', 'email', 'pgnexus'
  target_identifier TEXT DEFAULT NULL,
  rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title        VARCHAR(120) DEFAULT NULL,
  body         TEXT DEFAULT NULL,
  status       VARCHAR(16) NOT NULL DEFAULT 'published'
               CHECK (status IN ('published','deleted')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS user_reviews_user_id_idx ON user_reviews(user_id);
CREATE INDEX IF NOT EXISTS user_reviews_target_idx ON user_reviews(target_type);

-- =====================================================
-- 3. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'User accounts for authentication and authorization';
COMMENT ON TABLE user_subscriptions IS 'User subscriptions to RSS feeds, email threads, and news sources';
COMMENT ON TABLE rss_feeds IS 'RSS feed entries from tech blogs and PostgreSQL-related sources';
COMMENT ON TABLE email_feeds IS 'Email discussions from PostgreSQL mailing lists';
COMMENT ON TABLE news_feeds IS 'News articles from various PostgreSQL and database industry sources';

COMMENT ON COLUMN user_subscriptions.feed_type IS 'Type of feed: rss, email, or news';
COMMENT ON COLUMN user_subscriptions.source_identifier IS 'Author for RSS, threadId for email, source for news';
COMMENT ON COLUMN email_feeds.participants IS 'JSON array of participant email addresses or names';
COMMENT ON COLUMN email_feeds.messages IS 'JSON array of message objects containing messageId, sender, timestamp, content';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
