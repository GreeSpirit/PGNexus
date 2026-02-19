# PostgreSQL Daily News#58 2026-02-19



## **PostgreSQL Articles**

### **[A Day in the Life: Inside a Director, Product Operations Role at EDB](https://enterprisedb.com/blog/day-life-inside-director-product-operations-role-edb)**
Rishi Patel, Director of Product Operations at EDB, discusses his role in managing EDB's product development processes and rhythms. He emphasizes the importance of constructive conversations in product operations and highlights how EDB's remote-first culture enables him to drive global innovation while working from home. The interview provides insights into the operational aspects of product management at EDB, a major PostgreSQL company, showing how product operations roles contribute to scaling enterprise database solutions.

`enterprisedb.com`

### **[How to Break Your PostgreSQL IIoT Database and Learn Something in the Process](https://www.tigerdata.com/blog/how-to-break-postgresql-iiot-database-learn-something-in-process)**
This article advocates treating PostgreSQL databases for Industrial Internet of Things applications like engineering prototypes by conducting destructive stress testing to identify failure points before production deployment. The author recommends measuring table size, performance metrics, and server resources while systematically growing database size until failure conditions are reached. Key techniques include using PostgreSQL's built-in functions to monitor heap, index, and TOAST sizes, timing actual production queries with EXPLAIN ANALYZE, and generating large datasets using generate_series functions. The testing approach involves setting clear limits for storage capacity, query response times, and ingest rates, then iteratively growing the database while monitoring performance. Results help identify bottlenecks, optimize indexing strategies, plan future hardware needs, and establish operational safety margins below maximum tested capacity.

`Douglas Pagnutti`

### **[PostgreSQL 19: part 2 or CommitFest 2025-09](https://postgrespro.com/blog/pgsql/5972743)**
PostgreSQL 19 continues development with changes from the September 2025 CommitFest. Key additions include GROUP BY ALL syntax, enhanced window functions with NULL value handling, and event triggers in PL/Python. New features cover random date/time generation within ranges, base64url encoding/decoding functions, and a debug_print_raw_parse parameter. The log_lock_waits parameter is now enabled by default. Improvements include pg_stat_progress_basebackup backup type tracking, vacuumdb statistics collection for partitioned tables, and buffer cache optimization using clock-sweep algorithm for finding free buffers.

`Pavel Luzanov`



## **Popular Hacker Email Discussions**

### **[libpq: Bump protocol version to version 3\.2 at least until the first/second beta](https://www.postgresql.org/message-id/CAOYmi+=Hi_on8cGe2TV7DRLbcvVQmrhdkyzOXbhT_6xqf02+4A@mail.gmail.com)**
Jacob Champion and Jelte Fennema-Nio are finalizing a patch to bump libpq's protocol version to 3.2. The discussion focuses on error handling when servers don't support the new protocol version. Jacob implemented logic to detect server bugs by looking for protocol violation codes or literal grease version numbers in error messages, providing users with helpful diagnostic information and a documentation URL. Jelte tested the patch against a legacy PgBouncer deployment and confirmed it works correctly, showing appropriate error messages that guide users to workaround documentation. Both agreed to be conservative about error detection heuristics to avoid false positives. Jacob plans to commit the squashed v8 version, while Jelte hopes his separate GoAway patch might still be considered for PostgreSQL 19, though Jacob indicated limited availability for the current cycle.

Participants:
andres@anarazel.de, david.g.johnston@gmail.com, hlinnaka@iki.fi, jacob.champion@enterprisedb.com, postgres@jeltef.nl, robertmhaas@gmail.com

### **[add assertion for palloc in signal handlers](https://www.postgresql.org/message-id/2f25aa74-990d-4412-a032-c876dbcff667@iki.fi)**
Nathan Bossart proposed adding assertions to detect memory allocations in signal handlers, which Andres Freund and Heikki Linnakangas supported. The patch uses existing wrapper_handler infrastructure and passed check-world testing. However, Kirill Reshke discovered the assertion fails in single-user mode where ProcessInterrupts() calls ereport(), which triggers palloc. Nathan confirmed similar issues occur with SIGQUIT handling in client backends, as both die() and quickdie() call ereport() from signal handlers. Andres identified that die() shouldn't call ereport() outside single-user mode and criticized quickdie()'s ereport() usage as unsafe, arguing that attempting client communication from signal handlers risks data structure corruption. Nathan expressed concern about assertion noise and suggested developing a plan to address these violations before deployment.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, nathandbossart@gmail.com, reshkekirill@gmail.com

### **[convert SpinLock\* macros to static inline functions](https://www.postgresql.org/message-id/aZX2oUcKf7IzHnnK@nathan)**
Nathan Bossart proposes converting PostgreSQL's spin.h macros to static inline functions as prerequisite work for adding signal handler assertions. The change was previously discussed with general agreement. However, the conversion causes build failures due to widespread use of volatile qualifiers in spinlock-related code, which Nathan suggests removing since they predate commit 0709b7ee72 that made spinlocks compiler barriers. Fabrízio de Royes Mello supports the proposal after confirming no PG_TRY..PG_CATCH issues exist. Andres Freund agrees with removing volatile from most code but expresses concern about removing it from SpinLockAcquire(), warning that compiler optimizations could prevent proper lock acquisition without volatile or compiler barriers. He suggests keeping the current SpinLockAcquire() signature with volatile for documentation purposes. All participants agree on removing the unused SpinLockFree() function, which was agreed upon in 2020 but never implemented.

Participants:
andres@anarazel.de, fabriziomello@gmail.com, hlinnaka@iki.fi, nathandbossart@gmail.com

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CA+TgmoYg8uUWyco7Pb3HYLMBRQoO6Zh9hwgm27V39Pb6Pdf=ug@mail.gmail.com)**
Robert Haas released version 16 of the pg_plan_advice patch, seeking code review and testing help. A key change replaces get_relation_info_hook with build_simple_rel_hook to handle non-relation RTEs properly, enabling control of Gather and Gather Merge nodes in join problems involving subqueries. The patch includes several bug fixes discovered through testing with feedback_warnings enabled: corrected order of operations in pgpa_walk_recursively(), fixed conflicts between GATHER/GATHER_MERGE and PARTITIONWISE advice, and resolved issues with partitionwise aggregation. Documentation was expanded with known limitations and clearer explanations of "matched" vs "partially matched" results. One test failure remains due to self-join elimination behavior requiring further analysis.

Participants:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[Optional skipping of unchanged relations during ANALYZE?](https://www.postgresql.org/message-id/CAJSLCQ3CoEjd=DiANwyBybFaOu24PZFXo5f8EQUbsZ+UL0wL0A@mail.gmail.com)**
The discussion focuses on a proposed PostgreSQL feature to allow selective ANALYZE operations. VASUKI M has developed two distinct options: MISSING_STATS_ONLY for analyzing relations without statistics, and MODIFIED_STATS for analyzing relations with potentially stale statistics due to modifications. Andreas suggested alternative naming like SKIP_UNMODIFIED. Robert Treat supports keeping the two functionalities separate, noting they serve different use cases - one for ensuring new columns/statistics are covered, another for updating active tables similar to autoanalyze but on-demand. He emphasizes that MISSING_STATS needs to work standalone for integration with vacuumdb. Robert also reminds VASUKI to create separate commitfest entries for each patch. The consensus appears to favor maintaining semantic clarity through distinct options rather than combining them.

Participants:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, rob@xzilla.net, robertmhaas@gmail.com, samimseih@gmail.com, vasukianand0119@gmail.com

### **[Better shared data structure management and resizable shared data structures](https://www.postgresql.org/message-id/CAExHW5vz+PUHHUuzGRwtyx-mPLQk3nCZXxrFqnruRadEFrO5Xg@mail.gmail.com)**
Ashutosh Bapat is developing patches for better shared data structure management and resizable shared data structures in PostgreSQL. The discussion focuses on using MADV_POPULATE_WRITE and madvise/fallocate for memory management instead of multiple mappings. Key points include: using MADV_POPULATE_WRITE during runtime resizing to avoid startup slowdowns, treating structures with max_size smaller than page size as fixed structures, and ensuring resizable structures start on page boundaries. The approach avoids the complexity of multiple segments but loses protection against out-of-bounds access that would cause segfaults. Bapat has reworked tests into a stable TAP test format. The implementation currently works only on Linux with MADV_POPULATE_WRITE and MADV_REMOVE support for anonymous shared memory, requiring platform-specific handling for other systems.

Participants:
andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi

### **[index prefetching](https://www.postgresql.org/message-id/ttuirsz636fr227k7bfbsuqnmpxknvq2hw6yeg56xb45txjxkd@kvubmvhrd32a)**
The discussion focuses on optimizing index prefetching heuristics to prevent performance regressions while maintaining benefits. Peter Geoghegan acknowledges that current heuristics are too conservative, having been overfitted to adversarial queries as a stopgap measure. Andres Freund conducted detailed testing comparing different prefetching configurations, finding that aggressive prefetching without yielding often performs best when only data is evicted, but yields mixed results when both data and index pages are evicted. He identified a critical bug in mark-restore functionality where batches could be freed twice due to incorrect tracking of markBatchFreed. The team discusses testing methodologies, with Andres recommending dm_delay for simulating higher latency storage (0.5-4ms range typical in cloud environments) to better identify prefetching issues that aren't apparent on low-latency NVMe. Tomas Vondra suggests adding metrics for "unconsumed IO" to EXPLAIN ANALYZE output to help automate performance regression detection. Peter provides an updated branch with VM cache and rescan optimizations.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAA4eK1KWqttt3UMdR8P0wYyqDO6cuLhuvGb5cDpuctG8F10EFA@mail.gmail.com)**
The discussion focuses on implementing an EXCEPT TABLE clause for PostgreSQL publications, allowing users to exclude specific tables from ALL TABLES publications. Amit Kapila and shveta malik are reviewing patch v45 by vignesh C, providing detailed feedback on code structure and error handling.

Key issues identified include: incorrect index usage in publication_has_any_exception function, missing except-flag validation in is_relid_published_explicitly, function naming inconsistencies, and overly complex code paths in CreatePublication that process all publication types uniformly rather than separating logic by type. Error messages need improvement, particularly for temporary/unlogged tables and subscription creation with multiple EXCEPT TABLE publications.

Specific technical concerns involve proper handling of partition hierarchies, syscache usage, and ensuring the patch doesn't perform unnecessary operations for ALL SEQUENCES cases. The reviewers suggest consolidating related functions like is_relid_or_ancestor_published to reduce complexity. Several error codes and messages require updates to use ERRCODE_FEATURE_NOT_SUPPORTED and clearer wording. Minor issues include spacing in log messages and clarifying the purpose of location field additions in PublicationObjSpec.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[client\_connection\_check\_interval default value](https://www.postgresql.org/message-id/CAHGQGwGw4LhNwOGQT3nbw3uWy8gL94_MB4T39Wfr4_Vgopuovg@mail.gmail.com)**
The discussion focuses on addressing excessive "still waiting on lock" log messages caused by the client_connection_check_interval setting. When backends are blocked in ProcSleep() and log_lock_waits is enabled, they wake up every client_connection_check_interval and potentially emit frequent waiting messages. Fujii Masao proposed a patch to rate-limit these messages to once every 10 seconds, choosing this interval over Tom Lane's suggested 2 seconds as it seemed less aggressive. Laurenz Albe supports the 10-second interval. However, Ants Aasma argues that 10 seconds is still too frequent, suggesting that when hundreds of backends are blocked by a single long-running lock, this would generate tens of messages per second, making it difficult to identify actual issues. He recommends a much longer interval, above 5 minutes, to reduce log noise while maintaining meaningful diagnostic information.

Participants:
ants.aasma@cybertec.at, htamfids@gmail.com, jacob.champion@enterprisedb.com, laurenz.albe@cybertec.at, marat.buharov@gmail.com, masao.fujii@gmail.com, schneider@ardentperf.com, tgl@sss.pgh.pa.us, thomas.munro@gmail.com



## **Industry News**

### **[Microsoft says Office bug exposed customers' confidential emails to Copilot AI](https://techcrunch.com/2026/02/18/microsoft-says-office-bug-exposed-customers-confidential-emails-to-copilot-ai?utm_campaign=daily_pm)**
Microsoft has revealed that an Office bug exposed customers' confidential emails to its Copilot AI chatbot, bypassing data-protection policies. The bug allowed Copilot to read and summarize paying customers' private email communications without proper authorization. This security incident raises significant concerns about AI systems accessing sensitive corporate data and highlights potential vulnerabilities in Microsoft's data protection mechanisms. The disclosure underscores the ongoing challenges companies face in maintaining privacy and security when integrating AI systems with enterprise software platforms that handle confidential business communications.

### **[OpenAI pushes into higher education as India seeks to scale AI skills](https://techcrunch.com/2026/02/18/openai-pushes-into-higher-education-as-india-seeks-to-scale-ai-skills?utm_campaign=daily_pm)**
OpenAI is expanding into higher education through partnerships in India, aiming to reach more than 100,000 students, faculty, and staff over the next year. This initiative comes as India seeks to scale AI skills across its educational institutions. The partnerships represent OpenAI's strategic push to establish its presence in the academic sector while supporting India's broader AI education goals. By targeting such a large audience in one of the world's most populous countries, OpenAI is positioning itself to influence the next generation of AI professionals and researchers in a key global market.

### **[World Labs lands $1B, with $200M from Autodesk, to bring world models into 3D workflows](https://techcrunch.com/2026/02/18/world-labs-lands-200m-from-autodesk-to-bring-world-models-into-3d-workflows?utm_campaign=daily_pm)**
World Labs has secured $1 billion in funding, with $200 million coming from Autodesk, to integrate world models into 3D workflows. The partnership will explore how World Labs' AI models can work alongside Autodesk's tools and vice versa, starting with a focus on entertainment use cases. This significant investment highlights the growing intersection of AI and 3D design technologies, positioning World Labs to compete in the rapidly expanding market for AI-powered creative tools. The collaboration represents a major step toward bringing advanced world modeling capabilities into mainstream professional workflows across multiple industries.