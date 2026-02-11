# PostgreSQL Daily News#48 2026-02-10



## **PostgreSQL Articles**

### **[Elasticsearch's Hybrid Search, Now in Postgres (BM25 + Vector + RRF)](https://www.tigerdata.com/blog/elasticsearchs-hybrid-search-now-in-postgres-bm25-vector-rrf)**
TigerData demonstrates how to implement Elasticsearch-style hybrid search directly in PostgreSQL using BM25 keyword search, vector embeddings, and Reciprocal Rank Fusion (RRF). The approach combines pg_textsearch for BM25 ranking, pgvectorscale for high-performance vector search, and SQL-based RRF to merge ranked results. This eliminates the traditional Postgres-to-Elasticsearch pipeline, reducing infrastructure complexity while maintaining search quality. The pgai extension automatically generates and syncs embeddings when data changes, removing the need for separate sync jobs. The implementation uses SQL functions that can be weighted to favor keyword or semantic search depending on query type, providing a single-database solution for hybrid search workloads.

`Raja Rao DV`

### **[Overcoming Single-Vendor Trap: Why True Open Source is the Best Path to Data Sovereignty](https://enterprisedb.com/blog/overcoming-single-vendor-trap-why-true-open-source-best-path-data-sovereignty)**
EnterpriseDB argues that many open source databases like MySQL are falling into a "single vendor trap" where corporate ownership limits strategic freedom, roadmaps, and deployment options. The article contrasts this with PostgreSQL's development model, suggesting that true open source provides better data sovereignty. The piece emphasizes how corporate control over foundational technologies can restrict user choices and innovation, positioning community-driven development as a superior approach for maintaining technological independence and avoiding vendor lock-in situations.

`enterprisedb.com`



## **Popular Hacker Email Discussions**

### **[Add expressions to pg\_restore\_extended\_stats\(\)](https://www.postgresql.org/message-id/aYmCUx9VvrKiZQLL@paquier.xyz)**
Michael Paquier reviewed Corey Huinker's patch to add expression support to pg_restore_extended_stats(). He identified several uncovered test cases and edge conditions, including handling non-string/non-null values and various JSON input scenarios that could trigger assertions. Paquier fixed these issues, added comprehensive tests, and addressed stylistic concerns in his modified version. He requested that Huinker restore a previously proposed test that copies expression stats between databases and checks differences. Additionally, Paquier suggested handling STATISTIC_KIND_RANGE_LENGTH_HISTOGRAM and STATISTIC_KIND_BOUNDS_HISTOGRAM cases by first exposing them in pg_stats_ext_exprs view, then extending the restore function. Huinker agreed to these suggestions and provided a patch series: the original v8 patch, build fixes, restored difference tests, range-stats exposure in pg_stats_ext_exprs, and range-stats import support.

Participants:
corey.huinker@gmail.com, li.evan.chao@gmail.com, michael@paquier.xyz, tndrwang@gmail.com, tomas@vondra.me

### **[libpq: Bump protocol version to version 3\.2 at least until the first/second beta](https://www.postgresql.org/message-id/CAGECzQTWj+D=tNopj6qMzpP6g46P95Wd6LSrFjZEfB20tzQU-g@mail.gmail.com)**
Jacob Champion has committed patches for bumping libpq protocol version to 3.2, leaving one remaining TODO item about guiding users toward resolution of grease-related errors. Champion proposes v7 patches that add error explanations and documentation links for libpq grease errors, pointing to PostgreSQL documentation that will include a note on grease functionality. While preferring a wiki page for the URL, Champion suggests the documentation link as a better interim solution that can be updated later. Jelte Fennema-Nio approves the improvement and suggests being more liberal in showing error explanations, potentially triggering on hard connection closures or specific keywords in error messages, with appropriately cautious wording since full certainty wouldn't exist in those cases.

Participants:
andres@anarazel.de, david.g.johnston@gmail.com, hlinnaka@iki.fi, jacob.champion@enterprisedb.com, postgres@jeltef.nl, robertmhaas@gmail.com

### **[index prefetching](https://www.postgresql.org/message-id/CAH2-Wznv9_KGqHQ1vCW2pkiA6QskBGcx5NC_-UXnD6GEQasvAQ@mail.gmail.com)**
Peter Geoghegan posted v10 of the index prefetching patch with two major improvements. First, the read stream callback (heapam_getnext_stream) now yields at key intervals to keep scans responsive, particularly beneficial for "ORDER BY ... LIMIT N" queries and merge joins. This involves complex trade-offs between responsiveness and maintaining adequate prefetch distance, with heuristics derived from adversarial benchmarking. Second, a new patch addresses the selfuncs.c problem where VISITED_PAGES_LIMIT is incompatible with the new table_index_getnext_slot interface. The solution adds IndexScanDescData.xs_read_extremal_only field for get_actual_variable_range, making nbtree stop after scanning one leaf page. This approach should solve existing VISITED_PAGES_LIMIT ineffectiveness issues, particularly when many index tuples have LP_DEAD bits set. Geoghegan plans to start a separate thread to discuss these issues further.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Changing shared\_buffers without restart](https://www.postgresql.org/message-id/CAKZiRmwxVqEbp7JgOed=BCT6cq8RNuHk3N0vuwro65Tsw9E8NA@mail.gmail.com)**
The discussion continues on a patchset enabling dynamic shared_buffers resizing without server restart. Jakub Wartak tested the patches to explore whether they could improve PostgreSQL's connection scalability by reducing fork() overhead, but found mixed results with some performance regression on NUMA systems. He identified several issues including slow startup due to memory touching during initialization, problems with huge pages support, and bugs in memory size calculations.

Andres Freund clarified that fork() slowness primarily stems from library dependencies (especially OpenSSL) rather than shared buffers, and questioned the approach of delaying memory mapping until after fork. He also challenged the design choice of using multiple memory mappings with memfd, arguing that since maximum address space must be reserved upfront anyway, multiple mappings add unnecessary complexity without benefit.

Ashutosh Bapat provided an updated patchset addressing merge conflicts and reducing segments to two (main and buffer blocks). He explained the current segment-based architecture and explored two potential approaches for on-demand shared memory segments that could support extensions.

Heikki Linnakangas proposed a cleaner API design hiding segment IDs from callers and demonstrated a proof-of-concept for a more unified shared memory initialization system using ShmemStructDesc descriptors. This approach would replace the current scattered ShmemSize/ShmemInit function pairs with a single registration mechanism, potentially supporting resizable segments for extensions.

Participants:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi, jakub.wartak@enterprisedb.com, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/u644ma4erj75z46wckuq3szrlnci3wzlevq7brauk2p3v6h2l7@jkd7siijr7hx)**
This thread discusses improvements to PostgreSQL's buffer locking mechanism, particularly around hint bits and checksums. Andres Freund has been working on patches to optimize buffer hint bit operations, introducing BufferSetHintBits16() for single 16-bit value updates. Heikki Linnakangas provided detailed code review feedback on function documentation, comment clarity, and implementation details. The discussion covers technical aspects like LSN handling, race conditions in buffer writes, and proper locking semantics. Antonin Houska identified an issue with HeapTupleSatisfiesMVCCBatch() during logical decoding with historic snapshots, proposing a fix. Andres suggested an alternative solution restricting page-at-a-time scans to real MVCC snapshots. Kirill Reshke inquired about creating TAP tests for rare recovery scenarios involving torn pages. The patches appear to be progressing toward completion with most review feedback addressed.

Participants:
ah@cybertec.at, andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CAK98qZ2RzbgCHrSg4zLkvpzyBam_X6te-KF8w1+_vON9BAVMEw@mail.gmail.com)**
Alexandra Wang reviewed Robert Haas's v14 patch set for pg_plan_advice and approved patches 0003-0005. This appears to be part of an ongoing code review process for the pg_plan_advice feature. The brief message indicates positive feedback on specific components of the patch series, suggesting the development is progressing well. However, the message doesn't provide details about what these patches contain or address any technical aspects of the implementation. No issues or concerns were raised, and no specific next steps were mentioned beyond the implicit continuation of the review process.

Participants:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[log\_min\_messages per backend type](https://www.postgresql.org/message-id/827C26CA-D7C2-4AD9-AEC3-E1E76519453E@gmail.com)**
The log_min_messages per backend type patch has been committed by Alvaro Herrera after incorporating review feedback from Euler Taveira. The feature allows configuring different logging levels for different PostgreSQL process types using a comma-separated syntax like "default:warning,autovacuum:debug1,backend:info". Alvaro made several improvements including changing terminology from "generic" to "default", simplifying memory management, using goto for error handling, and moving GUC hooks to elog.c. A critical bug was fixed where a break statement prevented setting levels for process types sharing the same category. Chao Li raised usability concerns about the inability to easily modify single process type levels via ALTER SYSTEM, but Alvaro noted this limitation was discussed previously without satisfactory solutions. Minor cleanup patches were contributed to remove unused declarations, fix comment typos, and alphabetize documentation entries.

Participants:
alvherre@alvh.no-ip.org, andres@anarazel.de, euler@eulerto.com, japinli@hotmail.com, li.evan.chao@gmail.com, noriyoshi.shinoda@hpe.com, zengman@halodbtech.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAHut+PsxDe-mVq_6YyhaUCyPUuohZE5dRtf80syP3y_n+Z6Tog@mail.gmail.com)**
The discussion centers on handling contradictory behavior when combining multiple publications with EXCEPT clauses in PostgreSQL logical replication. Shlok Kyal submitted v41 patches addressing table synchronization issues, but shveta malik identified a problem where table-sync and incremental-sync replicate different table sets when subscribing to multiple publications with different EXCEPT lists and PUBLISH_VIA_PARTITION_ROOT values. Amit Kapila proposed disallowing contradictory combinations (like pub1: FOR ALL TABLES EXCEPT tab1 and pub2: FOR TABLE tab1) to keep things simple, referencing similar restrictions for column lists. However, Peter Smith and David G. Johnston disagreed, arguing that publication combinations should be purely additive, with EXCEPT lists being internal shorthand rather than external constraints. The debate continues over whether to restrict such combinations or allow additive behavior for the first implementation version.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com



## **Industry News**

### **[Anthropic closes in on $20B round](https://techcrunch.com/2026/02/09/anthropic-closes-in-on-20b-round)**
Anthropic is reportedly close to securing a $20 billion funding round, just five months after raising $13 billion in equity funding. The AI company's rapid fundraising pace reflects the intense competition between frontier AI labs and the substantial ongoing costs of compute resources. This latest round would significantly increase Anthropic's valuation and provide additional capital to compete with other leading AI companies like OpenAI. The quick succession of funding rounds demonstrates how AI companies are prioritizing rapid capital accumulation to maintain their competitive positions in the fast-evolving artificial intelligence landscape.

### **[ChatGPT rolls out ads](https://techcrunch.com/2026/02/09/chatgpt-rolls-out-ads)**
OpenAI has officially rolled out advertisements in ChatGPT, despite facing backlash late last year when testing app suggestions that appeared like unwanted ads. The AI company is implementing this monetization strategy to generate revenue from its popular chatbot and cover the substantial costs associated with developing AI technology and scaling the business. The move represents OpenAI's effort to balance user experience with financial sustainability as the company seeks to monetize its widely-used conversational AI platform while managing the expensive infrastructure required to operate large language models.

### **[Databricks CEO says SaaS isn't dead, but AI will soon make it irrelevant](https://techcrunch.com/2026/02/09/databricks-ceo-says-saas-isnt-dead-but-ai-will-soon-make-it-irrelevant)**
Databricks CEO Ali Ghodsi believes that while SaaS applications aren't dying, artificial intelligence could soon make them irrelevant by giving rise to new competitors. According to Ghodsi, AI won't simply replace major SaaS apps with "vibe-coded" versions, but rather enable the creation of entirely new solutions that could challenge existing software-as-a-service platforms. This perspective suggests that AI's transformative impact on the software industry may not come through direct replacement of current tools, but through enabling fundamentally different approaches to software development and deployment that could disrupt the traditional SaaS model.