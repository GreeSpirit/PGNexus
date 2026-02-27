# PostgreSQL Daily News#66 2026-02-27



## **PostgreSQL Articles**

### **[pgvector 0.8.2 Released](https://www.postgresql.org/about/news/pgvector-082-released-3245/)**
pgvector 0.8.2 has been released, addressing a critical security vulnerability. The update fixes a buffer overflow issue with parallel HNSW index builds, identified as CVE-2026-3172. This vulnerability could potentially leak sensitive data from other database relations or cause the database server to crash. Users are strongly encouraged to upgrade to this version when possible. pgvector is an open-source PostgreSQL extension that enables vector similarity search functionality within PostgreSQL databases.

`www.postgresql.org`

### **[Beyond the DBaaS Trap: Claiming Operational Independence for PostgreSQL](https://enterprisedb.com/blog/beyond-dbaas-trap-claiming-operational-independence-postgresql)**
The article discusses achieving operational independence for PostgreSQL by avoiding vendor lock-in with database-as-a-service offerings. It advocates for organizations running applications on Kubernetes-managed services from cloud providers to reclaim data sovereignty by migrating their PostgreSQL databases from proprietary DBaaS solutions into their existing Kubernetes clusters using CloudNativePG. The approach emphasizes that controlling the data layer is essential for operational independence and Sovereign AI initiatives, allowing organizations to maintain full control over their database infrastructure while leveraging Kubernetes orchestration capabilities.

`enterprisedb.com`

### **[PostgresCompare 1.1.104 Released](https://www.postgresql.org/about/news/postgrescompare-11104-released-3243/)**
PostgresCompare version 1.1.104 has been released with several new features for database schema comparison and synchronization. The tool connects to two live PostgreSQL databases, detects differences across tables, views, functions, indexes, and 30+ other object types, then generates SQL deployment scripts. Key new features include pre/post deploy scripts for custom SQL execution, global search functionality across projects and environments, keyboard navigation for difference lists, automatic dependency cascade selection to prevent incomplete deployments, and redesigned comparison cards with progress bars. The previous version 1.1.103 added destructive change warnings with risk level classification, hover previews for differences, and organized deployment script sections. PostgresCompare supports PostgreSQL versions 9.2 through 18 and runs on Windows, macOS, and Linux with a 30-day free trial available.

`www.postgresql.org`

### **[PostgreSQL 18.3, 17.9, 16.13, 15.17, and 14.22 Released!](https://www.postgresql.org/about/news/postgresql-183-179-1613-1517-and-1422-released-3246/)**
The PostgreSQL Global Development Group has released updates for all supported versions: 18.3, 17.9, 16.13, 15.17, and 14.22. This out-of-cycle release addresses several regressions from the previous update. Key fixes include resolving standby server transaction status errors, substring() function encoding issues related to CVE-2026-2006, pg_trgm strict_word_similarity crashes from CVE-2026-2007 fixes, and restoring json_strip_nulls() functions to immutable status for index compatibility. Additional fixes cover LATERAL UNION ALL query output, NOT NULL constraint conflicts, pg_stat functions for auxiliary processes, PL/pgSQL composite-type casting, and hstore binary input crashes. Users upgrading from PostgreSQL 18.0-18.2 must execute specific SQL commands to restore proper function volatility.

`www.postgresql.org`

### **[Pgpool-II 4.7.1, 4.6.6, 4.5.11, 4.4.16 and 4.3.19 are now officially released.](https://www.postgresql.org/about/news/pgpool-ii-471-466-4511-4416-and-4319-are-now-officially-released-3247/)**
Pgpool Global Development Group has released minor updates across five versions of Pgpool-II: 4.7.1, 4.6.6, 4.5.11, 4.4.16, and 4.3.19. Pgpool-II is a PostgreSQL enhancement tool that provides connection pooling, load balancing, and automatic failover capabilities. These are minor releases addressing bug fixes and improvements across multiple supported version branches. Users are advised to check the release notes for specific changes and can download source code and RPM packages from the official channels.

`www.postgresql.org`

### **[Replicate spatial data using AWS DMS and Amazon RDS for PostgreSQL](https://aws.amazon.com/blogs/database/replicate-spatial-data-using-aws-dms-and-amazon-rds-for-postgresql/)**
AWS demonstrates how to migrate spatial data between PostgreSQL databases using AWS Database Migration Service (DMS). The process requires PostGIS extension installation on both source and target databases, with geometry columns treated as large objects (LOBs). Key requirements include primary keys on tables, nullable geometry columns on targets, and proper LOB configuration with limited LOB mode and appropriate size limits. Common challenges involve LOB handling errors and PostGIS compatibility between database versions. The solution supports full load and change data capture for geospatial applications like mapping and asset tracking, requiring careful monitoring through CloudWatch logs and post-migration validation of geometry data integrity.

`Ramdas Gutlapalli`

### **[Vertical Scaling: Buying Time You Can't Afford](https://www.tigerdata.com/blog/vertical-scaling-buying-time-you-cant-afford)**
The article discusses the limitations of vertical scaling for PostgreSQL databases handling high-frequency data ingestion. While upgrading instances temporarily improves performance by providing more CPU, RAM, and storage, it doesn't address the underlying per-row overhead caused by MVCC headers, index entries, and WAL records. At 100K inserts per second, PostgreSQL generates 250-350MB of I/O for just 100MB of application data due to architectural design choices optimized for general workloads, not continuous append-only ingestion. Teams often spend 20-30% of their time on database operations, creating a costly cycle where each upgrade provides diminishing returns. The author suggests TimescaleDB as an architectural solution that maintains PostgreSQL compatibility while addressing the storage engine limitations for time-series workloads.

`Matty Stratton`



## **Popular Hacker Email Discussions**

### **[Show expression of virtual columns in error messages](https://www.postgresql.org/message-id/2f55b9a4-332f-45c7-9b27-590637a2bb9a@gmail.com)**
Matheus Alcantara submitted a v3 patch to improve error messages for virtual generated columns by showing the column expression instead of just "virtual". Tom Lane reviewed the patch and expressed concerns about the approach: expressions could make error messages too long, adding complexity to error paths is risky, and it makes virtual columns behave differently from stored columns. Lane suggests showing the expression's computed value instead, similar to stored columns. Alcantara investigated and found that virtual column values are never stored but computed on-demand by expanding expressions. Lane then proposed computing virtual column values during INSERT/UPDATE operations (even though not written to disk) to make them available for error messages and to prevent situations where rows can be inserted but not fetched due to runtime errors like overflow.

Participants:
matheusssilv97@gmail.com, nagata@sraoss.co.jp, peter@eisentraut.org, tgl@sss.pgh.pa.us

### **[Fix bug in multixact Oldest\*MXactId initialization and access](https://www.postgresql.org/message-id/C991344D-F38A-4EEC-903A-72B52FF887FA@gmail.com)**
Yura Sokolov proposed fixes for multixact OldestMemberMXactId and OldestVisibleMXactId initialization bugs. In version 3, he made array sizes precise by excluding auxiliary processes from OldestVisibleMXactId (MaxBackends elements only) while keeping OldestMemberMXactId at MaxBackends + max_prepared_xacts with adjusted procno indexing. He introduced precalculated variables MaxChildren, TotalProcs, and TotalXactProcs for cleaner code organization. Chao Li acknowledged this approach matches his initial thinking but questioned whether the complexity justified the shared memory optimization in hot paths. Sami Imseih expressed concerns about unnecessary runtime complexity from assertion checks, preferring simpler centralized calculations for future-proofing rather than adding inline function complexity. Yura defended runtime assertions as protection against future bugs, arguing they would have prevented the original issue.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, samimseih@gmail.com, y.sokolov@postgrespro.ru

### **[Add starelid, attnum to pg\_stats and leverage this in pg\_dump](https://www.postgresql.org/message-id/CAA5RZ0vY5jHXQEOyUdjW7tPrXb9TY_bdr8ZpCRuALj1zU5DD_w@mail.gmail.com)**
A patch is proposed to expose pg_statistic.starelid and attnum in the pg_stats view, then modify pg_dump to use starelid instead of schemaname+relname combinations. This change aims to improve query performance by avoiding sequential scans of the large pg_statistic table caused by security barrier optimization issues. Sami Imseih supports the proposal and provides detailed feedback on column ordering, data types, and documentation. Tom Lane agrees with the concept but objects to the "starelid" name, suggesting "tableid" or "tablerelid" instead, arguing it exposes implementation details contrary to pg_stats' purpose of hiding pg_statistic's physical representation. Lane also criticizes the proposed column ordering as random and suggests two alternative arrangements. The discussion focuses on naming conventions, column positioning, and maintaining the abstraction layer that pg_stats provides over the underlying catalog structure.

Participants:
corey.huinker@gmail.com, nathandbossart@gmail.com, samimseih@gmail.com, tgl@sss.pgh.pa.us

### **[More speedups for tuple deformation](https://www.postgresql.org/message-id/CAApHDvpBuTZLOQLfDETa9U-je2scAe3_BNXZScwr3hLPc6Hf3g@mail.gmail.com)**
The discussion focuses on optimizations for tuple deformation in PostgreSQL, specifically around CompactAttribute struct sizing. David Rowley explains that while CompactAttribute could be reduced from 8 to 6 bytes to save memory, the current 8-byte alignment allows efficient LEA instruction usage for address calculations. Reducing to 6 bytes would require two LEA instructions instead of one, likely negating performance benefits. The conversation also addresses where to place the deform_bench benchmarking tool. Álvaro Herrera initially suggests creating a proper benchmarking suite under src/benchmark, while Andres Freund advocates for not delaying integration of useful tools and proposes using a single extension to avoid overhead. They agree on not installing benchmark modules by default and debate between src/benchmark versus src/test/modules locations.

Participants:
alvherre@kurilemu.de, andres@anarazel.de, dgrowleyml@gmail.com, johncnaylorls@gmail.com, li.evan.chao@gmail.com, zsolt.parragi@percona.com

### **[pgstat include expansion](https://www.postgresql.org/message-id/202602261253.g4k4e6likctn@alvherre.pgsql)**
Alvaro Herrera committed changes to remove transam.h and relcache.h from pgstat.h, followed by removing wait_event.h from pgstat.h. The latter change required adding pgstat.h includes to several .c files and handling xlogreader.c inclusion within #ifndef FRONTEND to avoid CI complaints from pg_rewind and pg_waldump. Andres Freund expressed concern about potential breakage in extensions that use WaitLatch with WAIT_EVENT_EXTENSION but haven't included wait_event.h directly. The discussion explores including wait_event.h in latch.h as a compromise, though this could cause pollution through other widely-included headers like proc.h and libpq.h. Both developers agree on fixing fallout in the PostgreSQL source tree for cleanliness, while debating the best approach to minimize extension breakage.

Participants:
alvherre@kurilemu.de, amit.kapila16@gmail.com, andres@anarazel.de, hlinnaka@iki.fi, michael@paquier.xyz

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAA4eK1Lxp8_HJv3sZNPx-oM1CUUi5p2UYa1PoVTe-QOEEp+3Ww@mail.gmail.com)**
The discussion centers on implementing EXCEPT TABLE syntax for PostgreSQL publications, allowing users to exclude specific tables from ALL TABLES publications. The patch proposes syntax like "CREATE PUBLICATION pub FOR ALL TABLES EXCEPT TABLE (table1, table2)". Key technical decisions include restricting EXCEPT clauses to only root partitioned tables (not individual partitions) to reduce complexity, and preventing partition attachment when the target table is in an EXCEPT clause. Performance concerns were raised about querying pg_publication_rel for EXCEPT tables, but contributors clarified that for ALL TABLES publications, only EXCEPT entries are stored in pg_publication_rel, making additional indexing unnecessary. Recent feedback addresses implementation details including error messages, memory management, pg_dump support issues, and code organization. The team agreed to simplify the initial version by excluding individual partition support, focusing on the core EXCEPT functionality for root tables.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, lepihov@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CA+TgmoYjcBA6dw3nwiyfDzPXTCrxTZPXDMrc2TrDJcL1cPK6iA@mail.gmail.com)**
Robert Haas responds to Alexandra Wang's detailed review of the pg_plan_advice patch. He acknowledges the challenge of getting senior hackers to review this large patch and discusses the key issue of detecting planner behavior changes over time. Haas believes test_plan_advice should catch future breakage when new optimizations are added, but acknowledges this may burden future patch authors. He considers annotating planner nodes with more information to reduce inference requirements but worries about potential ABI compatibility issues if bugs are discovered later. Haas agrees with several technical fixes Wang identified, including correcting list deletion logic, dereferencing boolean pointers, fixing memory context handling, and adding permission checks to shared advice collection. He also removes unused variables and code as suggested.

Participants:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us



## **Industry News**

### **[Google paid startup Form Energy $1B for its massive 100-hour battery](https://techcrunch.com/2026/02/26/google-paid-startup-form-energy-1b-for-its-massive-100-hour-battery)**
Google has acquired startup Form Energy for $1 billion, focusing on the company's revolutionary 100-hour battery technology. Form Energy specializes in long-duration energy storage solutions that can store power for extended periods, addressing one of the biggest challenges in renewable energy grid integration. The acquisition represents a major strategic move by Google to strengthen its position in the clean energy sector and support its ambitious sustainability goals. The deal will enable Form Energy to raise additional funding before a potential public offering next year, while giving Google access to cutting-edge battery technology that could transform energy storage capabilities across various applications.

### **[Mistral AI inks a deal with global consulting giant Accenture](https://techcrunch.com/2026/02/26/mistral-ai-inks-a-deal-with-global-consulting-giant-accenture)**
French AI startup Mistral AI has announced a strategic partnership with global consulting firm Accenture, expanding the reach of its large language models to enterprise clients worldwide. This collaboration comes as Accenture continues to diversify its AI partnerships, having recently signed similar deals with competitors OpenAI and Anthropic. The partnership will enable Accenture to integrate Mistral's AI technology into its consulting services, helping clients implement advanced language models across various business applications. This move positions Mistral AI to compete more effectively in the enterprise market against established players like OpenAI, while giving Accenture access to European AI technology that may appeal to clients seeking alternatives to US-based AI providers.

### **[Trace raises $3M to solve the AI agent adoption problem in enterprise](https://techcrunch.com/2026/02/26/trace-raises-3-million-to-solve-the-agent-adoption-problem)**
Trace has secured $3 million in seed funding to address AI agent adoption challenges in enterprise environments. The funding round includes investments from Y Combinator, Zeno Ventures, Transpose Platform Management, Goodwater Capital, Formosa Capital, and WeFunder. The startup is focused on solving the complex problem of implementing and managing AI agents within large organizations, where integration challenges and adoption barriers often prevent successful deployment. Trace's platform aims to streamline the process of introducing AI agents into enterprise workflows, making it easier for companies to realize the benefits of autonomous AI systems. This funding will enable the company to develop its technology further and expand its market presence in the rapidly growing enterprise AI sector.