# PostgreSQL Daily News#49 2026-02-11



## **PostgreSQL Articles**

### **[add-mcp: Install MCP Servers Across Coding Agents and Editors](https://neon.com/blog/add-mcp)**
Andre Landgraf introduces add-mcp, a CLI tool that simplifies installing MCP (Model Context Protocol) servers across different coding agents and editors. The tool addresses the problem that each development environment looks for agent skills in different locations, making setup repetitive and documentation maintenance difficult. Similar to Vercel's add-skill CLI, add-mcp standardizes the installation process for MCP servers, which provide contextual information to AI coding assistants. This streamlines the developer experience when working with multiple AI-powered development tools that rely on MCP servers for enhanced functionality.

`Andre Landgraf`

### **[Build a custom solution to migrate SQL Server HierarchyID to PostgreSQL LTREE with AWS DMS](https://aws.amazon.com/blogs/database/build-a-custom-solution-to-migrate-sql-server-hierarchyid-to-postgresql-ltree-with-aws-dms/)**
This AWS blog post details a solution for migrating SQL Server HierarchyID columns to PostgreSQL LTREE using AWS DMS. The process involves setting up source SQL Server tables with HierarchyID data, creating target PostgreSQL tables with LTREE extension, and using AWS DMS for migration. The solution includes converting binary HierarchyID format (like /1/1/1/) to LTREE's dot-separated format (1.1.1). Key steps include running AWS DMS with full load and CDC, adding generated LTREE columns to transform data automatically, and resuming replication for ongoing changes. The post provides practical examples, function mapping between HierarchyID and LTREE operations, and complete migration workflow for preserving hierarchical data structures during database transitions.

`Shashank Kalki`

### **[Monitoring query plans with pgwatch and pg_stat_plans](https://www.cybertec-postgresql.com/en/monitoring-query-plans-with-pgwatch-and-pg_stat_plans/)**
The PostgreSQL ecosystem introduces the pg_stat_plans extension, which tracks aggregated statistics for query plans rather than SQL statements like pg_stat_statements does. Ahmed Gouda demonstrates integrating this extension with pgwatch monitoring system to analyze resource-intensive query plans. The setup involves writing a SQL query that joins pg_stat_statements with pg_stat_plans to retrieve plans for high-resource queries, configuring pgwatch with custom metrics and sources using YAML files, and visualizing results through Grafana dashboards. The author shows how to create a new metric definition, run pgwatch to collect measurements, and build dashboard panels that display different execution plans for the same query. This integration allows database administrators to monitor and debug query plan variations without requesting query text from development teams.

`Ahmed Gouda`



## **Popular Hacker Email Discussions**

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CA+TgmoaCdsuvNn6T6SfQ_0YD2Hh2+hgTXh9fTGHQhPg1zvy2rQ@mail.gmail.com)**
Robert Haas has committed patches 0001-0005 for the pg_plan_advice feature and released v15 with the main patch now being 0002. Key changes include adding a new GUC pg_plan_advice.feedback_warnings (disabled by default) to warn about non-working plan advice strings without requiring EXPLAIN. The update fixes several issues: consistent use of get_namespace_name_or_temp to resolve INDEX_SCAN and INDEX_ONLY_SCAN advice problems with temporary tables, correction of spurious NO_GATHER advice generation in pgpa_scan.c during certain join scenarios, and a logic error fix for JOIN_ORDER advice conflicting incorrectly with PARTITIONWISE advice. Documentation improvements from David G. Johnston were incorporated with additional modifications. Patches 0003-0004 are included for test compatibility but belong to a separate discussion thread.

Participants:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[Pasword expiration warning](https://www.postgresql.org/message-id/aYu1xUwQ-pqueeJJ@nathan)**
Nathan Bossart announced his intention to commit changes related to password expiration warning functionality tomorrow. This appears to be the final step in a discussion thread that involved multiple PostgreSQL community members. The commit represents the culmination of development work on implementing or improving password expiration warnings in PostgreSQL. Given the extensive participant list including prominent PostgreSQL contributors, this feature likely underwent thorough review and discussion before reaching the commit stage. The brevity of Nathan's message suggests the technical details and consensus-building occurred in earlier exchanges within this thread.

Participants:
andrew@dunslane.net, euler@eulerto.com, gilles@darold.net, japinli@hotmail.com, li.evan.chao@gmail.com, liuxh.zj.cn@gmail.com, nathandbossart@gmail.com, niushiji@gmail.com, peter@eisentraut.org, shiyuefei1004@gmail.com, tgl@sss.pgh.pa.us, tsinghualucky912@foxmail.com, zsolt.parragi@percona.com

### **[Decoupling our alignment assumptions about int64 and double](https://www.postgresql.org/message-id/LV8PR15MB6488B8CD9D5AB1CDF2E03F92D665A@LV8PR15MB6488.namprd15.prod.outlook.com)**
Aditya Kamath from IBM successfully tested Tom Lane's POC patch addressing AIX alignment issues with int64 and double types. The patch enables proper handling of DOUBLE PRECISION and BIGINT columns during pg_upgrade operations. Testing involved upgrading from PostgreSQL 15 to master branch on AIX, with all data preserved correctly after upgrade. Both GNU build and Meson test suites passed successfully. Tom Lane provided a refined version of the patch, propagating BEGIN/END_CATALOG_STRUCT macros across all catalog headers and implementing push/pop pragma variants for better future compatibility. Thomas Munro noted that IBM has moved away from xlc compiler support, suggesting the new IBM OpenXL C/C++ compiler based on LLVM/Clang might handle these alignment issues better. Tom Lane expressed interest in testing the new toolchain once the gcc-based port is complete.

Participants:
aditya.kamath1@ibm.com, andres@anarazel.de, postgres-ibm-aix@wwpdl.vnet.ibm.com, sriram.rk@in.ibm.com, tgl@sss.pgh.pa.us, thomas.munro@gmail.com

### **[Miscellaneous message fixes](https://www.postgresql.org/message-id/20260210.143752.1113524465620875233.horikyota.ntt@gmail.com)**
Kyotaro Horiguchi submitted patches addressing various PostgreSQL error message issues including non-standard wording, grammatical mistakes, and formatting inconsistencies. The patches covered problems in guc_table.c (using "Show" instead of "Shows"), partbounds.c (inconsistent hint message structures and incorrect present tense usage), wait.c (inconsistent "timeout value" vs "timeout" wording), and extended_stats_funcs.c (double quoting issues from combining quote_identifier() with format string quotes). However, Horiguchi noted the initial patch set caused test failures. Michael Paquier and Álvaro Herrera provided feedback on the quoting issues, with Tom Lane clarifying that quote_identifier() should not be used in error messages as it conflicts with PostgreSQL's style guide for translatable messages. Michael Paquier subsequently committed fix f33c58577422 removing the quote_identifier() calls and adjusting the error string formatting to match project standards.

Participants:
alvherre@kurilemu.de, horikyota.ntt@gmail.com, michael@paquier.xyz, tgl@sss.pgh.pa.us

### **[PGPROC alignment \(was Re: pgsql: Separate RecoveryConflictReasons from procsignals\)](https://www.postgresql.org/message-id/1cb0d7e9-d6dd-4517-a7cd-0ad98e1207f3@iki.fi)**
The discussion focuses on optimizing PGPROC structure alignment for better performance. Andres Freund suggests making PGPROC a power of two size to optimize GetPGProcByNumber() indexing, which currently requires expensive 64-bit multiplication instead of faster bit shifts. He notes this shows up in LWLock contention heavy workloads and recommends separating frequently-changed fields from static ones to avoid false sharing issues. Heikki Linnakangas proposes cache line alignment as a compromise, providing a patch that aligns to cache line boundaries rather than expanding to 1024 bytes. Bertrand Drouvot suggests reordering fields logically, which reduces the structure to 832 bytes but requires 64 bytes of padding when using explicit alignment. The participants agree on grouping related fields together for better cache behavior and readability, though Andres emphasizes the need for concrete benchmarks on large machines to validate performance improvements.

Participants:
andres@anarazel.de, bertranddrouvot.pg@gmail.com, hlinnaka@iki.fi

### **[Instability in postgres\_fdw regression tests](https://www.postgresql.org/message-id/3866274.1770743162@sss.pgh.pa.us)**
Tom Lane reported intermittent failures in postgres_fdw regression tests affecting multiple buildfarm animals using meson. The issue involves non-deterministic row ordering in an UPDATE...RETURNING query, where row 2010 sometimes appears at the beginning instead of the end of results. Lane traced this to opportunistic page pruning behaving differently when concurrent transactions exist, despite autovacuum being disabled on the test table. The test assumes sequential insertion order but sometimes rows are placed in free space earlier in the table. Lane proposes fixing this by wrapping the UPDATE in a CTE with ORDER BY c1 to ensure deterministic output. Nathan Bossart agrees with the proposed fix, noting he previously investigated this issue. Alexander Lakhin provided additional context referencing his earlier reproduction and reporting of similar failures, confirming autovacuum involvement despite being disabled.

Participants:
exclusion@gmail.com, nathandbossart@gmail.com, tgl@sss.pgh.pa.us

### **[\[WIP\]Vertical Clustered Index \(columnar store extension\) \- take2](https://www.postgresql.org/message-id/CAHut+PsH4ticwZJtmAAEz5Uzv9YadrMVj-JXZvp4PJKJtkT6bA@mail.gmail.com)**
Peter Smith submitted a rebased set of VCI patches for the Vertical Clustered Index columnar store extension. Álvaro Herrera responded with strong concerns about the current design direction, stating that the full-blown executor implementation in contrib/ using hooks in heapam and transaction machinery is unacceptable and won't be accepted. He advocates for reimplementing it as a new table AM in src/backend/access/ with proper executor support, acknowledging this would be a huge undertaking requiring significant employer buy-in. Despite the risks, Herrera emphasizes that a good columnar store is crucial for PostgreSQL. Alexandre Felipe supports the project and proposes a phased development approach with design principles focusing on pluggability, usefulness, simplicity, and limited scope. He outlines three phases: preparatory work with hooks, core implementation for scans with aggregations, and opportunistic ROS updates. The discussion centers on finding an acceptable architectural direction rather than continued minor rebasing.

Participants:
alvherre@kurilemu.de, iwata.aya@fujitsu.com, japinli@hotmail.com, kuroda.hayato@fujitsu.com, o.alexandre.felipe@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, t.magomedov@postgrespro.ru, tomas@vondra.me

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAJpy0uC_0uvhmXyWegKGRozhpyoLGHwHrUAK=Wk+bSmzqLMoSw@mail.gmail.com)**
The discussion focuses on handling EXCEPT lists when combining multiple publications in PostgreSQL logical replication. Participants debate whether publications with EXCEPT clauses should be combinable. Peter Smith argues that "pub1: FOR ALL TABLES EXCEPT (tab1)" and "pub2: FOR TABLE tab1" should be combinable since they represent non-contradictory sets. David G. Johnston supports this view, suggesting publication combinations should be purely additive like system grants. However, Shveta Malik and the team decide to restrict combining multiple publications that both use EXCEPT lists, citing implementation complexity without clear business use cases. This becomes particularly complex with partitioned tables having different publish_via_partition_root settings. Vignesh C confirms this approach is implemented in v42 patch, where conflicts are resolved by giving priority to root table publications. The restriction aims to keep the initial implementation simple while leaving room for future enhancement if valid use cases emerge.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/19720.1770709587@localhost)**
Antonin Houska reported an issue where HeapTupleSatisfiesMVCCBatch() is incorrectly called during logical decoding with historic MVCC snapshots, causing problems with REPACK operations. The root cause is that the IsMVCCSnapshot macro includes both regular and historic MVCC snapshots, but page-at-a-time scans should only work with regular MVCC snapshots. During logical decoding, this leads to incorrect hint bit setting on pg_class entries, resulting in "cache lookup failed for relation" errors.

Andres Freund confirmed this is unintentional behavior and proposed restricting page-at-a-time scans to exclude historic snapshots by modifying the condition to disable pagemode for historic MVCC snapshots. Houska tested the fix and confirmed it resolves the issue. For a proper solution, Freund suggests splitting IsMVCCSnapshot into separate functions: IsMVCCSnapshot() for regular snapshots only, and IsMVCCLikeSnapshot() for both types, then reviewing all existing callers.

Participants:
ah@cybertec.at, andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[Changing shared\_buffers without restart](https://www.postgresql.org/message-id/CAExHW5ui9-aKtS-vwUYMQ4uSmi54cvLpvqrf29B8L69ZJa766g@mail.gmail.com)**
The discussion focuses on Ashutosh Bapat's patch for dynamically changing shared_buffers without server restart. The approach uses memfd_create() and address space reservation with two shared memory segments instead of the previous six. Jakub Wartak conducted benchmarks showing minimal performance regression on single-socket systems, but some degradation on NUMA machines with the earlier version. The latest patches (20260209) appear to resolve most performance concerns. However, several bugs were identified: huge pages support has silent failures and incorrect size calculations, fallocate() causes slow startup times (49 seconds with 64GB shared_buffers), and huge page allocation fails even with sufficient free pages. Andres Freund questions the necessity of multiple mappings versus using MADV_DONTNEED, suggesting the complexity may not justify the benefits. Heikki Linnakangas proposes a redesigned shared memory interface allowing on-demand segment creation, which would benefit extensions and provide a cleaner API. The current implementation needs fixes for huge pages support and startup performance optimization.

Participants:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi, jakub.wartak@enterprisedb.com, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Improve pg\_sync\_replication\_slots\(\) to wait for primary to advance](https://www.postgresql.org/message-id/CAJpy0uCCUkweQad2U6n0KRcrjEJe-MzR-Nsw4d6bwQSdf1N8EA@mail.gmail.com)**
Zhijie Hou has submitted a revised patch set to improve pg_sync_replication_slots() functionality, addressing previous feedback from shveta malik. The discussion focuses on enhancing slot synchronization by making the function wait and retry until failover slots are properly synchronized. The patch set includes three components: simplifying function parameters by using slot properties instead of redundant parameters, consolidating duplicate WAL flush checks into a single location to prevent coding errors, and implementing the main improvement for waiting behavior. shveta malik provided detailed technical feedback on slot update return values, comment accuracy, and sanity checks for skip reasons. A key unresolved question emerged regarding whether the function should wait for locally invalidated slots when remote slots remain valid, as this could affect failover scenarios where valid remote slots become invalid locally post-failover.

Participants:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, ashutosh.bapat.oss@gmail.com, houzj.fnst@fujitsu.com, itsajin@gmail.com, japinli@hotmail.com, jiezhilove@126.com, li.evan.chao@gmail.com, shveta.malik@gmail.com

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/acPtXlUKpmJHvXx4vRwPYELf-LG9IF56tzUlJiPJ0_83g96bKdDftJcMCN3NjgsHe2ovovJAgADBWbytYx_yMKY6xArr-_NL8ywDf-gBf4E=@dunklau.fr)**
Ronan Dunklau responds to Andrey Silitskiy's feedback regarding walsender timeout implementation for logical replication. The discussion centers on adding a timeout parameter to bound the time required for PostgreSQL restarts or stops when walsenders are configured. Silitskiy noted that while the current implementation allows similar functionality, Dunklau's approach offers a simpler interface, though naming concerns exist due to the existing wal_sender_timeout parameter potentially causing user confusion.

Dunklau clarifies his use case: ensuring bounded restart/stop times with walsenders while avoiding issues during pg_upgrade operations. He explains that immediate shutdown solves timing problems, but creates complications for upgrades when logical replication slots have pending changes. Users would need to either disable the behavior by switching to wait_flush or risk upgrade failures. The timeout approach addresses these scenarios more effectively than current alternatives, making it preferable for operational reliability during maintenance procedures.

Participants:
a.silitskiy@postgrespro.ru, aekorotkov@gmail.com, amit.kapila16@gmail.com, andres@anarazel.de, dilipbalaut@gmail.com, horikyota.ntt@gmail.com, htamfids@gmail.com, kuroda.hayato@fujitsu.com, masao.fujii@gmail.com, michael@paquier.xyz, osumi.takamichi@fujitsu.com, peter.eisentraut@enterprisedb.com, ronan@dunklau.fr, sawada.mshk@gmail.com, smithpb2250@gmail.com, v.davydov@postgrespro.ru



## **Industry News**

### **[Nearly half of xAI's founding team has now left the company](https://techcrunch.com/2026/02/10/nearly-half-of-xais-founding-team-has-now-left-the-company?utm_campaign=daily_pm)**
Nearly half of xAI's founding team has departed the company, raising concerns about the AI startup's stability as it prepares for a potential IPO. The departures represent a significant loss of talent and institutional knowledge for the company founded by Elon Musk. The cumulative impact of these exits is particularly alarming given the substantial work that remains to be done at xAI before it can face the increased scrutiny that comes with going public. The departures could signal underlying challenges within the organization or disagreements about the company's direction and future plans.

### **[Former GitHub CEO raises record $60M dev tool seed round at $300M valuation](https://techcrunch.com/2026/02/10/former-github-ceo-raises-record-60m-dev-tool-seed-round-at-300m-valuation?utm_campaign=daily_pm)**
Thomas Dohmke, former CEO of GitHub, has raised a record-breaking $60 million seed round for his new startup at a $300 million valuation. The company focuses on developing AI systems designed to help developers better manage all the code that AI agents produce. This represents one of the largest seed funding rounds ever recorded in the developer tools space, highlighting investor confidence in AI-powered development solutions and Dohmke's track record from his time leading GitHub.

### **[YouTube rolls out an AI playlist generator for Premium users](https://techcrunch.com/2026/02/10/youtube-rolls-out-an-ai-playlist-generator-for-premium-users?utm_campaign=daily_pm)**
YouTube Music is rolling out a new AI-powered playlist generation feature exclusively for Premium users on iOS and Android platforms. The feature allows users to create custom playlists using text prompts, leveraging artificial intelligence to curate music based on user preferences and descriptions. This represents YouTube's latest effort to enhance its music streaming service with AI capabilities, competing with similar features offered by other music platforms. The AI playlist generator aims to provide a more personalized and intuitive way for users to discover and organize music content.