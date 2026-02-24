# PostgreSQL Daily News#63 2026-02-24



## **PostgreSQL Articles**

### **[The End of the Monolithic Image: Dynamic Extensions in Kubernetes with PostgreSQL 18](https://enterprisedb.com/blog/end-monolithic-image-dynamic-extensions-kubernetes-postgresql-18)**
PostgreSQL 18 introduces dynamic extension loading in Kubernetes environments, eliminating the need to rebuild monolithic database images. The new extension_control_path parameter works with Kubernetes 1.33's ImageVolume feature, allowing CloudNativePG to mount OCI-based extension images as read-only volumes. Extensions like pgvector can now be loaded on-demand while maintaining PostgreSQL immutability. This approach enhances security and reduces operational overhead, particularly benefiting AI and vector workloads in EDB Postgres AI deployments.

`enterprisedb.com`



## **Popular Hacker Email Discussions**

### **[Flush some statistics within running transactions](https://www.postgresql.org/message-id/CAA5RZ0t1DsB5x_reGAv0AcKdKuF5FTowUx54SLnWkD3w5vH4Lg@mail.gmail.com)**
The thread discusses implementing automatic statistics flushing during long-running transactions, addressing the issue where statistics are only updated at transaction boundaries. The proposed patch introduces pgstat_schedule_anytime_update() requiring processes to set up timeouts and call this function strategically. Sami Imseih defends the approach, suggesting it's straightforward for fixed stats and proposing that variable stats could flush when transactions go idle instead of using timeouts. Michael Paquier expresses concerns about the design's complexity, particularly the requirement for all processes to set up SIGALRM handlers and timeouts unconditionally. He suggests a client-based API using procsignal mechanism would be more flexible. Bertrand Drouvot agrees with automatic core handling but sees value in a public API for testing. The discussion includes technical details about injection points for testing and a bug fix needed in the test regex pattern.

Participants:
bertranddrouvot.pg@gmail.com, masao.fujii@gmail.com, michael@paquier.xyz, samimseih@gmail.com, zsolt.parragi@percona.com

### **[Reduce timing overhead of EXPLAIN ANALYZE using rdtsc?](https://www.postgresql.org/message-id/41528b05-62be-4a5a-abd8-2af2dd84a1be@gmail.com)**
The thread discusses a patch to reduce timing overhead in EXPLAIN ANALYZE by using the RDTSC instruction on x86-64 processors instead of clock_gettime() calls. David Geier submitted v8 addressing Windows compilation issues by fixing __x86_64__ detection for Visual C++ and changing header includes. The patch shows significant performance improvements on Windows: EXPLAIN ANALYZE times dropped from 2781ms to 2091ms with TSC, and pg_test_timing overhead decreased from 27ns to 9.42ns with RDTSC. However, Andres Freund identified a small regression in pg_test_timing on Linux (27.7ns to 28.48ns) though this doesn't appear in actual EXPLAIN ANALYZE workloads. Andres also provided detailed code review feedback covering header organization, overflow handling optimizations, architecture-specific code placement, GUC validation, TSC frequency detection logic, and suggested breaking some changes into separate commits for better reviewability.

Participants:
andres@anarazel.de, geidav.pg@gmail.com, hannuk@google.com, ibrar.ahmad@gmail.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, m.sakrejda@gmail.com, michael@paquier.xyz, pavel.stehule@gmail.com, robertmhaas@gmail.com, vignesh21@gmail.com

### **[New access method for b\-tree\.](https://www.postgresql.org/message-id/CAE8JnxOJoWF-ABi5EtsrmBg3FRtmyk+D0Na8=e1vCwMaG1B2Lg@mail.gmail.com)**
Alexandre Felipe is proposing a new b-tree access method called "MERGE-SCAN" to optimize queries with IN conditions on leading index columns and ORDER BY on subsequent columns. The method uses k-way merge to combine index segments, targeting social media timeline-style queries where users want posts from followed accounts ordered by timestamp with limits.

Performance tests show significant improvements: with limit 100, the new method uses 13 shared hits vs 15,308 for traditional index scans, reducing execution time from 3,409ms to 13ms. For larger limits, it maintains better performance by avoiding external sorts required by sequential and bitmap scans.

Alexandre is reconsidering the naming due to conflicts with existing MERGE statements, proposing alternatives like IndexPrefixMerge or TransposedIndexScan. The discussion includes comparisons with GIST index approaches and acknowledgment of the "timeline view" use case by other contributors. Key unresolved questions involve cost estimation accuracy, planner integration, and extending support to multi-column prefixes and non-leading column scenarios.

Participants:
alexandre.felipe@tpro.io, ants.aasma@cybertec.at, michael@paquier.xyz, michal@kleczek.org, o.alexandre.felipe@gmail.com, peter@eisentraut.org, pg@bowt.ie, tgl@sss.pgh.pa.us, tomas@vondra.me

### **[getting "shell command argument contains a newline or carriage return:" error with pg\_dumpall when db name have new line in double quote](https://www.postgresql.org/message-id/aZzAqz6Oc5VfTf7B@nathan)**
Nathan Bossart reports that the koel buildfarm member is failing after Andrew Dunstan's recent commit that addressed shell command argument validation errors in pg_dumpall when database names contain newlines in double quotes. Dunstan had previously squashed two patches together with tweaks and was planning to commit the fix soon. The buildfarm failure suggests the committed patch may have introduced issues that need investigation. This appears to be a follow-up to work on preventing shell injection vulnerabilities when pg_dumpall processes database names with special characters. The team will likely need to examine the koel failure logs to determine if the patch needs adjustment or if there are platform-specific issues.

Participants:
alvherre@alvh.no-ip.org, andrew@dunslane.net, mahi6run@gmail.com, nathandbossart@gmail.com, srinath2133@gmail.com, tgl@sss.pgh.pa.us

### **[AIX support](https://www.postgresql.org/message-id/SJ4PPFB8177832684C854D7A3E15212DF66DB77A@SJ4PPFB81778326.namprd15.prod.outlook.com)**
The discussion focuses on finalizing AIX support patches for PostgreSQL. Tom Lane indicates the patches are nearly ready for commit, pending Peter's patch and retesting on AIX 7.3. Srirama Kucherlapati reports networking issues with cfarm119 but proposes three alternatives: provisioning a new AIX 7.3 node, using dual boot on existing hardware, or migrating the current AIX 7.2 system. Tom confirms cfarm119 is back online and successfully tests HEAD on both autoconf and meson builds. He identifies a remaining lgamma(NaN) issue on bleeding-edge AIX systems and plans to push the corresponding fix. Tom also notes that a previous pgstat_slru.c build failure disappeared due to dropping 32-bit AIX build support, questioning whether additional fixes are needed. Long-term plans include running buildfarm instances on both AIX 7.2 and 7.3 versions.

Participants:
aditya.kamath1@ibm.com, andres@anarazel.de, hlinnaka@iki.fi, michael@paquier.xyz, noah@leadboat.com, peter@eisentraut.org, postgres-ibm-aix@wwpdl.vnet.ibm.com, robertmhaas@gmail.com, sriram.rk@in.ibm.com, tgl@sss.pgh.pa.us, tristan@partin.io

### **[SQL Property Graph Queries \(SQL/PGQ\)](https://www.postgresql.org/message-id/CAMT0RQSd7PyceQ-6krBCoXse=TJeuTkTTb1ZbWYYy=_yOnYWiQ@mail.gmail.com)**
Hannu Krosing inquired about progress on SQL Property Graph Queries (SQL/PGQ), specifically mentioning that shortest path queries would greatly benefit from having UNION DISTINCT ON functionality. This follows up on a detailed design document shared by Henson Choi outlining implementation strategies for shortest path queries in PostgreSQL-based graph databases. The document compares two approaches: an unoptimized method using WITH RECURSIVE (CTE) query rewriting versus an optimized custom executor node with bidirectional BFS. The CTE approach suffers from unidirectional search with O(B^D) complexity, no early termination, and inefficient cycle prevention. The optimized approach uses bidirectional BFS with O(B^(D/2)) complexity, dual hash tables for efficient visited tracking, smaller-side expansion strategy, and early termination capabilities. The document provides extensive technical details on execution plans, search space comparisons, and key optimization techniques, concluding that the bidirectional BFS approach is essential for production graph database systems handling large graphs.

Participants:
ajay.pal.k@gmail.com, amitlangote09@gmail.com, ashutosh.bapat.oss@gmail.com, assam258@gmail.com, hannuk@google.com, imran.zhir@gmail.com, peter@eisentraut.org, vik@postgresfriends.org, zhjwpku@gmail.com

### **[index prefetching](https://www.postgresql.org/message-id/CAE8JnxNziSMLDgwJVxMgH2HBT03hB19eaaACfZih+42VSkLihQ@mail.gmail.com)**
Alexandre Felipe responds to Peter Geoghegan's feedback on the index prefetching patch, acknowledging the crunch mode before feature freeze in less than 6 weeks. Felipe mentions finding a missing #include "utils/rel.h" in src/backend/access/transam/xloginsert.c and explains his motivation for contributing despite the complexity, having previously given up on a 2022 feature proposal. He apologizes for lengthy discussions about priority queue complexity and asks where he can add more value. Felipe had been testing different distance control strategies (2*d, d+4, etc.) with 2*d performing best across patterns, and suggesting executor estimates to limit prefetch waste. Peter emphasizes focusing on the current scope rather than expanding to heap access reordering due to time constraints, noting Tomas has worked on this for 3 years and Peter for 1 year.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CANhcyEUK_L+2Y+QX44Gkf+TCyz8YBCCT4zp1mVqizqYKkx4RVw@mail.gmail.com)**
The discussion centers on a patch for PostgreSQL publication functionality that allows skipping certain tables using an EXCEPT clause. Shlok Kyal submitted v48 of the patch addressing previous reviewer comments, including fixing a crash with normal tables and clarifying that the pg_get_publication_effective_tables function is internal, not user-facing. Amit Kapila suggests simplifying the patch by initially allowing only root partitioned tables in the EXCEPT clause, as handling individual partitions adds significant complexity for partition management, initial sync, and multi-publication scenarios. He proposes providing ALTER PUBLICATION SET EXCEPT TABLE functionality for managing excluded tables. Ashutosh Sharma provides additional feedback on the v48 patch, noting inconsistent memory cleanup patterns, a commented-out walrcv_clear_result call, and suggesting better documentation for multi-publication conflict checks that appear in multiple locations. The reviewers are weighing feature completeness against implementation complexity.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[\[PATCH\] Support automatic sequence replication](https://www.postgresql.org/message-id/OS9PR01MB12149D9054CC7F2DC3F0D26A1F577A@OS9PR01MB12149.jpnprd01.prod.outlook.com)**
The patch for automatic sequence replication is under review with several technical concerns raised by Hayato Kuroda. Key issues include inefficient transaction handling in start_sequence_sync() that should reuse maybe_reread_subscription(), memory management problems where sequence info structures are allocated but not freed, and insufficient worker launching that could prevent synchronization when messages are continuously received. Kuroda also highlights a backward sequence value problem when users access sequences on subscribers during automatic sync, suggesting either ratchet mechanisms or documentation warnings. Dilip Kumar seeks clarification on performance benefits, questioning what exactly is saved if workers still need to fetch all published sequences. Amit Kapila explains that savings come from avoiding unnecessary local state updates involving sequence relation pages, WAL records, and catalog updates for already-synced sequences, particularly beneficial for large sequence counts.

Participants:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, dilipbalaut@gmail.com, itsajin@gmail.com, kuroda.hayato@fujitsu.com, shveta.malik@gmail.com



## **Industry News**

### **[Anthropic accuses Chinese AI labs of mining Claude as US debates AI chip exports](https://techcrunch.com/2026/02/23/anthropic-accuses-chinese-ai-labs-of-mining-claude-as-us-debates-ai-chip-exports)**
Anthropic has accused three major Chinese AI companies—DeepSeek, Moonshot, and MiniMax—of using approximately 24,000 fake accounts to systematically extract and copy Claude's AI capabilities through a process known as "distillation." This accusation comes as U.S. officials actively debate implementing stricter export controls on AI chips to China, aimed at slowing China's artificial intelligence development progress. The timing of these allegations highlights growing tensions between American and Chinese AI companies, as well as concerns about intellectual property theft and technological competition in the rapidly advancing AI sector.

### **[Defense Secretary summons Anthropic's Amodei over military use of Claude](https://techcrunch.com/2026/02/23/defense-secretary-summons-anthropics-amodei-over-military-use-of-claude)**
Defense Secretary Pete Hegseth has summoned Anthropic CEO Dario Amodei to the Pentagon for what is described as a tense discussion regarding the military's use of Claude AI. The meeting centers on concerns about how the military is utilizing Anthropic's AI technology and potential restrictions on its deployment. Hegseth has escalated the situation by threatening to designate Anthropic as a "supply chain risk," which could have significant implications for the company's government contracts and partnerships. This development highlights growing tensions between AI companies and defense officials over the appropriate use and governance of artificial intelligence in military applications.

### **[OpenAI calls in the consultants for its enterprise push](https://techcrunch.com/2026/02/23/openai-calls-in-the-consultants-for-its-enterprise-push)**
OpenAI has announced partnerships with four major consulting companies to accelerate adoption of its OpenAI Frontier AI agent platform among enterprise clients. This strategic move represents OpenAI's push to expand beyond consumer applications and establish a stronger foothold in the corporate market. By leveraging the expertise and client relationships of established consulting firms, OpenAI aims to help businesses integrate and implement its advanced AI technologies more effectively. The partnership strategy reflects the company's recognition that enterprise adoption often requires specialized consulting support to navigate complex organizational needs and implementation challenges.