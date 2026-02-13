# PostgreSQL Daily News#51 2026-02-12



## **PostgreSQL Articles**

### **[Neon Compute Autoscaling Report](https://neon.com/blog/autoscaling-report-2025)**
Neon has published an autoscaling report for 2025, documenting their compute autoscaling capabilities and performance metrics. The report provides insights into how Neon's serverless PostgreSQL platform automatically scales compute resources based on workload demands. This analysis offers valuable data for PostgreSQL users considering serverless database solutions and understanding autoscaling effectiveness in production environments.

`Andy Hattemer`

### **[Six Signs That Postgres Tuning Won't Fix Your Performance Problems](https://www.tigerdata.com/blog/six-signs-postgres-tuning-wont-fix-performance-problems)**
A TigerData blog post identifies six warning signs that PostgreSQL performance problems stem from architectural limitations rather than tuning issues. These workloads feature continuous high-frequency ingestion (thousands to hundreds of thousands of inserts per second), time-centric queries, append-only data patterns, long retention periods, latency-sensitive queries, and sustained growth. The post argues that traditional PostgreSQL optimization becomes ineffective when 4-5 characteristics apply, as the database wasn't designed for analytics on live data. Examples include semiconductor manufacturing telemetry, trading platforms, and logistics tracking. The author suggests that such workloads require purpose-built time-series architecture rather than continued PostgreSQL tuning efforts.

`Matty Stratton`



## **Popular Hacker Email Discussions**

### **[AIX support](https://www.postgresql.org/message-id/aY49f7A2qtINO5sx@momjian.us)**
PostgreSQL's AIX support effort is facing significant challenges and declining developer motivation. Bruce Momjian expresses that the developer work may not justify the value to the user base, citing consistently low patch quality as noted by Robert Haas. Tom Lane reports zero motivation to continue due to testing difficulties on slow AIX hardware and lack of access to decent AIX systems for community developers. The latest v12 patch from Srirama Kucherlapati shows regression from v11, causing TOC overflow warnings and initdb failures. Aditya Kamath's v4 meson build patch fails during ninja recipe generation with multiple producers error. Tom Lane questions why the patches don't simply reverse previous AIX removal commits. The discussion suggests the gap between required work, available developer skills, and community value may be too wide to bridge effectively.

Participants:
aditya.kamath1@ibm.com, andres@anarazel.de, bruce@momjian.us, hlinnaka@iki.fi, michael@paquier.xyz, noah@leadboat.com, peter@eisentraut.org, postgres-ibm-aix@wwpdl.vnet.ibm.com, robertmhaas@gmail.com, sriram.rk@in.ibm.com, tgl@sss.pgh.pa.us, tristan@partin.io

### **[pg\_upgrade: transfer pg\_largeobject\_metadata's files when possible](https://www.postgresql.org/message-id/aY4yerlBoVSb1OId@nathan)**
Nathan Bossart is working on a patch to allow COPY-ing pg_largeobject_metadata during binary upgrades from PostgreSQL versions before v12. The issue stems from getTableAttrs() not picking up the OID column on older versions. Nathan's solution involves modifying pg_dump to use COPY (SELECT ...) TO instead of simple COPY for pg_largeobject_metadata in binary upgrade mode when dealing with pre-v12 versions. Andres Freund reviewed the patch positively but suggested using COPY WITH OIDS as an alternative approach to avoid some of the complexity in handling OID columns in the attribute list. However, Nathan found that using WITH OIDS still requires similar levels of modification to handle the column list properly. Nathan plans to commit the patch in the next couple of days unless there are objections, as he believes the changes are not controversial.

Participants:
andres@anarazel.de, hannuk@google.com, michael@paquier.xyz, nathandbossart@gmail.com, nitinmotiani@google.com, tgl@sss.pgh.pa.us

### **[Speed up COPY TO text/CSV parsing using SIMD](https://www.postgresql.org/message-id/CA+K2Runi_H2CBL0yMm3De2KqcR9RMA0HK5cLJjEhoNszC7myeg@mail.gmail.com)**
KAZAR Ayoub proposes optimizing PostgreSQL's COPY TO performance using SIMD instructions, following similar work on COPY FROM. The patch uses SIMD to quickly skip through data until special characters are found, then falls back to scalar processing. Manni Wood's benchmarks show impressive results: 43.9% speedup for text format without special characters and 50.9% for CSV format, with minimal regression (0.8% or less) when special characters are present. However, Andres Freund raises concerns about the approach, questioning whether adding strlen() calls won't create measurable overhead with short columns, especially when repeatedly called for escaped characters. He also criticizes code duplication and suggests refactoring existing code into helper functions before introducing SIMD optimizations.

Participants:
andres@anarazel.de, andrew@dunslane.net, byavuz81@gmail.com, ma_kazar@esi.dz, manni.wood@enterprisedb.com, markwkm@gmail.com, nathandbossart@gmail.com, neil.conway@gmail.com, shinya11.kato@gmail.com

### **[Odd usage of errmsg\_internal in bufmgr\.c](https://www.postgresql.org/message-id/0C78B2B4-DBCF-4DA5-B999-EC1DA6459CB9@gmail.com)**
Chao Li identified inconsistent usage of errmsg_internal() in bufmgr.c, where translated strings were passed to a function designed for non-translatable internal messages. However, Tom Lane and Andres Freund clarified that this pattern is intentional to avoid double translation. The discussion evolved into a code quality debate about the buffer error reporting implementation. Tom Lane proposed refactoring the code to use standard errmsg() calls instead of the current approach that separates format string definition from usage, arguing it's more maintainable and provides better compiler checking. His patch eliminates the convoluted variable-based message handling in favor of direct ereport() calls. Andres Freund disagreed, finding the proposed changes harder to read despite reducing code duplication. Álvaro Herrera and Zsolt Parragi explored alternative approaches to balance readability and maintainability. The thread remains unresolved regarding the best refactoring approach.

Participants:
alvherre@kurilemu.de, andres@anarazel.de, li.evan.chao@gmail.com, tgl@sss.pgh.pa.us, zsolt.parragi@percona.com

### **[Changing shared\_buffers without restart](https://www.postgresql.org/message-id/CAKZiRmxfT7n0whHkLqtPkyUq_coH=UYP9fQ3V6Xv+2bug-XJSw@mail.gmail.com)**
The discussion focuses on implementing dynamic shared_buffers resizing without PostgreSQL restart. Jakub Wartak reports testing issues with huge pages support in Ashutosh Bapat's patch, identifying three main problems: incorrect huge page calculation, missing munmap() calls causing memory allocation failures, and improper fallback logic for huge_pages settings. Andres Freund argues against the multiple memory mappings approach, favoring a single mapping with MADV_REMOVE for better flexibility when resizing related allocations like buffer descriptors and sync request queues. He suggests this would simplify infrastructure and better support future extensibility. Additionally, Heikki Linnakangas proposes redesigning the shared memory initialization interface using ShmemStructDesc to consolidate size calculation and initialization functions, potentially eliminating multiple subsystem lists and improving extension support. The conversation reveals ongoing architectural debates about implementation approaches.

Participants:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi, jakub.wartak@enterprisedb.com, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Regression failures after changing PostgreSQL blocksize](https://www.postgresql.org/message-id/54d9a790-9da1-490f-9e44-8e76bb60aa9b@Spark)**
The discussion centers on regression test failures when PostgreSQL is compiled with non-default block sizes (32KB instead of 8KB). Yasir reported numerous test failures after configuring with --with-blocksize=32. Zhang Mingli from HashData confirmed this is expected behavior, explaining that Greenplum and Apache Cloudberry use 32KB blocks by default. The failures typically reflect harmless output variations like buffer counts and cost estimates rather than functional bugs, though each case should be examined individually. Tom Lane referenced documentation about expected test differences when planner parameters change. Yasir proposed adding alternative test output files for different block sizes, but both Andres Freund and Álvaro Herrera rejected this approach, citing maintenance burden and the need for all developers to test multiple configurations. Álvaro suggested surgical interventions using SET commands to disable specific plan types might be more acceptable, though still challenging to get reviewed.

Participants:
alvherre@kurilemu.de, andres@anarazel.de, tgl@sss.pgh.pa.us, thomas.munro@gmail.com, yasir.hussain.shah@gmail.com, zmlpostgres@gmail.com

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CABRHmyuOhEjPSpej424UyridA9_knDcBEyL3_BVB1u=yDSOTKw@mail.gmail.com)**
Ajay Pal reported an issue with pg_plan_advice where JOIN_ORDER advice fails when PostgreSQL's genetic algorithm (GEQO) is used for query optimization. When GEQO is enabled for queries with 12 or more tables, the genetic algorithm's randomness prevents it from considering the specific join path requested in the advice, causing a "matched, failed" status. Robert Haas responded that this behavior is expected rather than a bug. He explained that GEQO's inherent randomness may prevent it from exploring user-specified paths, and users experiencing this issue have several options: disable GEQO, use less-strict plan advice, or accept that such outcomes are possible when using genetic optimization. The discussion clarifies that this is a limitation of combining deterministic plan advice with non-deterministic optimization algorithms.

Participants:
ajay.pal.k@gmail.com, alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[Reduce timing overhead of EXPLAIN ANALYZE using rdtsc?](https://www.postgresql.org/message-id/CAP53PkxAtD_ArzxaXPMgAKTfT5Da34o-oN9JY32UbhFS3U=-6A@mail.gmail.com)**
Lukas Fittl shared v6 of a patch series to reduce EXPLAIN ANALYZE timing overhead using RDTSC on x86-64. Key changes include renaming the GUC to "timing_clock_source" with three options: "auto" (uses TSC on Linux if available), "system" (forces system APIs), and "tsc" (forces RDTSC/RDTSCP). The patch unifies Windows QueryPerformanceCounter implementation with TSC, introduces pg_ticks_to_ns function, and enables TSC on Windows when explicitly set. A show hook displays the current clock source when "auto" is selected. The pg_test_timing utility now shows both RDTSC and RDTSCP timings alongside system clock sources. However, the pg_ticks_to_ns function introduces overhead, slowing timing from 23.54ns to 25.74ns on master, and Lukas seeks suggestions for optimization.

Participants:
andres@anarazel.de, geidav.pg@gmail.com, hannuk@google.com, ibrar.ahmad@gmail.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, m.sakrejda@gmail.com, michael@paquier.xyz, pavel.stehule@gmail.com, robertmhaas@gmail.com, vignesh21@gmail.com

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/196082.1770892568@localhost)**
The discussion centers on refactoring the IsMVCCSnapshot function as part of buffer locking improvements. Andres Freund proposed splitting IsMVCCSnapshot into two functions: IsMVCCSnapshot() that only accepts SNAPSHOT_MVCC, and IsMVCCLikeSnapshot() that accepts both SNAPSHOT_MVCC and SNAPSHOT_HISTORIC_MVCC snapshot types. This change would require reviewing all existing callers of the original function, with Freund estimating that only about half should remain unchanged. Antonin Houska responded by providing a patch that implements this proposed refactoring. The change appears to be part of a larger effort to improve buffer locking mechanisms, specifically addressing how different snapshot types are handled in the context of hints, checksums, and asynchronous I/O writes.

Participants:
ah@cybertec.at, andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[Improve pg\_sync\_replication\_slots\(\) to wait for primary to advance](https://www.postgresql.org/message-id/CAJpy0uCnLcHt5o09q6Rc2MhATQZrZfEO7u1pzs=tBZoyr-cgpw@mail.gmail.com)**
The discussion focuses on improving pg_sync_replication_slots() functionality, specifically handling cases where local replication slots become invalidated. Shveta Malik raised concerns about whether the function should wait and retry synchronization when only the local slot is invalidated while the remote slot remains valid. She argued that since slot-sync can internally drop invalidated local slots via drop_local_obsolete_slots(), setting slotsync_pending=true for such cases might be beneficial to ensure proper synchronization in subsequent runs. This would prevent scenarios where a valid remote slot becomes invalid post-failover. Zhijie Hou agreed with this approach and provided an updated patch addressing the concern. Amit Kapila then pushed the first two refactoring patches and requested that remaining patches be rebased accordingly.

Participants:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, ashutosh.bapat.oss@gmail.com, houzj.fnst@fujitsu.com, itsajin@gmail.com, japinli@hotmail.com, jiezhilove@126.com, li.evan.chao@gmail.com, shveta.malik@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CANhcyEVB6XkVQ4YYN3x+P5NeG=tOWg-OWebGiqMp02XXMVUa6A@mail.gmail.com)**
The discussion focuses on a patch (v43) for implementing schema change skipping in PostgreSQL publications. David G. Johnston provided detailed code review feedback on the `check_publications_except_list` function, noting that the "SELECT DISTINCT" clause is unnecessary since publication names are unique within databases, and suggesting early exit optimizations when only one publication exists. Shlok Kyal confirmed that comments were addressed in v43 and mentioned refactoring of `pg_get_publication_effective_tables` with improved documentation. Johnston's follow-up review suggested restructuring early exits, renaming variables for consistency (exclusion vs exception terminology), avoiding triple negatives in error messages, and reconsidering the function name `pg_get_publication_effective_tables` to better reflect its operation on multiple publications. The patch appears to be progressing through iterative review cycles with focus on code clarity and optimization.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Streaming replication and WAL archive interactions](https://www.postgresql.org/message-id/D4B53AE3-B7AF-4BE6-9CB6-44956B05DE72@yandex-team.ru)**
Andrey Borodin has revived a 10-year-old thread about streaming replication and WAL archive interactions, specifically referencing Heikki Linnakangas's patch for "shared" archive mode. The discussion centers on a critical problem in PostgreSQL high availability setups where datacenter outages cause 1-2% of clusters to develop gaps in their PITR timeline. When primaries are lost, some WAL files may be missing from archives despite being streamed to standbys, as HA tools like PGConsul and Patroni attempt re-archiving but the WAL files may already be removed. Borodin proposes that shared archive mode, where standbys retain WAL until archived, addresses this issue more efficiently than archive_mode=always. He has retrofitted Heikki's original patch with three improvements: rebasing with added tests, correct timeline switching handling, and avoiding costly directory scans. The solution aims to handle distributed archiving coordination within PostgreSQL itself rather than requiring external tools.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, masao.fujii@gmail.com, michael.paquier@gmail.com, nag1010@gmail.com, nkak@vmware.com, reshkekirill@gmail.com, rkhapov@yandex-team.ru, robertmhaas@gmail.com, root@simply.name, shirisharao@vmware.com, x4mmm@yandex-team.ru



## **Industry News**

### **[Spotify says its best developers haven't written a line of code since December, thanks to AI](https://techcrunch.com/2026/02/12/spotify-says-its-best-developers-havent-written-a-line-of-code-since-december-thanks-to-ai)**
Spotify credits Claude Code and its internal AI system Honk with dramatically speeding up development processes. According to the company, their most productive developers have not manually written code since December, relying entirely on AI assistance. This represents a significant shift in how the streaming giant approaches software development, with AI tools handling the actual code generation while developers focus on higher-level tasks and system design. The development demonstrates the growing sophistication of AI coding assistants and their practical implementation in major technology companies.

### **[A new version of OpenAI's Codex is powered by a new dedicated chip](https://techcrunch.com/2026/02/12/a-new-version-of-openais-codex-is-powered-by-a-new-dedicated-chip)**
OpenAI has released an updated version of its Codex coding tool that runs on specialized hardware. The company describes this new coding tool as the "first milestone" in its partnership with an unnamed chipmaker. The dedicated chip is specifically designed to optimize AI code generation tasks, potentially offering improved performance and efficiency compared to general-purpose processors. This development represents OpenAI's move toward custom silicon solutions to enhance their AI tools' capabilities, following a trend among major AI companies to develop hardware tailored for their specific computational needs.

### **[Anthropic raises another $30B in Series G, with a new value of $380B](https://techcrunch.com/2026/02/12/anthropic-raises-another-30-billion-in-series-g-with-a-new-value-of-380-billion)**
Anthropic has secured $30 billion in Series G funding, bringing its valuation to $380 billion. This massive funding round occurs as the AI startup competes with OpenAI for customers and market dominance. The substantial investment reflects the intense competition in the AI sector and the significant capital requirements for developing advanced AI systems. The funding will likely be used to enhance Anthropic's AI capabilities, expand its infrastructure, and compete more effectively in the rapidly evolving artificial intelligence market. This valuation positions Anthropic as one of the most valuable AI companies globally.