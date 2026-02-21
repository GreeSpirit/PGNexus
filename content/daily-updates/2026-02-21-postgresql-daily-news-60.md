# PostgreSQL Daily News#60 2026-02-21







## **Popular Hacker Email Discussions**

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/bqc4kh5midfn44gnjiqez3bjqv4zogydguvdn446riw45jcf3y@4ez66il7ebvk)**
Andres Freund provides detailed feedback on Melanie Plageman's patch series to eliminate xl_heap_visible WAL records and enable on-access visibility map setting. Key points include concerns about variable naming (suggesting "all_visible" over "vm_new_visible_pages"), function names that sound read-only but perform modifications, and the placement of corruption fixes before WAL logging to prevent standby divergence.

Andres questions the logic for calculating snapshot conflict horizons, suggesting tracking all horizons consistently rather than optimizing conditional assignments. He recommends introducing fastpaths for already-frozen pages to improve pruning performance. For the on-access VM setting functionality, he questions the signaling mechanism using vmbuffer parameters and whether VM buffer pinning should be deferred until actually needed.

The discussion covers technical details around visibility checks, transaction ID comparisons using GlobalVisState versus single XIDs, and the tracking of modified relations through es_modified_relids. Andres suggests several code structure improvements and asks about benchmark results for evaluating the frequency of successful on-access VM updates.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, melanieplageman@gmail.com, reshkekirill@gmail.com, robertmhaas@gmail.com, x4mmm@yandex-team.ru, xunengzhou@gmail.com

### **[PGPROC alignment \(was Re: pgsql: Separate RecoveryConflictReasons from procsignals\)](https://www.postgresql.org/message-id/f7bd155e-0bd4-4b09-86b3-92140af98654@iki.fi)**
Heikki Linnakangas has pushed a patch that splits PGPROC's 'links' field into two separate fields for better clarity, addressing review feedback from Bertrand Drouvot about missing changes in PrintLockQueue() and comment updates. The discussion focuses on PGPROC struct alignment optimizations for performance improvements. Bertrand provided detailed feedback on field grouping and comment formatting consistency. Heikki made adjustments to comment delimiters and addressed style issues. The remaining patches involve cache line alignment using pg_attribute_aligned() when supported by the compiler, with fallback behavior for unsupported compilers. Unlike WALInsertLockPadded which uses union padding, PGPROC alignment is treated as acceptable without padding. Heikki considers the remaining patches ready for commit but acknowledges lacking hardware for performance testing, noting that grouping related fields together is generally beneficial for performance.

Participants:
andres@anarazel.de, bertranddrouvot.pg@gmail.com, hlinnaka@iki.fi

### **[Streaming replication and WAL archive interactions](https://www.postgresql.org/message-id/41D301A5-AB81-4B21-8AC1-9DD602362D31@apple.com)**
Harinath Kanchu from Apple revived discussion about a production issue with WAL archival gaps, referencing his previous post from last year. He expressed support for Andrey's patch addressing this problem. The discussion centers on exposing last_archived_wal information on standby servers, which would help identify and resolve WAL archival gaps externally. Kanchu suggested that even if a full shared mode implementation is too complex currently, simply making last_archived_wal queryable on standbys through pg_stat_wal_receiver or similar mechanism would be valuable. This would allow users to monitor and handle WAL archival issues more effectively in streaming replication environments. The proposal aims to improve visibility into WAL archival status for better production monitoring.

Participants:
andres@anarazel.de, hkanchu@apple.com, hlinnaka@iki.fi, masao.fujii@gmail.com, michael.paquier@gmail.com, nag1010@gmail.com, nkak@vmware.com, reshkekirill@gmail.com, rkhapov@yandex-team.ru, robertmhaas@gmail.com, root@simply.name, shirisharao@vmware.com, x4mmm@yandex-team.ru

### **[ecdh support causes unnecessary roundtrips](https://www.postgresql.org/message-id/7BEC1173-B919-4BEC-AADB-D998B8AD8B90@yesql.se)**
Daniel Gustafsson discovered that SSL tests were failing on FIPS-enabled OpenSSL configurations after recent ECDH changes. While he initially fixed the main SSL tests, colleague Nazir Bilal Yavuz found two additional test suites needing FIPS adjustments. Tom Lane proposed addressing this systematically by conditionally altering the default SSL groups configuration using a PG_FIPS_COMPLIANT compile-time flag, suggesting this would avoid ongoing "whack-a-mole" test fixes. Daniel disagreed, preferring to ensure tests always pass with FIPS enabled and proposing a CI job with FIPS-enabled OpenSSL for ongoing testing. They discussed creating a Cluster.pm function to detect FIPS mode and automatically adjust test configurations accordingly. Tom agreed to this approach if the FIPS detection is feasible, and suggested back-patching fixes to v18 after the current re-release.

Participants:
adrian.klaver@gmail.com, andres@anarazel.de, daniel@yesql.se, hlinnaka@iki.fi, jacob.champion@enterprisedb.com, markokr@gmail.com, peter_e@gmx.net, tgl@sss.pgh.pa.us

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAFiTN-vVFbzNQ__CppQdB6hJ3r+bLuy1XYUL0gou=UY4aeR5wg@mail.gmail.com)**
The discussion centers on implementing an EXCEPT clause for PostgreSQL publications to exclude specific tables from FOR ALL TABLES publications. Recent patches (v46-v47) have addressed various review comments including function naming consistency, memory leak fixes, and code organization. Key technical issues include handling partitioned tables in EXCEPT clauses, avoiding double cache invalidation, and resolving function naming ambiguities. Peter Smith raised concerns about confusing function names in pg_publication.c, suggesting systematic renaming for clarity. Ashutosh Sharma identified several bugs including memory leaks, missing result cleanup, and a SIGABRT crash with pg_get_publication_effective_tables. Amit Kapila proposed splitting the patch to handle partition logic separately for easier review. The patch includes new helper functions for checking excluded relations and updates to catalog functions, but still needs fixes for the reported crashes and improved test coverage.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Optional skipping of unchanged relations during ANALYZE?](https://www.postgresql.org/message-id/c84ac92f-cf37-4398-a0f3-719274cb8c90@tantorlabs.com)**
A PostgreSQL patch discussion focuses on implementing a MISSING_STATS_ONLY option for ANALYZE that would skip analyzing relations with existing statistics. The current debate centers on logging implementation details. Sami Imseih suggests that when relations are skipped, the logging should use INFO level instead of DEBUG1 and employ ereport() rather than elog() for consistency with existing ANALYZE logging patterns. Ilia Evdokimov agrees with this approach, proposing a specific message format: "INFO: Skipping analyzing 'database.namespace.relation'" that would be displayed in VERBOSE mode. This message format would align with the existing style used in do_analyze_rel(). The discussion emphasizes keeping the logging simple since no actual statistics collection occurs when relations are skipped, requiring only a single informational line rather than detailed output.

Participants:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, rob@xzilla.net, robertmhaas@gmail.com, samimseih@gmail.com, vasukianand0119@gmail.com



## **Industry News**

### **[Great news for xAI: Grok is now pretty good at answering questions about Baldur's Gate](https://techcrunch.com/2026/02/20/great-news-for-xai-grok-is-now-pretty-good-at-answering-questions-about-baldurs-gate?utm_campaign=daily_pm)**
According to a new Business Insider report, high-level engineers at xAI were reassigned from other projects to focus on improving Grok's ability to answer detailed questions about the video game Baldur's Gate. This development highlights how AI companies are dedicating significant engineering resources to enhance their models' performance on specific domains, even niche ones like video game content. The move suggests xAI is prioritizing specialized knowledge capabilities in Grok, potentially as part of broader efforts to improve the AI system's conversational abilities and domain expertise.

### **[InScope nabs $14.5M to solve the pain of financial reporting](https://techcrunch.com/2026/02/20/inscope-nabs-14-5m-to-solve-the-pain-of-financial-reporting?utm_campaign=daily_pm)**
InScope, a startup founded by accountants who previously worked at companies like Flexport, Miro, Hopin and Thrive Global, has raised $14.5 million in funding. The company aims to automate the difficulties associated with preparing financial statements, addressing a significant pain point in financial reporting processes. The funding will help InScope develop and scale its automation solutions for financial statement preparation, targeting businesses that struggle with complex and time-consuming financial reporting requirements.

### **[The OpenAI mafia: 18 startups founded by alumni](https://techcrunch.com/2026/02/20/the-openai-mafia-15-of-the-most-notable-startups-founded-by-alumni?utm_campaign=daily_pm)**
Many former OpenAI employees have launched their own startups since the company's founding a decade ago. Among these ventures, some have become major rivals to OpenAI, such as Anthropic, while others have managed to raise billions in funding based purely on investor interest, even before launching actual products. The article examines 18 notable startups founded by OpenAI alumni, showcasing the significant entrepreneurial talent that has emerged from the company and the substantial venture capital investment flowing into AI startups led by former OpenAI personnel.