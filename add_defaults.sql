----------------------------
-- Contributor influences --
----------------------------
WITH input(name, influence, email) AS (
  VALUES
    ('Amit Kapila', 5, 'amit.kapila16@gmail.com'),
    ('Andres Freund', 5, 'andres@anarazel.de'),
    ('Bruce Momjian', 5, 'bruce@momjian.us'),
    ('Lukas Fittl', 5, 'lukas@fittl.com'),
    ('Michael Paquier', 5, 'michael.paquier@gmail.com'),
    ('Michael Paquier', 5, 'michael@paquier.xyz'),
    ('Nathan Bossart', 5, 'nathandbossart@gmail.com'),
    ('Peter Eisentraut', 5, 'peter.eisentraut@enterprisedb.com'),
    ('Peter Eisentraut', 5, 'peter@eisentraut.org'),
    ('Robert Haas', 5, 'robertmhaas@gmail.com'),
    ('Tom Lane', 5, 'tgl@sss.pgh.pa.us'),
    ('Thomas Munro', 5, 'thomas.munro@gmail.com'),
    ('Heikki Linnakangas', 5, 'hlinnaka@iki.fi'),
    ('David Rowley', 5, 'dgrowleyml@gmail.com'),
    ('Alvaro Herrera', 4, 'alvherre@kurilemu.dev'),
    ('Amit Langote', 4, 'amitlangote09@gmail.com'),
    ('Dave Creamer', 4, 'davecramer@gmail.com'),
    ('Daniel Gustafsson', 4, 'daniel@yesql.se'),
    ('Zijie Hou', 4, 'houzj.fnst@fujitsu.com'),
    ('Hayato Kuroda', 4, 'kuroda.hayato@fujitsu.com'),
    ('Evan Li', 4, 'li.evan.chao@gmail.com'),
    ('Fujii Masao', 4, 'masao.fujii@gmail.com'),
    ('Melanie Pageman', 4, 'melanieplageman@gmail.com'),
    ('Masahiki Sawada', 4, 'sawada.mshk@gmail.com'),
    ('Laurenz Albe', 4, 'laurenz.albe@cybertec.at'),
    ('Richard Guo', 4, 'guofenglinux@gmail.com'),
    ('David Wheeler', 4, 'david@justatheory.com')
),
upsert_contributors AS (
  INSERT INTO contributor_stats (name, influence)
  SELECT name, MAX(influence)
  FROM input
  GROUP BY name
  ON CONFLICT (name) DO UPDATE
    SET influence = GREATEST(contributor_stats.influence, EXCLUDED.influence)
  RETURNING id, name
)
INSERT INTO contributor_emails (email, contributor_id)
SELECT i.email, u.id
FROM input i
JOIN upsert_contributors u ON u.name = i.name
ON CONFLICT (email) DO NOTHING;

----------------------
-- RSS FEED SOURCES --
----------------------
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('postgresql.org', 'rss_feeds', 'https://www.postgresql.org/news.rss', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('EDB', 'rss_feeds', 'https://www.enterprisedb.com/blog/rss.xml', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('AWS', 'rss_feeds', 'https://aws.amazon.com/blogs/database/category/database/amazon-aurora/postgresql-compatible/feed/', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Robert Haas@EDB', 'rss_feeds', 'http://rhaas.blogspot.com/feeds/posts/default', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('postgres.ai', 'rss_feeds', 'https://postgres.ai/blog/rss.xml', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('PGmuster', 'rss_feeds', 'https://www.pgmustard.com/blog?format=rss', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Cybertec', 'rss_feeds', 'https://www.cybertec-postgresql.com/en/feed/', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Yugabyte', 'rss_feeds', 'https://www.yugabyte.com/blog/tag/postgresql/feed/', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Fujisu', 'rss_feeds', 'https://www.postgresql.fastware.com/blog/rss.xml', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Fundacion', 'rss_feeds', 'https://postgresql.fund/blog/index.xml', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Timescale', 'rss_feeds', 'https://www.timescale.com/blog/rss', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Pganalyze', 'rss_feeds', 'https://pganalyze.com/feed.xml', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('PostgresPro', 'rss_feeds', 'https://postgrespro.com/rss', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Neon', 'rss_feeds', 'https://neon.com/blog/rss.xml', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Percona', 'rss_feeds', 'https://www.percona.com/blog/category/postgresql/feed/', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('Paul Ramsey@Snowflake', 'rss_feeds', 'https://publish-p57963-e462109.adobeaemcloud.com/engineering-blog-feed/?lang=en&author=paul-ramsey', 1);
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('DataBene', 'rss_feeds', 'https://www.data-bene.io/en/blog.xml', 1);

------------------------
-- EMAIL FEED SOURCES --
------------------------
INSERT INTO feed_sources(name, type, email, owner_id) VALUES ('pg hacker discussion1', 'email_feeds', 'pgsql-hackers@lists.postgresql.org', 1);
INSERT INTO feed_sources(name, type, email, owner_id) VALUES ('pg hacker discussion2', 'email_feeds', 'pgsql-hackers@postgresql.org', 1);

-----------------------
-- NEWS FEED SOURCES --
-----------------------
INSERT INTO feed_sources(name, type, email, owner_id) VALUES ('techcrunch.com', 'news_feeds', 'newsletters@techcrunch.com', 1);

-------------------------
-- SOCIAL FEED SOURCES --
-------------------------
INSERT INTO feed_sources(name, type, platform, url, owner_id) VALUES ('databricks', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/databricks/', 1);
INSERT INTO feed_sources(name, type, platform, url, owner_id) VALUES ('pgconf.dev', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/pgconf-dev', 1);
INSERT INTO feed_sources(name, type, platform, url, owner_id) VALUES ('posette', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/posetteconf', 1);
INSERT INTO feed_sources(name, type, platform, url, owner_id) VALUES ('pgedge', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/pgedge', 1);
INSERT INTO feed_sources(name, type, platform, url, owner_id) VALUES ('cybertec', 'social_feeds', 'linkedin', 'https://www.linkedin.com/company/cybertec-postgresql', 1);

------------------------
-- EVENT FEED SOURCES --
------------------------
INSERT INTO feed_sources(name, type, url, owner_id) VALUES ('postgresql.org', 'event_feeds', 'https://www.postgresql.org/events.rss', 1);
