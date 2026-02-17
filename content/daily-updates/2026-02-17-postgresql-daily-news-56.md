# PostgreSQL Daily News#56 2026-02-17



## **PostgreSQL Articles**

### **[Out-of-cycle release scheduled for February 26, 2026](https://www.postgresql.org/about/news/out-of-cycle-release-scheduled-for-february-26-2026-3241/)**
The PostgreSQL Global Development Group announced an out-of-cycle release scheduled for February 26, 2026, to address regressions introduced in the February 12, 2026 update. The problematic releases include versions 18.2, 17.8, 16.12, 15.16, and 14.21. Two critical regressions were identified: the substring() function now incorrectly raises "invalid byte sequence for encoding" errors on non-ASCII text from database columns, and standby servers may halt with transaction status access errors. The substring() issue stems from the CVE-2026-2006 security fix. The upcoming release will provide fixes across all supported versions (18.3, 17.9, 16.13, 15.17, 14.22) before the next scheduled May 14, 2026 release.

`www.postgresql.org`

### **[pgdsat version 1.2 has been released](https://www.postgresql.org/about/news/pgdsat-version-12-has-been-released-3239/)**
pgdsat version 1.2, a PostgreSQL Database Security Assessment Tool, has been released. The tool evaluates approximately 80 PostgreSQL security controls including CIS compliance benchmark recommendations. This update addresses user-reported issues and introduces new features: a -r/--remove option to exclude specific checks from reports using check numbers or regular expressions, added package requirements for perl-bignum and perl-Math-BigRat on RPM-based distributions, and Chinese (zh_CN) language support. pgdsat helps automate security policy verification for PostgreSQL clusters and provides insights into potential security issues. The open-source tool runs on Linux under GPLv3 license.

`www.postgresql.org`

### **[postgres_dba 7.0 — 34 diagnostic reports for psql](https://www.postgresql.org/about/news/postgres_dba-70-34-diagnostic-reports-for-psql-3237/)**
postgres_dba 7.0 is a major update to an interactive psql-based diagnostic toolkit for PostgreSQL that requires no extensions. The toolkit provides 34 diagnostic reports covering bloat and vacuum analysis, table and index health checks, query analysis using pg_stat_statements, tuning recommendations, size estimation, lock tree analysis, corruption detection, and memory analysis. Version 7.0 introduces 7 new reports including buffer cache analysis, workload profiling, and a comprehensive amcheck corruption detection suite. It also adds WAL and replication information to system overview reports and includes PostgreSQL 17 compatibility fixes. The toolkit supports PostgreSQL versions 13-18 and is available on GitHub.

`www.postgresql.org`



## **Popular Hacker Email Discussions**

### **[Fix uninitialized xl\_running\_xacts padding](https://www.postgresql.org/message-id/aZLHYtCsEldmm8Eu@ip-10-97-1-34.eu-west-3.compute.internal)**
A discussion is underway about fixing uninitialized padding bytes in the xl_running_xacts WAL record structure. The issue arose when analyzing WAL files, where random padding values were confusing. Key technical points emerged: with C99, the {0} initializer doesn't guarantee padding byte initialization, but C11 provides guarantees for static storage duration objects. Since PostgreSQL now uses C11, {0} initialization could work, with compilers generating equivalent code to memset. However, Andres Freund argues that C11's guarantee doesn't apply to automatic storage duration objects like xl_running_xacts, and notes that C23 will fix this limitation. The discussion expanded beyond xl_running_xacts to identify numerous WAL structures with padding holes. Freund suggests that if padding initialization is desired, it should be addressed comprehensively across all WAL records rather than piecemeal fixes, requiring documentation of the new rule and removal of relevant valgrind suppressions.

Participants:
andres@anarazel.de, anthonin.bonnefoy@datadoghq.com, bertranddrouvot.pg@gmail.com, michael@paquier.xyz, thomas.munro@gmail.com

### **[pgstat include expansion](https://www.postgresql.org/message-id/aZKesltb6Z35hlbP@paquier.xyz)**
The discussion addresses excessive header inclusion in pgstat.h, which is widely included throughout PostgreSQL. Andres Freund identified that recent commits expanded pgstat.h's included headers significantly, particularly adding replication/worker_internal.h and other heavy headers. The main concerns are compilation performance and inappropriate exposure of internal headers.

Several solutions are being debated. Andres initially suggested changing LogicalRepWorkerType parameters to int and using forward declarations for types like FullTransactionId. However, Michael Paquier and others prefer maintaining type safety. Amit Kapila proposed moving LogicalRepWorkerType from worker_internal.h to logicalworker.h, which requires fixing several indirect include dependencies in procsignal.c, functioncmds.c, and test files.

Alvaro Herrera supports removing problematic includes and agrees with forward-declaring FullTransactionId. He questions whether LogicalRepWorkerType belongs in logicalworker.h and suggests creating a dedicated header for subscription statistics. Andres proposes a more fundamental solution: eliminating the worker type parameter entirely by splitting pgstat_report_subscription_error into separate functions for apply, sequence, and table sync errors, since callers already know the specific error type.

The discussion also touches on removing backward compatibility includes from pgstat.h that were added during previous refactoring, though this might break extensions.

Participants:
alvherre@kurilemu.de, amit.kapila16@gmail.com, andres@anarazel.de, li.evan.chao@gmail.com, michael@paquier.xyz, nisha.moond412@gmail.com, vignesh21@gmail.com

### **[Add connection active, idle time to pg\_stat\_activity](https://www.postgresql.org/message-id/CA+FpmFcOjbC1MdJFt--EL85pG4v2uXZkhjevPqogBNvZ5aQWbA@mail.gmail.com)**
The discussion involves a patch to add connection active and idle time tracking to pg_stat_activity. Robert Haas suggested using ++ increments instead of += 1 for code style, which Richard Guo agreed with. However, Rafia Sabih raised a more fundamental concern about the patch's necessity. She argues that the original problem of counting total idle-in-transaction time may be unnecessary given that pg_stat_activity already provides state_change timestamp and state columns, which could potentially serve the same purpose. This suggests the existing infrastructure might already offer sufficient information to track connection timing without requiring additional fields or counters.

Participants:
aleksander@timescale.com, guofenglinux@gmail.com, rafia.pghackers@gmail.com, robertmhaas@gmail.com, sergey.dudoladov@gmail.com, vignesh21@gmail.com, zubkov@moonset.ru

### **[index prefetching](https://www.postgresql.org/message-id/CAE8JnxNOV9kOgmU1-WUWts9Q-Jj_Nf0K480wyEwJXUQYMnYu3g@mail.gmail.com)**
The discussion centers on performance issues with PostgreSQL's index prefetching feature. Alexandre Felipe reports mixed results from testing, finding prefetching beneficial for random cold access but sometimes detrimental for sequential scans and hot access patterns. Tomas Vondra and Andres Freund identify key technical problems: the distance adjustment algorithm creates instability where alternating cache hits and misses keep the prefetch distance oscillating between 1 and 2, preventing effective concurrent I/O. Andres proposes fixes like "distance = distance * 2 + 1" to avoid this oscillation. Additional issues include yielding logic that limits readahead aggressiveness and statistics that don't accurately reflect actual I/O behavior. The team discusses various improvements including better distance algorithms, adaptive yielding, and more accurate performance metrics. Alexandre suggests feedback-loop approaches and buffer skipping strategies, though implementability remains questionable for sorted output requirements.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[generating function default settings from pg\_proc\.dat](https://www.postgresql.org/message-id/183292bb-4891-4c96-a3ca-e78b5e0e1358@dunslane.net)**
Andrew Dunstan proposed a solution to address Bug 19409 by eliminating the need to write function argument defaults in system_views.sql. His patch adds infrastructure where genbki.pl generates function_defaults.sql from new pg_proc.dat fields (proargdflts and provariadicdflt), making pg_proc.dat a single source of truth. The proposal received strong support from multiple developers including Daniel Gustafsson, Tom Lane, Corey Huinker, Andres Freund, and Michael Paquier, who all found the current requirement annoying.

Tom Lane suggested improvements to make defaults more readable, proposing hash-based or pre-padded array formats. Andres Freund identified potential issues with the CREATE OR REPLACE approach, noting problems like missing ROWS specifications that could cause silent mismatches. He suggested a more comprehensive solution involving bootstrap-level parsing of default values and restructuring pg_proc.dat to use argument lists instead of parallel arrays.

Tom Lane agreed to implement the bootstrap parsing solution, proposing special handling for pg_node_tree columns in InsertOneValue(). The discussion evolved toward a broader refactoring of function definitions in pg_proc.dat, with Andrew Dunstan agreeing to review Tom Lane's implementation while focusing on the bootstrap infrastructure improvements.

Participants:
andres@anarazel.de, andrew@dunslane.net, corey.huinker@gmail.com, daniel@yesql.se, michael@paquier.xyz, tgl@sss.pgh.pa.us

### **[Small improvements to substring\(\)](https://www.postgresql.org/message-id/CAN4CZFPgL6NyFDLZCvfwHygNRy1F1L1CihRJV-a7_hVerjZ_Hw@mail.gmail.com)**
Zsolt Parragi identified a performance regression in a substring() function patch when handling negative start positions with long strings. The issue stems from removing a condition that returned empty strings early for cases where the ending position is ≤ 1. Testing with a large TOAST table showed execution time increased from 0.4ms to 2ms without the early return check. Thomas Munro acknowledged the problem, noting the function may be unnecessarily detoasting data even when it should skip work for zero slice lengths. He suggested restructuring the function to hoist length computations to avoid code duplication between single-byte and multi-byte character branches, aiming for broader improvements beyond the original bugfix scope.

Participants:
li.evan.chao@gmail.com, thomas.munro@gmail.com, zhjwpku@gmail.com, zsolt.parragi@percona.com

### **[pg\_upgrade: transfer pg\_largeobject\_metadata's files when possible](https://www.postgresql.org/message-id/aZOI_vpU0zayjBTj@nathan)**
Nathan Bossart has committed a patch to improve pg_upgrade's handling of pg_largeobject_metadata files. The patch allows pg_upgrade to transfer these files directly when possible, rather than requiring a full dump and restore process. This change aims to improve upgrade performance for databases with large objects. Andres Freund expressed appreciation for the work, noting that the current situation is significantly better than what existed in PostgreSQL version 18. Nathan Bossart acknowledged the feedback and thanked Andres for providing guidance and reviews throughout the development process. The discussion appears to be concluded with the successful commit of this optimization.

Participants:
andres@anarazel.de, hannuk@google.com, michael@paquier.xyz, nathandbossart@gmail.com, nitinmotiani@google.com, tgl@sss.pgh.pa.us

### **[Lowering the default wal\_blocksize to 4K](https://www.postgresql.org/message-id/E25A9AD2-EAD3-4372-AFD2-2627E4D5E3C5@percona.com)**
The discussion centers on lowering PostgreSQL's default WAL block size (XLOG_BLCKSZ) from 8KB to 4KB. Andy Pogrebnoi from Percona has prepared a patch for this change and conducted benchmark tests showing significant reductions in disk writes - ranging from 26% to 41% fewer bytes written across different thread counts. The 4KB configuration also showed comparable or better transaction throughput in most test scenarios. Andres Freund supports the change but identifies two issues requiring attention: the auto-tuning logic for wal_buffers needs fixing to properly account for different block sizes, and pg_upgrade compatibility from 8KB to 4KB should be manually tested. Despite proportionally larger headers with smaller blocks, both agree the benefits outweigh disadvantages. The change appears ready to proceed pending these technical fixes.

Participants:
andres@anarazel.de, andrew.pogrebnoi@percona.com, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[\[WIP\]Vertical Clustered Index \(columnar store extension\) \- take2](https://www.postgresql.org/message-id/2d5469cc8fd7e1deb3dbb41158ffc04c9ce2316a.camel@postgrespro.ru)**
Timur Magomedov from PostgresPro provides feedback on the Vertical Clustered Index (VCI) patch, highlighting two key advantages. First, he praises VCI's user API design, noting that it functions as an index rather than requiring full table conversion to columnar storage. Users can selectively put specific columns into columnar storage using clear SQL syntax, maintaining familiar index semantics where performance benefits come with insertion overhead trade-offs. Second, he emphasizes VCI's innovative Change Data Capture (CDC) implementation, which uses IAM and custom hooks in heapam.c instead of traditional triggers or logical replication. Magomedov suggests that VCI's CDC approach could potentially be extracted into a separate patch for broader review and use in other extensions, indicating its general utility beyond the VCI implementation itself.

Participants:
alvherre@kurilemu.de, iwata.aya@fujitsu.com, japinli@hotmail.com, kuroda.hayato@fujitsu.com, o.alexandre.felipe@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, t.magomedov@postgrespro.ru, tomas@vondra.me

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAFiTN-sYKNNW=8Z_qdqzyr9sA+-G-PpTSs5R1mVbPT6aKyEAqw@mail.gmail.com)**
The discussion centers on a patch implementing support for excluding tables from publications using a "FOR ALL TABLES EXCEPT" syntax. Multiple reviewers are providing feedback on v44 of the patch. Dilip Kumar raises several concerns about unclear function naming, confusing documentation language, and the need for better explanations about why multiple publications with exception lists aren't supported. David G. Johnston suggests improving terminology consistency by using "exclusions" instead of "exceptions" and questions the placement of certain documentation content. He also recommends clearer wording for comments about partition handling and publish_via_partition_root behavior. Shveta Malik proposes simplifying documentation by removing overly detailed paragraphs and suggests using "table" instead of "relation" terminology for clarity. She questions whether extensive mention of row filters and column lists is necessary in the EXCEPT TABLE context. Nisha Moond begins reviewing the patch and identifies potential optimization opportunities in the GetAllPublicationExcludedTables function, suggesting that reprocessing all relids when new parent IDs are added could be avoided by checking only newly added relids. The reviewers are working to improve code clarity, documentation accuracy, and performance optimization before the patch can be finalized.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Improve pg\_sync\_replication\_slots\(\) to wait for primary to advance](https://www.postgresql.org/message-id/CAA4eK1K4xS_DAAOx=4vwLkLTGreCwOj2MphPGbpqTFOvh_YjGA@mail.gmail.com)**
Amit Kapila raises concerns about the remaining patch for pg_sync_replication_slots() improvement. The main issue is that the patch could lead to infinite retries in worst-case scenarios. He describes a problematic sequence where different slots fail to sync in successive retry attempts due to various reasons: physical replication delays preventing WAL flushing to confirmed_flush_lsn, slot invalidation mismatches between standby and primary, etc. Despite concerns about the overall patch, Kapila acknowledges that one specific code change is useful - modifying the error reporting from conditional ERROR/LOG to always LOG when retrying slot synchronization via API, particularly for cases where synchronized_standby_slots GUC on primary wasn't configured correctly.

Participants:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, ashutosh.bapat.oss@gmail.com, houzj.fnst@fujitsu.com, itsajin@gmail.com, japinli@hotmail.com, jiezhilove@126.com, li.evan.chao@gmail.com, shveta.malik@gmail.com



## **Industry News**

### **[Ricursive Intelligence raises $335M at $4B valuation in 4 months](https://techcrunch.com/2026/02/16/how-ricursive-intelligence-raised-335m-at-a-4b-valuation-in-4-months)**
Ricursive Intelligence, a nascent AI startup, successfully raised $335 million at a $4 billion valuation within just four months of its founding. The rapid funding success is attributed to the startup's renowned founders, who are highly regarded figures in the AI industry. According to the report, these founders were so sought-after that various companies attempted to hire them before they decided to launch their own venture. The significant investment and high valuation demonstrate investor confidence in the team's expertise and potential to make substantial contributions to the artificial intelligence sector.

### **[Anthropic and Pentagon reportedly argue over Claude usage restrictions](https://techcrunch.com/2026/02/15/anthropic-and-the-pentagon-are-reportedly-arguing-over-claude-usage)**
Anthropic and the Pentagon are reportedly engaged in disagreements regarding the acceptable usage parameters for Claude, Anthropic's AI assistant. The central dispute appears to center on whether Claude can be utilized for mass domestic surveillance operations and autonomous weapons systems. This conflict highlights the ongoing tension between AI companies and government agencies over the ethical boundaries and appropriate applications of advanced artificial intelligence technology. The disagreement underscores broader concerns about AI governance, military applications of AI systems, and the responsibility of AI developers to establish usage restrictions for their technologies.

### **[India AI Impact Summit brings together major tech executives](https://techcrunch.com/2026/02/16/all-the-important-news-from-the-ongoing-india-ai-impact-summit)**
India is currently hosting a significant four-day AI Impact Summit that has attracted executives from major AI laboratories and Big Tech companies. The summit features high-profile attendees including representatives from OpenAI, Anthropic, Nvidia, Microsoft, Google, and Cloudflare, alongside government heads of state. This gathering represents a major international convergence focused on artificial intelligence developments and their global impact. The summit serves as a platform for discussing AI advancements, policy implications, and collaborative opportunities between leading technology companies and government officials from various nations.