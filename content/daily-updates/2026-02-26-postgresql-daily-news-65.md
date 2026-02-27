# PostgreSQL Daily News#65 2026-02-26



## **PostgreSQL Articles**

### **[credcheck v4.6 has been released](https://www.postgresql.org/about/news/credcheck-v46-has-been-released-3244/)**
The credcheck PostgreSQL extension v4.6 has been released as a critical security fix update. This extension provides credential validation during user creation, password changes, and user renaming, allowing administrators to define password policies, expiration rules, authentication failure limits, and reuse policies. Version 4.6 addresses a serious security vulnerability where ALTER ROLE current_role could be exploited to change superuser passwords. Additional fixes include resolving event trigger issues with negative time values for password expiration warnings and disabling login event triggers when password warning features are not configured. Users running v4.5 should upgrade immediately, requiring a PostgreSQL restart to reload the library.

`www.postgresql.org`

### **[Understanding Postgres Performance Limits for Analytics on Live Data](https://www.tigerdata.com/blog/postgres-optimization-treadmill)**
This article examines why PostgreSQL struggles with high-frequency time-series analytics workloads despite proper optimization. It describes the "Optimization Treadmill" - a predictable sequence where teams apply standard PostgreSQL optimizations (indexing, partitioning, autovacuum tuning, vertical scaling, read replicas) that provide temporary relief but don't change the underlying performance trajectory. The core issue stems from PostgreSQL's MVCC overhead, row-based storage, B-tree indexes, and WAL volume - design choices optimized for general OLTP workloads, not continuous high-frequency ingestion with long retention. The article presents a scoring framework to identify this pattern and suggests purpose-built solutions like TimescaleDB for workloads scoring 8+ points, emphasizing that early migration is significantly cheaper than waiting until tables reach billions of rows.

`Matty Stratton`

### **[Where Agents Meet Infrastructure: Encore, Leap, and Neon](https://neon.com/blog/where-agents-meet-infrastructure-encore-leap-and-neon)**
Encore has developed a platform that allows developers to define infrastructure directly in Go or TypeScript without requiring dedicated platform engineering teams. The system automatically converts code into production infrastructure while maintaining developer control. This approach simplifies application deployment by eliminating the traditional separation between application code and infrastructure configuration. Encore partnered with Leap and Neon to demonstrate this infrastructure-as-code methodology, showing how modern development platforms can streamline the path from development to production deployment while preserving the flexibility developers need for complex applications.

`Carlota Soto`



## **Popular Hacker Email Discussions**

### **[Fix bug in multixact Oldest\*MXactId initialization and access](https://www.postgresql.org/message-id/CAA5RZ0tnbfDNo6FCNhn0mmxRgFzS5tALPpJ28aT7oevwp6NFOw@mail.gmail.com)**
The discussion centers on a bug in multixact.c related to OldestMemberMXactId and OldestVisibleMXactId array initialization and access. Yura Sokolov identified that MaxOldestSlot calculation incorrectly omits NUM_AUXILIARY_PROCS, causing prepared transaction processes (dummyProcNumber) to overwrite memory beyond array bounds. This became problematic after PostgreSQL 18 increased NUM_AUXILIARY_PROCS for AIO workers and a 2024 change replaced dummyBackendId with pgprocno indexing. Sami Imseih confirmed the issue, noting prepared transactions start at MaxBackends + NUM_AUXILIARY_PROCS but MaxOldestSlot only accounts for MaxBackends + max_prepared_xacts. Multiple solutions are proposed: Yura's v3 patch adjusts procno indexing and makes array sizes precise, while Sami suggests defining TOTAL_PROCS macro to simplify calculations. The debate continues over whether wrapper functions with asserts are necessary or if simpler macro-based solutions suffice.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, samimseih@gmail.com, y.sokolov@postgrespro.ru

### **[More speedups for tuple deformation](https://www.postgresql.org/message-id/CAApHDvot9-P3790zcqVbaumyD2TqWg=_=PUe9OsN5+-wXQRPWw@mail.gmail.com)**
David Rowley's tuple deformation performance patches are being reviewed and refined through multiple iterations. The discussion covers several technical issues including big-endian compatibility fixes, struct layout optimizations, and compiler-generated code quality concerns. Zsolt Parragi identified potential bugs in null bitmap handling and big-endian systems, which David addressed with proper casting and byte swapping. John Naylor confirmed the big-endian fixes work correctly. Álvaro Herrera suggested optimizations for the CompactAttribute struct layout and recommended creating a dedicated benchmarking suite rather than placing deform_bench in test modules. Andres Freund provided detailed analysis of compiler optimization issues, noting that GCC generates suboptimal assembly code with excessive register pressure and stack spilling. He suggested merging patch 0004 first and identified that using size_t instead of int for loop variables partially resolves compiler optimization problems. The patches show measurable performance improvements but require further refinement to address edge cases and compiler-specific optimization challenges.

Participants:
alvherre@kurilemu.de, andres@anarazel.de, dgrowleyml@gmail.com, johncnaylorls@gmail.com, li.evan.chao@gmail.com, zsolt.parragi@percona.com

### **[AIX support](https://www.postgresql.org/message-id/SJ4PPFB81778326204CC13908EFBB1A8514DB75A@SJ4PPFB81778326.namprd15.prod.outlook.com)**
IBM's team reports successful PostgreSQL buildfarm testing on AIX system p9-aix1-postgres1 after previously disabling buildfarm scripts due to extensive testing activity. Srirama Kucherlapati confirms all tests are passing on master branch and multiple stable releases (REL_16_STABLE, REL_15_STABLE, REL_14_STABLE), providing detailed test output showing successful completion of PL installcheck, contrib installcheck, test-modules installcheck, and ecpg check stages. However, Tom Lane notes that despite the reported successful local testing, no corresponding report appears on the official buildfarm server, indicating a potential disconnect between local test execution and automated reporting system integration.

Participants:
aditya.kamath1@ibm.com, andres@anarazel.de, hlinnaka@iki.fi, michael@paquier.xyz, noah@leadboat.com, peter@eisentraut.org, postgres-ibm-aix@wwpdl.vnet.ibm.com, robertmhaas@gmail.com, sriram.rk@in.ibm.com, tgl@sss.pgh.pa.us, tristan@partin.io

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/TY4PR01MB169075BC5D58A363746C842569475A@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
The discussion focuses on implementing an EXCEPT TABLE clause for PostgreSQL publications to exclude specific tables from replication. Amit Kapila suggests simplifying the initial implementation by restricting EXCEPT TABLE to only root partitioned tables, avoiding the complexity of excluding individual partitions while publishing their parent tables. This approach would require error handling when users attempt to attach excluded root partitions to other roots, and would need ALTER PUBLICATION SET EXCEPT TABLE functionality for managing exclusion lists.

Multiple contributors agree with this simplified approach. Zhijie Hou notes that excluding individual partitions introduces entirely new functionality not previously available, making the restriction acceptable. The original use case doesn't mention partitioned tables, so EXCEPT TABLE provides value without partition exclusion complexity.

Recent patches (v49-v50) implement this simplified design with support for CREATE PUBLICATION EXCEPT TABLE, ALTER PUBLICATION SET EXCEPT TABLE, and ALTER PUBLICATION DROP EXCEPT TABLE. Code reviews identify several issues including assertion failures, memory management problems, documentation inconsistencies, and error message formatting. Andrei Lepikhov raises performance concerns about querying excluded tables, suggesting index optimization. The latest v50 patch addresses reviewer feedback and splits functionality across three separate patches for easier review.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, lepihov@gmail.com, li.evan.chao@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[SQL Property Graph Queries \(SQL/PGQ\)](https://www.postgresql.org/message-id/CAExHW5vNZqCXuemXVL+nDDYkBeqJXdM3s=M3PWnymL6xqeB2WA@mail.gmail.com)**
The discussion focuses on refining the SQL Property Graph Queries (SQL/PGQ) patch implementation. Ashutosh Bapat provided rebased patches addressing conflicts in pg_overexplain.sql/.out and incorporated a parserOpenPropGraph() function with typo fixes. The patchset includes two parts: 0001 handles the main functionality requiring property graphs in GRAPH_TABLE clauses, while 0002 adds the parser function that should be squashed into 0001. A CI failure in pg_overexplain was resolved by adding new overexplain fields to graph table queries. Peter Eisentraut contributed additional fixup patches and identified several issues requiring attention: inadequate function documentation in parse_graphtable.c, misplaced GraphTableParseState structure, debug elog statements needing removal, unclear error handling in rewriteGraphTable.c, inconsistent error message formatting, and confusing function naming between get_gep_kind_name() and get_graph_elem_kind_name(). The focus is on code cleanup and structural improvements before final integration.

Participants:
ajay.pal.k@gmail.com, amitlangote09@gmail.com, ashutosh.bapat.oss@gmail.com, assam258@gmail.com, imran.zhir@gmail.com, peter@eisentraut.org, vik@postgresfriends.org, zhjwpku@gmail.com

### **[Change COPY \.\.\. ON\_ERROR ignore to ON\_ERROR ignore\_row](https://www.postgresql.org/message-id/6f973222-f306-43af-9df5-38673fe3f7d6@eisentraut.org)**
Peter Eisentraut provides detailed cosmetic feedback for the COPY ON_ERROR patch that adds ignore_row and set_null options. His suggestions focus on documentation improvements, including better wording for field references and more compact explanation of NOTICE messages. He recommends removing redundant comments in the code and suggests clearer error messaging, particularly noting that "rows were replaced with null" should be "columns were set to null" since individual columns, not entire rows, are nullified. Eisentraut also questions the domain constraint handling logic, asking for clarification on when additional InputFunctionCallSafe calls are needed and how check constraint failures versus null value violations are distinguished. He suggests minor formatting improvements for test comments.

Participants:
david.g.johnston@gmail.com, jian.universality@gmail.com, jim.jones@uni-muenster.de, masao.fujii@oss.nttdata.com, matheusssilv97@gmail.com, nagata@sraoss.co.jp, peter@eisentraut.org, reshkekirill@gmail.com, sawada.mshk@gmail.com, torikoshia@oss.nttdata.com, vignesh21@gmail.com



## **Industry News**

### **[Alphabet-owned robotics software company Intrinsic joins Google](https://techcrunch.com/2026/02/25/alphabet-owned-robotics-software-company-intrinsic-joins-google)**
Intrinsic, Alphabet's robotics software company, is moving back under Google's direct control after nearly five years as an independent Alphabet subsidiary. The company originally graduated from being a Google project to become a standalone Alphabet entity, focusing on developing robotics software solutions. This organizational restructuring suggests Google is consolidating its robotics efforts under its main operations, potentially indicating a shift in strategic priorities or resource allocation. The move could streamline development processes and integrate Intrinsic's robotics capabilities more closely with Google's broader technology ecosystem and product offerings.

### **[Harbinger acquires autonomous driving company Phantom AI](https://techcrunch.com/2026/02/25/harbinger-acquires-autonomous-driving-company-phantom-ai)**
Harbinger, a Los Angeles-based trucking startup, has completed its first acquisition by purchasing autonomous driving company Phantom AI. This strategic move represents part of Harbinger's broader efforts to develop new revenue streams beyond its core trucking business. The acquisition signals Harbinger's commitment to integrating advanced autonomous driving technologies into its operations, potentially positioning the company to compete more effectively in the evolving transportation and logistics sector. This deal reflects the ongoing consolidation in the autonomous vehicle space as companies seek to combine resources and expertise to accelerate development and deployment of self-driving technologies.

### **[Jira's latest update allows AI agents and humans to work side by side](https://techcrunch.com/2026/02/25/jiras-latest-update-allows-ai-agents-and-humans-to-work-side-by-side)**
Atlassian has unveiled "agents in Jira," a new feature that enables users to assign and manage work for AI agents using the same processes as human team members. This update represents a significant evolution in project management software, allowing artificial intelligence to be integrated seamlessly into existing workflows. Users can now distribute tasks between human workers and AI agents through Jira's standard assignment and tracking mechanisms. This development reflects the growing trend of AI integration in workplace collaboration tools, potentially increasing productivity and efficiency by leveraging AI capabilities for specific tasks while maintaining familiar management processes for teams already using Jira.