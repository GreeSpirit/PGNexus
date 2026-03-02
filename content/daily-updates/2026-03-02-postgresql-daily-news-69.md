# PostgreSQL Daily News#69 2026-03-02



## **PostgreSQL Articles**

### **[pgdsat version 2.0 has been released](https://www.postgresql.org/about/news/pgdsat-version-20-has-been-released-3249/)**
pgdsat version 2.0 has been released, providing automated security assessments for PostgreSQL clusters. This open-source tool checks approximately 90 security controls, including all CIS compliance benchmark recommendations. The new version adds 13 additional security checks based on the latest CIS Benchmark for PostgreSQL 17 and fixes existing issues. pgdsat helps organizations verify established security policies in an automated manner and identifies potential security vulnerabilities in PostgreSQL deployments. The tool is maintained by Gilles Darold at HexaCluster Corp and operates on Linux platforms under GPLv3 license.

`www.postgresql.org`

### **[The Schedule is out for POSETTE: An Event for Postgres 2026!](https://www.postgresql.org/about/news/the-schedule-is-out-for-posette-an-event-for-postgres-2026-3248/)**
The schedule for POSETTE: An Event for Postgres 2026 has been announced, featuring the fifth annual free virtual PostgreSQL developer conference from June 16-18, 2026. The event includes 44 talks from 50 speakers across four livestreams in different time zones. Key presentations include a keynote by Microsoft's Charles Feddersen and Affan Dar on "Driving Postgres Forward at Microsoft," and a PostgreSQL 19 Hackers Panel featuring core developers Álvaro Herrera, Heikki Linnakangas, Melanie Plageman, and Thomas Munro discussing upcoming features and development priorities. The conference provides technical content for PostgreSQL developers with sessions distributed across PDT and CEST time zones.

`www.postgresql.org`



## **Popular Hacker Email Discussions**

### **[Defects with invalid stats data for expressions in extended stats](https://www.postgresql.org/message-id/aaTGSLZEbwhM_mmA@paquier.xyz)**
The discussion centers on memory management practices in PostgreSQL's ANALYZE code for extended statistics. Chao Li raised concerns about "partial free" operations where a stats array container is freed but its individual elements allocated via examine_attribute() are not explicitly freed. Michael Paquier explained that this approach is intentional for code simplicity, as all allocations occur within the anl_context memory context created by do_analyze_rel(), which automatically cleans up all memory when processing completes. This works correctly even for repeated ANALYZE commands within a transaction block. However, Chao Li argues that partial freeing creates confusion for code readers and suggests either freeing everything explicitly or relying entirely on memory context cleanup for consistency and better code readability.

Participants:
corey.huinker@gmail.com, li.evan.chao@gmail.com, michael@paquier.xyz, tomas@vondra.me

### **[index prefetching](https://www.postgresql.org/message-id/c96ba898-02fb-4756-a1c7-0ddb08159804@vondra.me)**
Tomas Vondra conducted comprehensive benchmarks to evaluate the index prefetching feature, testing single-client and multi-client scenarios across different configurations. His results show consistent performance improvements, with only 4 regression cases occurring under extreme conditions (random data with distance limit 1 using io_method=worker). Tomas argues these regressions are irrelevant since they disable prefetching while maintaining overhead costs. Peter Geoghegan responded to Andres Freund's feedback, agreeing to remove indexscan stats changes and work toward splitting out visibility check handling. He'll incorporate suggestions about batch storage architecture and buffer pin management. Alexandre Felipe acknowledged Tomas's findings and discussed potential self-balancing mechanisms for read_stream_next_buffer, emphasizing concerns about excessive reads in high-concurrency workloads with small queries. The discussion reveals ongoing refinement of the prefetching implementation's architecture and performance characteristics.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[RFC: adding pytest as a supported test framework](https://www.postgresql.org/message-id/DGRSKGSV9XXA.X9YK4O5DDO8W@jeltef.nl)**
Jelte Fennema-Nio is discussing patches 0004 and 0005 in a pytest test framework RFC. These patches were kept in the patchset to ensure compatibility with Jacob's use case during test suite modifications, but were not intended for immediate merging and served as proof-of-concept examples. The patches caused CI failures after protocol grease addition (commit 4966bd3ed95). Fennema-Nio resolved the test failures by forcing usage of version 3.2, but has now marked the patches as "nocfbot" to prevent future CI failures. The discussion indicates ongoing work to integrate pytest as a supported testing framework while maintaining backward compatibility with existing test infrastructure.

Participants:
aleksander@tigerdata.com, andres@anarazel.de, byavuz81@gmail.com, daniel@yesql.se, jacob.champion@enterprisedb.com, peter@eisentraut.org, postgres@jeltef.nl, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[More speedups for tuple deformation](https://www.postgresql.org/message-id/CAApHDvpdBG-yzEbpy6qxVOcS3FtCt62Z+87G=tww5Fg+Ae0jBQ@mail.gmail.com)**
David Rowley is addressing feedback on his tuple deformation speedup patches. Zsolt Parragi raised several code review issues: missing documentation about NULL requirements in first_null_attr function, potential buffer overflow in attribute handling, and incorrect use of att_pointer_alignby instead of att_nominal_alignby. David acknowledged these issues and fixed them, including moving error checks to prevent writes past array boundaries and correcting function calls. Andres Freund identified that using integer types for attribute numbers causes compiler optimization problems due to -fwrapv flag preventing overflow assumptions. Switching to size_t improved gcc performance significantly. However, David still observes register overflow issues where TupleDesc gets written to stack and reloaded, despite attempts to optimize. He has resequenced the patches and applied tail call optimizations, providing benchmark results showing improvements.

Participants:
alvherre@kurilemu.de, andres@anarazel.de, dgrowleyml@gmail.com, johncnaylorls@gmail.com, li.evan.chao@gmail.com, zsolt.parragi@percona.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CALDaNm32g7c323M4mgZ5Wn8sbYp_=uQ6G_u0f9qfBCzuHP8jgQ@mail.gmail.com)**
The discussion centers on implementing an EXCEPT TABLE clause for PostgreSQL publications, allowing users to exclude specific tables from ALL TABLES publications. Vignesh C has released version 53 patches addressing multiple review comments from Nisha Moond, including fixes for test cases, error messages, and documentation. Key technical issues being discussed include syntax inconsistencies between CREATE and ALTER PUBLICATION commands, partition behavior during ATTACH/DETACH operations, and inherited table handling. Amit Kapila suggests using errmsg_plural for multiple publications and moving hints between patches. A significant debate emerges around inherited table behavior: when inheritance relationships change after publication creation, should tables remain independently tracked or dynamically follow the hierarchy? Shveta Malik argues the current approach of treating inherited tables as independent publication members after creation is correct and differs appropriately from partitioned tables, which maintain dynamic hierarchy-based membership. The team continues refining the implementation while addressing edge cases around table relationships.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com



## **Industry News**

### **[India disrupts access to popular developer platform Supabase with blocking order](https://techcrunch.com/2026/02/27/india-disrupts-access-to-popular-developer-platform-supabase-with-blocking-order?utm_campaign=daily_weekend)**
India has issued a government blocking order affecting access to Supabase, a popular developer platform and PostgreSQL-based database service. The disruption is causing patchy access issues for users in India, which represents one of Supabase's biggest markets. The blocking order appears to be impacting developers and businesses relying on the platform's backend-as-a-service offerings, including database hosting, authentication, and real-time subscriptions. This government action highlights ongoing tensions between international tech platforms and regulatory authorities in major markets like India, potentially affecting the broader developer ecosystem and companies dependent on cloud-based database services.