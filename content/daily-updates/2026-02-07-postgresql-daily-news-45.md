# PostgreSQL Daily News#45 2026-02-07



## **PostgreSQL Articles**

### **[A Day in the Life: Inside a Director, Strategic Accounts Role at EDB](https://enterprisedb.com/blog/day-life-inside-director-strategic-accounts-role-edb)**
Josh Spero, Director of Strategic Accounts at EDB, discusses his role and why he considers EDB an ideal workplace for career growth in this video spotlight. As part of EDB's "A Day in the Life" series exploring key roles at the PostgreSQL enterprise company, Spero shares insights into strategic account management and EDB's work environment. The series highlights individuals making market impact at EDB, focusing on career development opportunities within the PostgreSQL ecosystem.

`enterprisedb.com`

### **[How Zite Provisions Isolated Postgres Databases for Every User](https://neon.com/blog/how-zite-provisions-isolated-postgres-databases-for-every-user)**
Zite, an AI-native app builder, uses Neon's serverless PostgreSQL platform to provide isolated databases for every user, including those on free plans. According to co-founder Dominic Whyte, this approach eliminated the need to hire dedicated database engineers for managing and scaling their database infrastructure. The solution allows Zite to offer true database isolation per user while maintaining operational simplicity. This case study demonstrates how serverless PostgreSQL can enable scalable multi-tenant architectures without the traditional overhead of database management and provisioning.

`Carlota Soto`

### **[MariaDB vs. PostgreSQL: Choosing the Right Open Source Database](https://enterprisedb.com/blog/mariadb-vs-postgresql)**
MariaDB and PostgreSQL are both widely-used open source relational databases that power applications from small web apps to large enterprise systems. While both are SQL-based and highly capable, they differ significantly in design philosophies, feature sets, and suitability for modern workloads. The article emphasizes that database choice has long-term consequences, affecting performance, scalability, extensibility, security, and licensing. These factors directly impact how well a system can grow with business needs, making the comparison between these two databases crucial for organizations making database selection decisions.

`enterprisedb.com`

### **[The New v0 Is Ready for Production Apps and Agents](https://neon.com/blog/the-new-v0-is-ready-for-production-apps-and-agents)**
Neon's v0 platform has undergone a major rebuild, transitioning from a rapid prototyping tool to a production-ready development platform. The update shifts v0's focus from simply generating code to helping teams ship complete software solutions. Previously designed for quick demos and one-off prototypes, v0 now supports real production applications and AI agents. This evolution represents a significant architectural change, moving the platform beyond just UI generation capabilities. The rebuild aims to provide teams with a comprehensive development environment suitable for deploying actual business applications rather than experimental projects.

`Carlota Soto`

### **[What is AI governance?](https://enterprisedb.com/blog/what-is-ai-governance)**
EnterpriseDB discusses AI governance as the framework of policies, processes, and technical controls organizations need to ensure AI systems operate safely, ethically, and transparently while meeting regulatory requirements. The article explains that AI governance addresses accountability throughout the complete AI lifecycle, from data collection and model training through deployment, monitoring, and retirement. It emphasizes the importance of making AI decisions auditable, understandable, and correctable. For PostgreSQL users, this relates to database systems that store AI training data and support AI applications requiring governance frameworks to ensure responsible implementation.

`enterprisedb.com`

### **[What Is a Time Series and How Is It Used?](https://enterprisedb.com/blog/what-is-a-time-series)**
Time-series data consists of values tracked over time, with each data point tied to a specific moment, such as stock prices, website traffic, or sensor readings. This type of data enables organizations to understand how things change rather than just what happened at a point in time. Time-series analysis helps businesses identify patterns, detect anomalies, and forecast future outcomes, supporting critical use cases like demand planning, system monitoring, and predictive maintenance. EDB Postgres AI provides support for time-series workloads, offering capabilities for handling this temporal data effectively within PostgreSQL environments.

`enterprisedb.com`



## **Popular Hacker Email Discussions**

### **[Pasword expiration warning](https://www.postgresql.org/message-id/CAN4CZFPyCiVjBKhTJhmY5J0hj0KBgVwFA3gBh+Bvvcra-DQyYA@mail.gmail.com)**
The discussion centers on a patch for password expiration warning functionality in PostgreSQL. The conversation addresses code readability concerns regarding the use of macros versus hardcoded values. One participant suggests that while macros with explanatory names improve readability, a simple comment like "/* 7 days in seconds */" after the hardcoded number could achieve similar clarity without excessive macro use. The reviewer notes that since the GUC name is already defined as "7d" elsewhere, adding a macro might not provide significant value. The patch has received positive feedback, with one reviewer stating it looks good. The patch author, Nathan Bossart, plans to commit the changes early the following week and requests any additional feedback or objections be raised promptly.

Participants:
andrew@dunslane.net, euler@eulerto.com, gilles@darold.net, japinli@hotmail.com, li.evan.chao@gmail.com, liuxh.zj.cn@gmail.com, nathandbossart@gmail.com, niushiji@gmail.com, peter@eisentraut.org, shiyuefei1004@gmail.com, tgl@sss.pgh.pa.us, tsinghualucky912@foxmail.com, zsolt.parragi@percona.com

### **[libpq: Bump protocol version to version 3\.2 at least until the first/second beta](https://www.postgresql.org/message-id/CAOYmi+kQD6ynTUVsbXLmT3BjiEm4kk470c8WLL7ridQp9WR86g@mail.gmail.com)**
Jacob Champion has committed changes to bump the libpq protocol version to 3.2, despite his personal preference against splitting tables in two. The commit includes addressing feedback about mentioning the "_pq_." prefix for extensions earlier in documentation. Champion has attached v7 patches: v7-0001 updates the commit message from previous v6-0003, while v7-0002 adds error handling that provides users with explanations and documentation links for grease-related libpq errors. The documentation link currently points to the official PostgreSQL docs section on max protocol version, though Champion would prefer using a wiki page for easier maintenance. He seeks feedback on this approach while noting that changing the URL later would be straightforward if needed.

Participants:
andres@anarazel.de, david.g.johnston@gmail.com, hlinnaka@iki.fi, jacob.champion@enterprisedb.com, postgres@jeltef.nl, robertmhaas@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAJpy0uB=gaJgDaP8MiVeZmpxALrmDPbx=fqoidAbzhwEO3cv-g@mail.gmail.com)**
Shveta Malik identified an issue with Shlok Kyal's v41 patch for skipping schema changes in publication. The problem occurs when a subscriber connects to multiple publications with different EXCEPT clauses and different PUBLISH_VIA_PARTITION_ROOT values. In this scenario, table-sync and incremental-sync replicate different sets of tables, creating inconsistent behavior. For example, one publication excludes specific partitions with PUBLISH_VIA_PARTITION_ROOT=true while another excludes the parent table with PUBLISH_VIA_PARTITION_ROOT=false. Shveta suggests analyzing how row-filter and column-list features handle equivalent cases with different PUBLISH_VIA_PARTITION_ROOT settings to determine the appropriate behavior for this approach. The team needs to clarify the expected behavior before proceeding with the implementation.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Changing shared\_buffers without restart](https://www.postgresql.org/message-id/CAM_vCud-crRR9PeN_ZJQx2QqhtPSJ4AjU_hRaJTvmcOFPk9znA@mail.gmail.com)**
Bowen Shi encountered conflicts while applying Ashutosh Bapat's v20260128 patches for changing shared_buffers without restart and requested the base commit information. Ashutosh responded that the base commit is recorded in the patch itself as e3094679b9835fed2ea5c7d7877e8ac8e7554d33.

Earlier in the thread, Ashutosh provided a comprehensive update on the latest implementation, addressing previous reviewer feedback from Tomas Vondra and Peter Eisentraut. Key changes include: replacing max_available_memory with max_shared_buffers GUC, using mmap() + ftruncate() instead of mremap() for Linux-specific implementation, removing the freelist approach, implementing pg_resize_shared_buffers() function that requires ALTER SYSTEM + pg_reload_conf() followed by the function call, adding user documentation in config.sgml and func-admin.sgml, and including basic tests with more comprehensive testing planned.

The implementation now uses file-backed memory segments, maintains pointer stability, handles EXEC_BACKEND mode, and addresses many synchronization concerns. Outstanding work includes better error handling, platform portability, process synchronization during resizing, and addressing remaining TODOs identified in code reviews.

Participants:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me, zxwsbg12138@gmail.com

### **[\[PATCH\] pg\_bsd\_indent: improve formatting of multiline comments](https://www.postgresql.org/message-id/aYZqyoNlah_E-Zua@nathan)**
Nathan Bossart has committed a patch to improve the formatting of multiline comments in pg_bsd_indent. The patch was developed to address issues with how the PostgreSQL code formatting tool handles multiline comment blocks. Along with the main formatting improvements, Nathan also made changes to convert some #undefs to #defines as part of the implementation. The commit represents the final resolution of this formatting enhancement, which was discussed among several contributors including developers from various organizations. The change aims to make multiline comments more consistently formatted in PostgreSQL source code when processed through the pg_bsd_indent tool.

Participants:
aleksander@tigerdata.com, arseniy.mukhin.dev@gmail.com, bruce@momjian.us, li.evan.chao@gmail.com, michael@paquier.xyz, nathandbossart@gmail.com

### **[New access method for b\-tree\.](https://www.postgresql.org/message-id/CAE8JnxM5GDEWdvEckjgG60OwPK04pZ9dSyxYm2+-PuyKCpmo-w@mail.gmail.com)**
Alexandre Felipe proposes a new b-tree access method called "index merge scan" to optimize queries with IN conditions on leading index columns and ORDER BY on subsequent columns with LIMIT clauses. The motivation is efficiently rendering social media feeds where users select posts from multiple followed accounts ordered by timestamp. Performance tests show dramatic improvements: with LIMIT 100, the new method achieves 13ms execution time versus 3,409ms for regular index scans. The implementation adds "Index Prefixes" and "Index Searches" to query plans. Alexandre plans to extend support for multi-column prefixes and non-leading prefixes. Previous discussion included Michał Kłeczek suggesting GIST indexes as an alternative approach, noting similar "timeline view" patterns in social media applications. The proposal targets a common but currently inefficient query pattern where traditional methods require expensive sorting operations.

Participants:
alexandre.felipe@tpro.io, ants.aasma@cybertec.at, michael@paquier.xyz, michal@kleczek.org, o.alexandre.felipe@gmail.com, peter@eisentraut.org, pg@bowt.ie, pt@bowt.ie, tgl@sss.pgh.pa.us, tomas@vondra.me

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/CALdSSPhh04=1GvjK3Zhh4ZKepGJiRgkd-4eZFWz=3hVhvPDHQA@mail.gmail.com)**
Andres Freund is working on simplifying MarkSharedBufferDirtyHint() by removing special handling requirements. The key changes include switching to normal WAL logging order (marking buffer dirty first, then WAL logging) instead of the previous abnormal sequence, eliminating the need for DELAY_CHKPT_START since share-exclusive locks now conflict with page flushing, and removing BM_JUST_DIRTIED flag as concurrent buffer dirtying during IO is no longer possible. He's also updating heap_inplace_update_and_unlock() to delay only buffer content updates rather than copying MarkBufferDirtyHint()'s approach. The changes aim to standardize buffer handling now that hint bit setting requires share-exclusive locks. Kirill Reshke reviewed the v12 patches and suggested Andres might be interested in reviewing a related commitfest patch about gistkillitems changes.

Participants:
andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com



## **Industry News**

### **[It just got easier for Claude to check in on your WordPress site](https://techcrunch.com/2026/02/06/it-just-got-easier-for-claude-to-check-in-on-your-wordpress-site?utm_campaign=daily_pm)**
Anthropic has expanded Claude's capabilities by integrating it with WordPress, allowing users to leverage the AI assistant to analyze web traffic and access internal site metrics. This integration represents a practical application of AI in website management and analytics, making it easier for WordPress users to monitor and understand their site performance through conversational AI interactions rather than traditional dashboard interfaces.

### **[The backlash over OpenAI's decision to retire GPT-4o shows how dangerous AI companions can be](https://techcrunch.com/2026/02/06/the-backlash-over-openais-decision-to-retire-gpt-4o-shows-how-dangerous-ai-companions-can-be?utm_campaign=daily_pm)**
OpenAI's announcement to retire GPT-4o has triggered strong emotional reactions from users, highlighting the psychological dangers of AI companionship. Users have expressed deep attachment to the AI model, with some describing it as having "presence" and "warmth" rather than feeling like code. This backlash reveals how AI systems can form seemingly meaningful relationships with users, raising concerns about emotional dependency and the psychological impact of discontinuing AI companions that people have grown attached to.

### **[Maybe AI Agents can be laywers after all](https://techcrunch.com/2026/02/06/maybe-ai-agents-can-be-lawyers-after-all?utm_campaign=daily_pm)**
This week saw a significant development in AI capabilities with the release of Anthropic's Opus 4.6, which has disrupted agentic AI leaderboards and demonstrated improved performance in legal tasks. The advancement suggests AI agents may now be capable enough to handle complex legal work, marking a potential breakthrough in AI's ability to perform specialized professional tasks that were previously considered beyond current AI capabilities.