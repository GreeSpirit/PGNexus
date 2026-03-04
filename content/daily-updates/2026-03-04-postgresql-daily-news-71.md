# PostgreSQL Daily News#71 2026-03-04



## **PostgreSQL Articles**

### **[Autobase 2.6.0 released](https://www.postgresql.org/about/news/autobase-260-released-3250/)**
Autobase 2.6.0 introduces a blue-green deployment workflow for PostgreSQL upgrades with near-zero downtime. The process involves deploying a clone cluster using Patroni standby, synchronizing data through physical replication, automatically upgrading PostgreSQL on the target cluster, converting it to a logical replica, and continuing to receive live changes until switchover. Traffic switching occurs in seconds, and rollback is equally fast without data loss using reverse logical replication. Autobase is an open-source alternative to cloud-managed databases that automates deployment, failover, backups, upgrades, and scaling for highly available PostgreSQL clusters.

`www.postgresql.org`

### **[How MarketReader Processes 3M Trades/Min to Deliver US Market Trading Insights with TimescaleDB](https://www.tigerdata.com/blog/how-marketreader-processes-3m-trades-min-deliver-us-market-trading-insights-timescaledb)**
MarketReader, a fintech startup, processes 3 million trades per minute from US equity markets using TimescaleDB to deliver real-time market insights. The company ingests data from NASDAQ covering 26,000 listed and OTC securities, providing 700 updates every ten minutes to clients via API and WebSocket. Their architecture uses Tiger Data's TimescaleDB for time-series analytics, combining hypertables for automatic partitioning, continuous aggregates for statistical analysis, and vector search capabilities through pgvector. The system detects unusual market movements in real-time and provides context to large language models for generating market explanations, serving customers including retail brokerages and institutional investors.

`Nicole Bahr`

### **[INSERT ... ON CONFLICT ... DO SELECT: a new feature in PostgreSQL v19](https://www.cybertec-postgresql.com/en/insert-on-conflict-do-select-a-new-feature-in-postgresql-v19/)**
PostgreSQL v19 introduces INSERT ... ON CONFLICT ... DO SELECT, a new variant of the existing ON CONFLICT clause. This feature allows INSERT statements with RETURNING to select existing rows when conflicts occur, rather than just doing nothing or updating. The syntax supports optional row locking and WHERE conditions. This is particularly useful when tables have generated columns, triggers, or data types that modify inserted values, as it eliminates the need for separate SELECT statements to retrieve IDs or other generated values from conflicting rows. The feature complements existing DO NOTHING and DO UPDATE options, providing a complete upsert solution without race conditions that can occur with MERGE statements.

`Laurenz Albe`

### **[Pg_QoS v1.0.0 stable release is out!](https://www.postgresql.org/about/news/pg_qos-v100-stable-release-is-out-3251/)**
Pg_QoS v1.0.0, a PostgreSQL extension for Quality of Service resource governance, has reached stable release. The extension enables administrators to enforce per-role and per-database limits through ALTER ROLE/DATABASE SET commands. Key features include CPU usage limiting by binding backends to specific cores with planner integration for parallel workers, tracking and capping concurrent transactions and statements, work_mem session limits, and fast cache invalidation using shared epoch mechanisms. This facilitates fair resource allocation across different workloads on the same PostgreSQL instance. The extension requires PostgreSQL 15 or newer, with Linux needed for CPU limiting functionality. Native packages are available for Debian 13, Ubuntu 24.04, RHEL 10, AlmaLinux 10, and CentOS Stream 10, covering all supported PostgreSQL versions.

`www.postgresql.org`



## **Popular Hacker Email Discussions**

### **[Don't synchronously wait for already\-in\-progress IO in read stream](https://www.postgresql.org/message-id/CAAKRu_ZM1epxTdt2=4-g4ff6UC09zne+0xg_gNv3d7LEcxEvNA@mail.gmail.com)**
Melanie Plageman is working on a patch to improve read stream behavior by not synchronously waiting for already-in-progress IO operations. The discussion focuses on code review feedback and testing improvements. Nazir Bilal Yavuz identified a bug where tests always used 'worker' io_method instead of the intended method variable. Peter Geoghegan suggested making ProcessBufferHit an inline function for performance benefits, particularly for cached index-only scans. Melanie addressed these issues in v4 of the patch, renaming ProcessBufferHit to TrackBufferHit based on feedback. She also reviewed Andres' test patches and provided detailed commentary on test cases for repeated blocks and foreign IO scenarios. A question remains about whether some test code should be moved from test_aio.c to test_read_stream.c, as foreign IO tests may be more about AIO behavior than read stream functionality.

Participants:
andres@anarazel.de, byavuz81@gmail.com, melanieplageman@gmail.com, pg@bowt.ie, thomas.munro@gmail.com, tv@fuzzy.cz

### **[pg\_plan\_advice \(now with transparent SQL plan performance overrides \- pg\_stash\_advice\)](https://www.postgresql.org/message-id/CAKZiRmx=ijCZFpAYMb1z0=9u0iixqD6cBKPBx+WLFFKqOW8R=w@mail.gmail.com)**
Robert Haas posted version 18 of pg_plan_advice, introducing pg_stash_advice - a new contrib module that enables transparent SQL plan performance overrides using query ID matching. Jakub Wartak provided extensive feedback, highlighting both functionality and naming concerns. He successfully tested plan overrides but noted inconsistencies between the three modules (pg_plan_advice, pg_collect_advice, pg_stash_advice) regarding shared_preload_libraries requirements and CREATE EXTENSION support. Key issues include pg_collect_advice creating duplicate entries for identical queries, query ID matching limitations requiring prepared statements, and delayed effectiveness of plan changes in pgbench sessions. Jakub suggested better query normalization, memory limits based on shared_buffers percentage, and alternative naming conventions. Robert responded that the current design is intentionally modular, allowing custom extensions via the toolkit approach. He emphasized the late stage of feature development, limiting scope expansion before PostgreSQL 19's feature freeze. David Johnston added feedback about subplan matching behavior inconsistencies.

Participants:
alexandra.wang.oss@gmail.com, david.g.johnston@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[Fix bug in multixact Oldest\*MXactId initialization and access](https://www.postgresql.org/message-id/120550bf-ca50-4a07-91b1-a88f1434ee8b@postgrespro.ru)**
The discussion follows up on a recently pushed fix for a multixact bug related to OldestMemberMXactId initialization and prepared transaction handling. Sami Imseih proposed adding a test case to verify correct handling of prepared transaction dummy processes, since the added assertions wouldn't cover this scenario. Yura Sokolov supported adding tests for fixed bugs. Heikki Linnakangas created a simplified version of Sami's reproduction case that doesn't require concurrent sessions and moved it to the main regression test suite's 'prepared_xacts' test. Tom Lane suggested an unrelated improvement to reduce maintenance effort for prepared_xacts_1.out by adding an early exit when prepared transactions are disabled. Heikki agreed and provided a patch for this optimization, planning to backpatch it to all supported versions to ease future test backporting.

Participants:
hlinnaka@iki.fi, li.evan.chao@gmail.com, samimseih@gmail.com, tgl@sss.pgh.pa.us, y.sokolov@postgrespro.ru

### **[Reduce timing overhead of EXPLAIN ANALYZE using rdtsc?](https://www.postgresql.org/message-id/CAP53Pkw6BuGCig3iDfDkh1MZz_3UqzGb-YAVSKn2r9dQCKYDfw@mail.gmail.com)**
Lukas Fittl submitted v10 of his RDTSC patch for reducing EXPLAIN ANALYZE timing overhead. The updated version addresses feedback by moving CPU feature detection to pg_cpu_x86.c, adding TSC invariant bit checks, and supporting HyperV hypervisors through MSR reads. He revised the default TSC selection logic to match Linux kernel behavior, enabling TSC when invariant and TSC_ADJUST bits are set on systems with 4 or fewer sockets. The patch switches to using compiler built-ins for RDTSC/RDTSCP to avoid expensive header includes that doubled build times. Two outstanding questions remain: implementing better TSC error reporting for users, and whether RDTSCP needs an LFENCE instruction for accuracy. Andres Freund raised security concerns about MSR access for HyperV support, suggesting alternative approaches like reading CPU frequency from sysfs, though Lukas noted TSC frequency doesn't match CPU frequency on Azure VMs.

Participants:
andres@anarazel.de, geidav.pg@gmail.com, hannuk@google.com, ibrar.ahmad@gmail.com, jakub.wartak@enterprisedb.com, johncnaylorls@gmail.com, lukas@fittl.com, m.sakrejda@gmail.com, michael@paquier.xyz, pavel.stehule@gmail.com, robertmhaas@gmail.com, vignesh21@gmail.com

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/CAAKRu_a1V7TUUYM7qO2c5Z-JyTKOsrryQBrk7Eu69ESzhqgd9w@mail.gmail.com)**
This thread discusses Melanie Plageman's v35 patch series for eliminating xl_heap_visible WAL records and implementing on-access visibility map updates. The patches address several key areas: moving commonly-used pruning context into PruneState, adding fast paths for already-frozen pages, using GlobalVisState for page-level visibility determination, tracking modified relations during query execution, and allowing on-access pruning to set pages as all-visible without freezing.

Andres Freund provides detailed technical feedback on performance considerations, VM corruption handling, and code structure. He questions the timing of VM buffer pinning, suggests improvements for pruning performance with fast paths for frozen pages, and discusses conflict horizon calculations. The discussion covers when to check for VM corruption, whether to always track visibility cutoffs, and optimization strategies for different scan types.

Chao Li begins reviewing the v35 patches, focusing on code organization and Assert statements. Melanie addresses feedback by restructuring the code, adding corruption checks at the beginning of heap_page_prune_and_freeze(), implementing fast paths for all-visible pages, and always tracking newest live XIDs. She discovers a serious bug in v35-0017 where the rel_read_only parameter logic is inverted, planning to fix it in v36.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, melanieplageman@gmail.com, reshkekirill@gmail.com, robertmhaas@gmail.com, x4mmm@yandex-team.ru, xunengzhou@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAA4eK1+2mL0N8iUdNTr1baO9kJjDZgRGiNTX6cT=ZoBm-m_Lqg@mail.gmail.com)**
The discussion focuses on refinements to the v54 patch for PostgreSQL's EXCEPT TABLES feature in publications. Amit Kapila provided several minor comments including adding translator comments for publication name separators, questioning variable naming choices, suggesting renaming the test file from 037_rep_changes_except_table.pl to 037_except.pl for future syntax variations, and requesting accuracy checks on comments regarding ALTER PUBLICATION support. Shveta Malik agreed with the suggestions and noted a grammatical error. Nisha Moond identified a bug where partition descriptions incorrectly show publication names they're excluded from, a mistake in test code using subscription names instead of publication names, typos, and formatting issues. Shlok Kyal responded by addressing all feedback and releasing v55 patch, confirming fixes for the partition display issue, test code corrections, typos, and incorporating previous reviewer suggestions.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Streaming replication and WAL archive interactions](https://www.postgresql.org/message-id/F02ECB2F-0FA9-432F-8E53-4D1EE9C0E7CA@yandex-team.ru)**
Andrey Borodin revives an old discussion about PostgreSQL's shared archive mode to solve WAL archiving gaps during datacenter outages. The problem occurs in HA setups when primary servers fail - WAL files may be streamed to standbys but missing from archives, causing 1-2% of clusters to have PITR timeline gaps. Current solutions like archive_mode=always with tools like WAL-G are expensive due to decryption and comparison overhead. Borodin proposes a "shared" archive mode where standbys retain WAL until archived, incorporating ideas from Heikki's original patch and Greenplum work. The three-part patchset includes rebasing with tests, timeline switching improvements, and archive_status directory scan optimizations. Jaroslav Novikov adds missing references to support the discussion.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, masao.fujii@gmail.com, michael.paquier@gmail.com, nag1010@gmail.com, njrslv@yandex-team.ru, nkak@vmware.com, reshkekirill@gmail.com, rkhapov@yandex-team.ru, robertmhaas@gmail.com, root@simply.name, shirisharao@vmware.com, x4mmm@yandex-team.ru

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/6ed7f4ed-aac1-4ce9-a692-7062a4bb07f6@postgrespro.ru)**
This discussion involves a proposal to modify PostgreSQL's logical replication behavior regarding walsender exit timing. The original issue concerns walsenders waiting for remote flush confirmation before exiting, which can cause problems during pg_upgrade when logical replication slots have pending changes. Ronan Dunklau suggested that stopping the service before pg_upgrade would require either disabling the behavior entirely by switching to wait_flush or failing the upgrade. Andrey Silitskiy agreed with this more flexible approach and has modified the interface from the originally discussed implementation to use a timeout mechanism instead. An updated patch has been proposed to address these concerns and provide better handling of logical replication slot states during system upgrades.

Participants:
a.silitskiy@postgrespro.ru, aekorotkov@gmail.com, amit.kapila16@gmail.com, andres@anarazel.de, dilipbalaut@gmail.com, horikyota.ntt@gmail.com, htamfids@gmail.com, kuroda.hayato@fujitsu.com, masao.fujii@gmail.com, michael@paquier.xyz, osumi.takamichi@fujitsu.com, peter.eisentraut@enterprisedb.com, ronan@dunklau.fr, sawada.mshk@gmail.com, smithpb2250@gmail.com, v.davydov@postgrespro.ru

### **[Change COPY \.\.\. ON\_ERROR ignore to ON\_ERROR ignore\_row](https://www.postgresql.org/message-id/5e126dbb-9535-4de4-ad3b-187e475aa6b5@eisentraut.org)**
The discussion focused on implementing the COPY command's ON_ERROR SET_NULL functionality. Peter Eisentraut provided code review feedback on handling domain constraints when setting NULL values for failed data type conversions. The key technical issue was ensuring that constrained domains properly validate NULL values during string-to-datum conversion, since ExecConstraints doesn't handle domain constraints. Jian He explained that an additional InputFunctionCallSafe call is needed to check whether NULL values are allowed for domain types with CHECK constraints. The implementation includes proper error messaging when domain constraints reject NULL values, with contextual details about which column and line caused the failure. After addressing the review comments and clarifying the constraint validation logic, Peter Eisentraut committed the changes, indicating the feature implementation is now complete.

Participants:
david.g.johnston@gmail.com, jian.universality@gmail.com, jim.jones@uni-muenster.de, masao.fujii@oss.nttdata.com, matheusssilv97@gmail.com, nagata@sraoss.co.jp, peter@eisentraut.org, reshkekirill@gmail.com, sawada.mshk@gmail.com, torikoshia@oss.nttdata.com, vignesh21@gmail.com



## **Industry News**

### **[Claude Code rolls out a voice mode capability](https://techcrunch.com/2026/03/03/claude-code-rolls-out-a-voice-mode-capability?utm_campaign=daily_pm)**
Anthropic has announced the rollout of Voice Mode in Claude Code, marking a significant step forward in AI coding assistance. This new feature allows developers to interact with Claude Code using voice commands, enhancing the coding experience by enabling hands-free programming and debugging. The voice capability represents Anthropic's effort to compete more effectively in the AI coding space, where companies are increasingly looking to make programming tools more accessible and intuitive. The rollout demonstrates the growing trend of integrating voice interfaces into developer tools, potentially making coding more efficient for developers who prefer verbal communication over traditional text-based interactions.

### **[Just three companies dominated the $189B in VC investments last month](https://techcrunch.com/2026/03/03/openai-anthropic-waymo-dominated-189-billion-vc-investments-february-crunchbase-report?utm_campaign=daily_pm)**
According to Crunchbase data, February 2026 saw a record-breaking $189 billion in global venture capital investments flow to startups, with artificial intelligence companies capturing an overwhelming 90% of the total capital. The massive funding surge was dominated by just three companies: OpenAI, Anthropic, and Waymo, which collectively absorbed the majority of these investments. This unprecedented concentration of venture funding highlights the intense investor interest in AI technologies and autonomous systems. The data reveals the extreme polarization in the startup funding landscape, where AI companies are attracting enormous valuations while other sectors receive significantly less attention from venture capitalists.

### **[TikTok down for some in US, thanks to second Oracle outage since sale](https://techcrunch.com/2026/03/03/tiktok-down-for-some-in-u-s-thanks-to-second-oracle-outage-since-sale?utm_campaign=daily_pm)**
TikTok experienced service disruptions for some users in the United States due to a second Oracle infrastructure outage since ByteDance divested the app's U.S. operations. The outage affected TikTok's functionality, preventing users from accessing the platform normally. This marks the second significant Oracle-related service interruption since the ownership transition, raising questions about the reliability of the new infrastructure arrangement. The disruption occurred just days after ByteDance completed the sale of TikTok's U.S. operations, highlighting potential technical challenges associated with the platform's transition to new ownership and infrastructure providers. The outage underscores the complex technical dependencies involved in operating large-scale social media platforms.