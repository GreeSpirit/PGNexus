# PostgreSQL Daily News#57 2026-02-18



## **PostgreSQL Articles**

### **[Compiling PostgreSQL extensions with Visual Studio 2026 on Windows](https://enterprisedb.com/blog/compiling-postgresql-extensions-visual-studio-2026-windows)**
This blog post by Craig Ringer and Xavier Fischer provides an updated tutorial for compiling PostgreSQL extensions using Visual Studio 2026 Community on Windows. The post addresses common struggles users face when building PostgreSQL extensions in the Visual Studio environment. It serves as a practical guide demonstrating the compilation process for simple extensions, updating previous instructions to work with the newer Visual Studio 2026 version. The tutorial aims to help developers overcome building challenges and successfully create PostgreSQL extensions on Windows platforms.

`enterprisedb.com`

### **[Distribute PostgreSQL 18 with Citus 14](https://www.citusdata.com/blog/2026/02/17/distribute-postgresql-18-with-citus-14/)**
Citus 14.0 has been released with PostgreSQL 18 support, bringing distributed database capabilities to the latest Postgres features. The release enables PostgreSQL 18's key improvements across distributed clusters, including asynchronous I/O for faster scans and maintenance, skip-scan for better multicolumn B-tree index usage, uuidv7() for time-ordered UUIDs, and OAuth authentication support. Citus 14 adds specific compatibility work for new PostgreSQL 18 syntax including JSON_TABLE() COLUMNS, temporal constraints, virtual generated columns by default, VACUUM/ANALYZE ONLY semantics, RETURNING OLD/NEW in DML operations, and expanded COPY functionality. The release ensures these features work correctly in distributed environments through proper parsing, DDL propagation, and distributed execution handling across coordinator and worker nodes.

`www.citusdata.com`

### **[Looking back at P2D2 2026](https://www.cybertec-postgresql.com/en/looking-back-at-p2d2-2026/)**
Sarah Gruber from CYBERTEC PostgreSQL attended P2D2 2026 in Prague as a sponsor representative. Day 1 featured workshops while she explored Prague's architecture and landmarks. Day 2 involved manning their booth, demonstrating PostgreSQL card decks and a Patroni suitcase for cluster failover demonstrations. She observed lightning talks hosted by her colleague Pavlo and noted strong attendee engagement with their marketing materials. The event provided networking opportunities and insights into PostgreSQL technical work, despite challenging snowy weather conditions throughout the visit.

`Sarah Gruber`

### **[Neon Is a Cursor Plugin](https://neon.com/blog/neon-is-a-cursor-plugin)**
Neon has launched a plugin for Cursor, the AI-powered code editor. The plugin is available in the Cursor Marketplace as part of Cursor's initial plugin launch. It provides Cursor with live access to users' Neon organizations and the necessary knowledge to work with Neon's PostgreSQL database service. This integration allows developers to interact with their Neon databases directly through Cursor's interface, streamlining database operations within the development environment.

`Carlota Soto`

### **[PostgreSQL 19: part 1 or CommitFest 2025-07](https://postgrespro.com/blog/pgsql/5972724)**
PostgreSQL 19 development is underway with new features emerging from the July 2025 CommitFest. Key additions include connection service file support in libpq and psql, a new regdatabase type for database identifiers, and enhanced pg_stat_statements with counters for generic/custom plans and improved command normalization. Performance improvements feature optimized temporary table truncation, incremental sort in Append/MergeAppend nodes, and better large object migration in pg_upgrade. Additional enhancements include EXPLAIN improvements for Memoize nodes, btree_gin comparison operators for integers, non-blocking domain constraint validation, CHECKPOINT command parameters, COPY FROM row skipping, and dynamic shared memory usage tracking through pg_dsm_registry_allocations.

`Pavel Luzanov`

### **[Start on Postgres, Scale on Postgres: How TimescaleDB 2.25 Continues to Improve the Way Postgres Scales](https://www.tigerdata.com/blog/start-on-postgres-scale-on-postgres)**
TimescaleDB 2.25 introduces significant performance improvements for PostgreSQL time-series workloads. Key enhancements include metadata-based aggregation queries that can be up to 289x faster by avoiding data decompression, and optimized time-filtered queries showing up to 50x speed improvements. The release improves scaling efficiency through better constraint handling for chunk pruning and fixes planning performance regressions on PostgreSQL 16+. Real-time analytics capabilities are enhanced with compressed continuous aggregate refresh, reducing I/O overhead, and adjusted batching defaults for steadier performance. Additional improvements include better planner stability, support for UUIDv7-partitioned hypertables in retention policies, and various correctness fixes. These changes collectively reduce operational overhead while maintaining PostgreSQL's simplicity as datasets and ingest rates grow.

`Mike Freedman`



## **Popular Hacker Email Discussions**

### **[Proposal: ANALYZE \(MODIFIED\_STATS\) using autoanalyze thresholds](https://www.postgresql.org/message-id/CAE2r8H4KRCJ055utU4u+3rBYSgAmiFgMgswaBMN_iOx16iTubQ@mail.gmail.com)**
VASUKI M proposes a new ANALYZE (MODIFIED_STATS) option that would allow manual ANALYZE commands to use the same threshold logic as autoanalyze. The proposal aims to only process relations that have crossed the modification threshold using the existing analyze_base_threshold and analyze_scale_factor formula. The intended use cases include scripted maintenance, immediate analysis after batch data loads, and avoiding unnecessary work when running ANALYZE across many relations.

Nathan Bossart suggests a broader approach: centralizing autovacuum/autoanalyze prioritization code in a system view that could be used by vacuumdb instead of adding more ANALYZE options. He expresses uncertainty about the concrete use cases and isn't fully convinced about expanding ANALYZE functionality.

David Rowley agrees with Nathan's system view approach, preferring it over adding ANALYZE options. He suggests a view showing tables with their vacuum/analyze scores would be more useful for scripting purposes. He warns that adding this option might lead to similar requests for VACUUM command options, creating a "can of worms." Both reviewers suggest implementing this functionality in vacuumdb instead.

Participants:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, nathandbossart@gmail.com, rob@xzilla.net, samimseih@gmail.com, vasukianand0119@gmail.com

### **[AIX support](https://www.postgresql.org/message-id/CA+hUKGKuydrE4P=7jnn3Of1ntcrSAA+Vxd8g_KxgJAVO-fjFRQ@mail.gmail.com)**
The discussion focuses on restoring PostgreSQL support for AIX systems. Tom Lane has developed a series of patches to address AIX-specific issues, while Thomas Munro offers assistance with LLVM integration once basic support is established. A critical development emerges as Noah Misch announces that four AIX buildfarm members running on cfarm111 will be decommissioned by February 25, 2026, requiring alternative testing infrastructure.

Key technical issues include rpath configuration problems where Aditya Kamath proposes adding "/opt/freeware/lib" to the library path calculation to ensure test cases can locate open-source libraries on AIX systems. Tom Lane agrees to this modification. Peter Eisentraut references related threads developing more general solutions for static library handling, though Tom Lane notes the need for fine-grained control to maintain AIX's historical behavior of installing internal static libraries by default.

The patches appear to be progressing well, with most core functionality restored, though some components like plpython and LLVM integration require further work once the foundation is solid.

Participants:
aditya.kamath1@ibm.com, andres@anarazel.de, hlinnaka@iki.fi, michael@paquier.xyz, noah@leadboat.com, peter@eisentraut.org, postgres-ibm-aix@wwpdl.vnet.ibm.com, robertmhaas@gmail.com, sriram.rk@in.ibm.com, tgl@sss.pgh.pa.us, thomas.munro@gmail.com, tristan@partin.io

### **[generating function default settings from pg\_proc\.dat](https://www.postgresql.org/message-id/1288023.1771292185@sss.pgh.pa.us)**
Tom Lane has submitted a draft patch to improve how PostgreSQL generates function default settings during bootstrap initialization. The patch allows pg_proc.dat to directly specify function parameter defaults instead of requiring separate CREATE OR REPLACE statements in system_functions.sql. The implementation adds special handling for pg_node_tree values in the bootstrap backend, converting text arrays to proper Const nodes for proargdefaults entries.

Andres Freund provided detailed code review feedback, suggesting improvements like using cstring arrays instead of text arrays, adding error context information, and consolidating type metadata retrieval. Tom Lane addressed these suggestions in a v2 patch and also cleaned up unused TypInfo entries in the bootstrap code.

Corey Huinker initially suggested a more SQL-like approach but Tom Lane argued this would complicate the parser unnecessarily. Andrew Dunstan praised the final approach as sensible, noting it handles common cases well while keeping uncommon cases manageable through existing mechanisms. The patch aims to cover 90% of function default argument needs during bootstrap.

Participants:
alvherre@kurilemu.de, andres@anarazel.de, andrew@dunslane.net, corey.huinker@gmail.com, tgl@sss.pgh.pa.us

### **[index prefetching](https://www.postgresql.org/message-id/CAE8JnxOacD1bKB-rKeSC1ThHKevuYa5NtU7ksNQVqxiTgar_rg@mail.gmail.com)**
The discussion centers on performance issues with index prefetching in PostgreSQL, particularly how yielding mechanisms interfere with effective readahead. Andres Freund demonstrates that frequent yields prevent io_combine_limit-sized IOs from forming, severely limiting concurrent IO and causing significant performance degradation. In one test, disabling yields improved execution time from 10.2 seconds to 5.6 seconds. Peter Geoghegan acknowledges the current heuristics are overly conservative but argues yields are necessary to prevent excessive work in queries with LIMIT clauses or merge joins. Alexandre Felipe provides detailed analysis of distance oscillation patterns and proposes buffer reordering solutions. Tomas Vondra suggests gradually ramping up batch distance thresholds rather than keeping them fixed at 2. The group discusses measuring unconsumed IOs and testing with higher latency storage using dm_delay to better understand readahead effectiveness.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Use standard die\(\) handler for SIGTERM in bgworkers](https://www.postgresql.org/message-id/5238fe45-e486-4c62-a7f3-c7d8d416e812@iki.fi)**
Heikki Linnakangas proposes replacing the custom bgworker_die() SIGTERM handler in background workers with the standard die() handler. The current bgworker_die() implementation is unsafe because it performs memory allocations and other non-async-signal-safe operations within a signal handler, potentially causing deadlocks or corruption. Andres Freund confirms this has been a longstanding safety issue in background worker processes. Nathan Bossart agrees the patch looks reasonable and offers to create instrumentation using the existing wrapper_handler mechanism to detect unsafe operations in signal handlers. The change includes updated documentation and represents a move toward safer signal handling practices in PostgreSQL background workers.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, nathandbossart@gmail.com

### **[POC: Carefully exposing information without authentication](https://www.postgresql.org/message-id/CAKAnmmJUGidY7cjD0rHtNVisQksy3u1KszHXkMCNPWYhMKPEvw@mail.gmail.com)**
Greg Sabino Mullane submitted a rebased patch that exposes specific PostgreSQL information without authentication through HTTP-like endpoints. The patch adds three GUCs (expose_recovery, expose_sysid, expose_version) and handles GET/HEAD requests for /replica, /sysid, and /version endpoints early in the backend initialization process. Key changes include using IO::Socket::INET for testing and allowing case-insensitive calls.

Andres Freund provided detailed feedback raising several concerns: the patch needs better justification in the commit message, lacks consideration for TLS connections, poses security risks due to unauthenticated plaintext communication vulnerable to man-in-the-middle attacks, and may have blocking socket issues since the socket is in blocking mode during early initialization. Freund also suggests consolidating the three separate GUCs into a single comma-separated list parameter and questions whether exposing this information on the same socket as normal client connections is advisable.

Participants:
ah@cybertec.at, andres@anarazel.de, htamfids@gmail.com, tgl@sss.pgh.pa.us

### **[\[WIP\]Vertical Clustered Index \(columnar store extension\) \- take2](https://www.postgresql.org/message-id/TYWPR01MB8901CEA325DDC1F6B4B2489FEA6DA@TYWPR01MB8901.jpnprd01.prod.outlook.com)**
The discussion focuses on the Vertical Clustered Index (VCI) columnar store extension implementation. Timur Magomedov praised VCI's user API, noting it allows creating columnar storage for specific columns rather than entire tables, using clear SQL syntax without requiring query changes. He also highlighted VCI's custom Change Data Capture method using IAM and homegrown hooks in heapam.c, suggesting these CDC components could be separated into their own patch for broader use. Aya Iwata agreed that IAM-based approaches may be preferable if implementation issues can be resolved, and requested more details about useful hook functionality. However, Álvaro Herrera strongly opposed the hook-based approach, arguing that if VCI is integrated into the backend core, it shouldn't require hooks but should be a native part of the backend. He rated the chances of accepting a separate CDC patch with hooks as "very close to zero," warning that accepting hooks would prevent proper backend integration.

Participants:
alvherre@kurilemu.de, iwata.aya@fujitsu.com, japinli@hotmail.com, kuroda.hayato@fujitsu.com, o.alexandre.felipe@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, t.magomedov@postgrespro.ru, tomas@vondra.me

### **[Having problems generating a code coverage report](https://www.postgresql.org/message-id/202602171700.7764hluoeh23@alvherre.pgsql)**
Álvaro Herrera reports successfully resolving PostgreSQL code coverage report generation issues after multiple attempts. The solution involved using specific LCOVFLAGS and GENHTML_FLAGS parameters to ignore various lcov errors (usage, unmapped, corrupt, inconsistent, range) when running make coverage-html. Key findings include: the flags must be passed as make arguments rather than environment variables, the --legend option causes lcov to fail, and removing a .lcovrc file didn't automatically enable branch coverage. Initial CSS display problems were resolved after cache expiration, restoring proper line coloring in the coverage report. The working command ignores multiple lcov tool errors, which Herrera considers problematic but necessary until lcov tools are fixed to properly process PostgreSQL's source tree.

Participants:
aleksander@timescale.com, alvherre@kurilemu.de, michael@paquier.xyz, pg@bowt.ie, stefan@kaltenbrunner.cc, tgl@sss.pgh.pa.us

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CALDaNm11LKbC2epEyHOvD6H_ONqLqhDQk7sXWwcneyhrTbFaTw@mail.gmail.com)**
This thread continues the ongoing review of the "FOR ALL TABLES ... EXCEPT TABLE" publication feature patch. Vignesh C addresses feedback from reviewers David G. Johnston, Dilip Kumar, and Shveta Malik on the v44/v45 patches. Key issues discussed include documentation clarity, particularly around confusing language about tables being "covered" by EXCEPT publications, function naming consistency, and code structure improvements. David suggests better wording for complex partition inheritance scenarios and removing redundant explanations about row filters. Shveta raises concerns about index usage in publication_has_any_exception(), proper handling of except flags in syscache searches, and suggests consolidating related functions like is_relid_or_ancestor_published(). She also identifies issues with error messages for temporary/unlogged tables and subscription creation with multiple EXCEPT publications. The discussion highlights ongoing refinements needed for proper partition handling, memory context management, and maintaining clear separation between publication types in CreatePublication(). Multiple iterations show active collaboration toward finalizing this logical replication enhancement.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Improve pg\_sync\_replication\_slots\(\) to wait for primary to advance](https://www.postgresql.org/message-id/CAJpy0uAO=VNKc2q5FgqMKx-u-zb8hikjXQqqkTCUDAtAgbmbSA@mail.gmail.com)**
The discussion focuses on improvements to the pg_sync_replication_slots() function, specifically addressing concerns about infinite retries in worst-case scenarios. Amit Kapila raised concerns that the remaining patch could lead to indefinite retries when slots fail to sync due to various issues like physical replication delays, slot invalidation, or other timing problems across different slots. Shveta malik acknowledged this risk exists but questioned whether users would prefer the API to finish quickly with potentially unsynced slots or wait longer to ensure proper synchronization, especially for scheduled failovers. However, Amit argued that since the API cannot guarantee all slots are synced in one invocation (newly created slots might be missed), risking infinite waits is not justified. Both participants agreed that extending the API with additional parameters based on user feedback would be better. They also agreed on a specific code change to improve error reporting by changing an ereport from ERROR to LOG level when retrying slot synchronization via the API. The discussion awaits input from Hou-San on the proposed changes.

Participants:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, ashutosh.bapat.oss@gmail.com, houzj.fnst@fujitsu.com, itsajin@gmail.com, japinli@hotmail.com, jiezhilove@126.com, li.evan.chao@gmail.com, shveta.malik@gmail.com



## **Industry News**

### **[Apple is reportedly cooking up a trio of AI wearables](https://techcrunch.com/2026/02/17/apple-is-reportedly-cooking-up-a-trio-of-ai-wearables?utm_campaign=daily_pm)**
Apple is reportedly developing multiple AI-powered wearable devices as the company enters the competitive AI hardware market. The iPhone maker has several smart products in various stages of development, marking Apple's strategic expansion into AI-enabled wearables. This move comes as the AI hardware space becomes increasingly competitive, with companies racing to create consumer devices that integrate artificial intelligence capabilities. The development of these AI wearables represents Apple's effort to maintain its position in the evolving technology landscape while leveraging its expertise in consumer electronics and ecosystem integration.

### **[Anthropic releases Sonnet 4.6](https://techcrunch.com/2026/02/17/anthropic-releases-sonnet-4-6?utm_campaign=daily_pm)**
Anthropic has released a new version of its mid-size Claude Sonnet AI model, designated as Sonnet 4.6. This release maintains the company's established four-month update cycle for its AI model improvements. The update represents Anthropic's continued commitment to advancing its AI capabilities and staying competitive in the rapidly evolving artificial intelligence market. Sonnet 4.6 is part of Anthropic's Claude model family, which serves as the company's flagship AI offering. The regular updates demonstrate Anthropic's systematic approach to improving AI performance and capabilities through iterative development cycles.

### **[As AI jitters rattle IT stocks, Infosys partners with Anthropic to build 'enterprise-grade' AI agents](https://techcrunch.com/2026/02/17/as-ai-jitters-rattle-it-stocks-infosys-partners-with-anthropic-to-build-enterprise-grade-ai-agents?utm_campaign=daily_pm)**
Infosys has announced a strategic partnership with Anthropic to develop enterprise-grade AI agents, integrating Anthropic's Claude models into Infosys's Topaz AI platform. This collaboration aims to build sophisticated "agentic" systems designed for enterprise use. The partnership comes at a time when AI concerns are causing volatility in IT sector stocks, highlighting both the opportunities and uncertainties in the AI market. Through this integration, Infosys plans to leverage Anthropic's advanced language models to create more capable AI agents that can handle complex business processes and decision-making tasks for enterprise clients.