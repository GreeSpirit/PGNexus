# PostgreSQL Daily News#64 2026-02-25



## **PostgreSQL Articles**

### **[Beyond the Hypervisor: Why the Broadcom/VMware Shift is the Ultimate Moment for Database Modernization](https://enterprisedb.com/blog/beyond-hypervisor-why-broadcomvmware-shift-ultimate-moment-database-modernization)**
The Broadcom acquisition of VMware has created pricing changes and subscription requirements that are prompting organizations to reconsider their entire technology infrastructure. This shift represents a strategic opportunity for database modernization, as companies already evaluating new virtualization platforms can simultaneously address legacy database licensing costs and vendor lock-in. EnterpriseDB suggests that organizations facing VMware transitions should consider migrating from proprietary databases to PostgreSQL-based solutions, arguing that fundamental infrastructure changes create ideal conditions for comprehensive platform modernization rather than simply replacing one component.

`enterprisedb.com`

### **[Building a Deep Research Agent with Neon and Durable Endpoints](https://neon.com/blog/building-a-deep-research-agent-with-neon-and-durable-endpoints)**
Neon demonstrates building a deep research agent using their Durable Endpoints feature. Unlike simple RAG pipelines, these agents follow a recursive loop of planning, searching, learning, and reflecting, similar to systems from OpenAI's Deep Research, Perplexity, and Gemini. The architecture is based on recent papers like DeepResearcher and Step-DeepResearch, which formalize how agents decide when to dive deeper into research or stop. Neon's Durable Endpoints provide the persistent infrastructure needed to support these complex, long-running research workflows that require maintaining state across multiple iterations of the research process.

`Charly Poly`

### **[Create your PostgreSQL clusters with the "builtin" C collation!](https://www.cybertec-postgresql.com/en/c-collation-best-for-postgresql-clusters/)**
Laurenz Albe recommends using PostgreSQL's C collation to avoid index corruption issues that occur after operating system upgrades. PostgreSQL relies on external libraries for collation support, and when these libraries update their sorting rules, existing indexes can become corrupted and require rebuilding. The C collation provides byte-by-byte string comparison that remains stable because it only depends on character encoding, which never changes for existing characters. While C collation produces unintuitive sorting (uppercase before lowercase, non-ASCII characters last), you can specify natural language collations for specific columns or ORDER BY clauses when needed. PostgreSQL v17 introduced a "builtin" collation provider offering C collation without external dependencies, further reducing upgrade risks.

`Laurenz Albe`

### **[The Digital Leash: Why AI Accountability Cannot Be Outsourced](https://enterprisedb.com/blog/digital-leash-why-ai-accountability-cannot-be-outsourced)**
This article from EnterpriseDB examines the critical issue of accountability in autonomous AI systems. As AI becomes more independent in decision-making, organizations face fundamental questions about liability and responsibility. The piece explores the challenge of determining who bears responsibility when AI systems make autonomous decisions that have consequences. This is particularly relevant for database and enterprise systems where AI-driven automation is increasingly common. The article argues that accountability cannot be delegated to external parties and must remain with the organizations implementing these systems. It addresses the growing need for clear frameworks around AI governance and liability as these technologies become more prevalent in enterprise environments.

`enterprisedb.com`

### **[The Sovereignty Gap: Why the Shift to SaaS-First Postgres is Your Signal to Modernize with EDB and Red Hat](https://enterprisedb.com/blog/sovereignty-gap-why-shift-saas-first-postgres-your-signal-modernize-edb-and-red-hat)**
EDB and Red Hat are promoting their partnership as a solution for organizations facing database sovereignty challenges when vendors push cloud-first strategies that don't align with their requirements. The blog post positions EDB Postgres AI combined with Red Hat Ansible Automation Platform as an alternative for companies that need control over their database infrastructure rather than being forced into specific cloud platforms. This appears to be targeting enterprises that want PostgreSQL capabilities while maintaining operational sovereignty and avoiding vendor lock-in situations where their current database providers are prioritizing SaaS offerings that may not meet regulatory, security, or operational requirements.

`enterprisedb.com`



## **Popular Hacker Email Discussions**

### **[\[Proposal\] Adding Log File Capability to pg\_createsubscriber](https://www.postgresql.org/message-id/CAEqnbaWjoSby+_FQOKqTiDwf9AsWVjcGzRn-BQtdivC8xn0ADw@mail.gmail.com)**
Gyan Sreejith has submitted an updated patch implementing suggested changes to add log file capability to pg_createsubscriber. The patch addresses the first two changes requested by vignesh C, but Gyan was unable to implement testing with existing replica servers as initially attempted. Vignesh provided guidance on modifying existing test cases rather than creating new ones, specifically suggesting to add a '--logdir' option to existing command_ok tests and include proper verification. The recommended approach involves selecting one of the current pg_createsubscriber test commands and incorporating the logdir parameter along with appropriate validation checks. This iterative review process focuses on integrating logging functionality into the existing test framework rather than expanding it with additional test infrastructure.

Participants:
amit.kapila16@gmail.com, euler@eulerto.com, gyan.sreejith@gmail.com, kuroda.hayato@fujitsu.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[centralize CPU feature detection](https://www.postgresql.org/message-id/CAN4CZFNKnhVYhLoL9R2+4jeYPVBoCuOHq=SFN_vWkCN8FofnOQ@mail.gmail.com)**
A patch series centralizing CPU feature detection has been committed, but compilation issues emerged. Zsolt Parragi identified minor typos including an unnecessary semicolon in the pg_comp_crc32c function and a misspelling of "initialized" in the commit message. More significantly, Tom Lane reported that buildfarm animal rhinoceros failed compilation after the 0001 commit. The error occurs when building with USE_SLICING_BY_8_CRC32C=1, where pg_cpu_x86.c fails due to undeclared identifiers 'pg_comp_crc32c' and 'pg_comp_crc32c_sse42'. Lane suggests that making pg_cpu_x86.o build unconditionally requires better protection against build configurations where it wasn't previously compiled. The immediate need is to fix these compilation errors to restore build stability across different configuration options.

Participants:
johncnaylorls@gmail.com, nathandbossart@gmail.com, tenistarkim@gmail.com, tgl@sss.pgh.pa.us, zsolt.parragi@percona.com

### **[More speedups for tuple deformation](https://www.postgresql.org/message-id/CAApHDvodSVBj3ypOYbYUCJX+NWL=VZs63RNBQ_FxB_F+6QXF-A@mail.gmail.com)**
David Rowley has posted v9 of his tuple deformation speedup patches, making significant changes to the implementation. The patch set now includes optimizations that avoid accessing tuple's natts when fetching only maximum guaranteed columns, uses pg_rightmost_one_pos32() directly, and introduces new patches 0004 and 0005. Patch 0004 moves slot_getmissingattrs() responsibility to TupleTableSlotOps.getsomeattrs() function to enable sibling call optimization, while 0005 reduces CompactAttribute struct size from 16 to 8 bytes using bitflags and shrinking attcacheoff to int16. Amit Langote identified duplicate code in TupleDescFinalize() which David acknowledged as rebase noise. Andres Freund supports merging patch 0004 as a clear win and suggests creating a benchmark_tools module. Zsolt Parragi raised concerns about precondition handling and potential big-endian issues, plus noted several typos in the code.

Participants:
amitlangote09@gmail.com, andres@anarazel.de, dgrowleyml@gmail.com, johncnaylorls@gmail.com, li.evan.chao@gmail.com, zsolt.parragi@percona.com

### **[index prefetching](https://www.postgresql.org/message-id/CAH2-Wzmy7NMba9k8m_VZ-XNDZJEUQBU8TeLEeL960-rAKb-+tQ@mail.gmail.com)**
Peter Geoghegan has released version 11 of the index prefetching patch, addressing performance issues identified by Andres Freund related to read stream yielding interfering with io_combine_limit. The new version improves cooperation between the read stream yielding mechanism and index prefetching by removing the "batch distance" measurement while still considering yield timing at batch boundaries. The patch now refuses yielding on initial scan batches. Version 11 also fixes regressions in index-only scans on cached data by implementing more efficient memory management for batches that store visibility map information, reducing palloc overhead. Additionally, a new patch eliminates _bt_search stack allocation during index scans, avoiding memory allocation in critical paths. Geoghegan requests expert review of the read stream aspects from developers like Melanie, Andres, or Thomas, acknowledging the yielding approach remains work in progress despite showing promising test results.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[Proposal: ANALYZE \(MODIFIED\_STATS\) using autoanalyze thresholds](https://www.postgresql.org/message-id/CADkLM=dcngh_GLZpQbDgwt_xdnrpwzhWfRqU=ggy-+puwuAbHQ@mail.gmail.com)**
The discussion centers on implementing an ANALYZE option for modified statistics using autoanalyze thresholds. Corey Huinker explored creating a pg_missing_stats view but encountered challenges: exposing pg_class.oid for joins breaks existing patterns, and the view would need complex self-joins with pg_class for proper filtering. He suggested alternatively using a system function pg_rel_is_missing_stats(oid). Sami Imseih argued that requiring users to script ANALYZE commands from views/functions is less appealing than simple ANALYZE options, questioning why the burden should fall on users rather than providing direct functionality. Nathan Bossart countered that merely adding options misses opportunities for centralization and refactoring of autovacuum/autoanalyze prioritization code, which could benefit multiple tools consistently and improve observability as the system evolves.

Participants:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, nathandbossart@gmail.com, rob@xzilla.net, samimseih@gmail.com, vasukianand0119@gmail.com

### **[\[PATCH\] Support automatic sequence replication](https://www.postgresql.org/message-id/CAA4eK1JqGJWjL4G6vvxudhiT8G4RXfaxXNozKDDh+m3GXQ4AKg@mail.gmail.com)**
The patch introduces automatic sequence replication through a dedicated sequence sync worker that runs continuously alongside the apply worker. The worker periodically checks sequences on both publisher and subscriber, syncing only those with differences to minimize overhead. Key discussions focus on implementation details: Amit Kapila suggests reusing maybe_reread_subscription() for parameter changes, introducing a SequenceSyncContext for better memory management, and addressing documentation updates. Hayato Kuroda provides detailed code review covering transaction handling, memory allocation, and worker lifecycle management. The team debates REFRESH SEQUENCES behavior when the sequence worker is active - whether it should force unconditional sync or just wake the worker. Dilip Kumar raises important concerns about switchover scenarios, arguing that while automatic sync reduces downtime in most cases, REFRESH SEQUENCES may still be needed for frequently modified sequences during critical switchover phases to guarantee consistency. Performance testing with large numbers of sequences is requested but not yet provided.

Participants:
amit.kapila16@gmail.com, ashu.coek88@gmail.com, dilipbalaut@gmail.com, itsajin@gmail.com, kuroda.hayato@fujitsu.com, shveta.malik@gmail.com



## **Industry News**

### **[Anthropic launches new push for enterprise agents with plug-ins for finance, engineering, and design](https://techcrunch.com/2026/02/24/anthropic-launches-new-push-for-enterprise-agents-with-plug-ins-for-finance-engineering-and-design)**
Anthropic has launched a new initiative targeting enterprise clients with AI agents equipped with specialized plug-ins for finance, engineering, and design functions. This represents a major opportunity for Anthropic to expand its enterprise customer base while positioning itself as a significant threat to existing SaaS products that currently perform these business functions. The launch of these enterprise-focused AI agents with domain-specific capabilities demonstrates Anthropic's strategic move to compete directly with traditional software solutions by offering AI-powered alternatives. This development could potentially disrupt established SaaS providers by offering more integrated and intelligent solutions for core business processes across multiple departments and industries.

### **[OpenAI COO says 'we have not yet really seen AI penetrate enterprise business processes'](https://techcrunch.com/2026/02/24/openai-coo-says-we-have-not-yet-really-seen-ai-penetrate-enterprise-business-processes)**
OpenAI's Chief Operating Officer has stated that AI has not yet significantly penetrated enterprise business processes, despite widespread predictions about AI agents replacing traditional SaaS solutions. This admission comes amid ongoing discussions about whether AI will disrupt existing software-as-a-service models. While there has been considerable market speculation about AI agents taking over business workflows, leading to volatility in SaaS company stocks, the actual implementation and adoption in enterprise environments remains limited. The COO's comments provide insight into the current reality of AI deployment in business settings, suggesting that despite technological advances, widespread enterprise adoption is still developing.

### **[Stripe's valuation soars 74% to $159 billion](https://techcrunch.com/2026/02/24/stripes-valuation-soars-74-to-159-billion)**
Stripe has conducted another tender offer that resulted in a remarkable 74% increase in its valuation, reaching $159 billion. The tender offer allowed employees to sell their shares to investors, with participation from notable investment firms including Thrive Capital, Coatue, Andreessen Horowitz (a16z), and Stripe itself. This significant valuation increase demonstrates strong investor confidence in Stripe's payment processing platform and its position in the financial technology sector. The substantial jump in valuation reflects the company's continued growth and market dominance in online payments, as well as investor appetite for fintech companies. The participation of both external investors and Stripe itself in the tender offer indicates strategic alignment between the company and its financial backers.