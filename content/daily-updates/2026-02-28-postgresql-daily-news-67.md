# PostgreSQL Daily News#67 2026-02-28







## **Popular Hacker Email Discussions**

### **[index prefetching](https://www.postgresql.org/message-id/issqornf6vdn3vb64fjuoathypmu3e5pgputd3lpfuvoeqyvzr@qfordnhplp2v)**
The discussion focuses on performance issues with Peter Geoghegan's v11 index prefetching patches. Andres Freund reported counterintuitive benchmark results where queries with lower fill factors (more heap pages to scan) actually performed faster than those with higher fill factors, suggesting problems with the yielding mechanism that pauses prefetching to keep scans responsive. When yielding was disabled, performance normalized as expected.

Peter confirmed he could reproduce the issue and found that yielding might not be worth the complexity, noting it only helps specific cases like merge joins. He observed the problem persists even on master with certain shared_buffers configurations, potentially due to device-level readahead interactions. Alexandre Felipe shared mixed benchmark results across different platforms, showing prefetching works but can slow some operations, particularly on macOS. Tomas Vondra questioned the testing methodology and suggested using standard profiling tools instead of custom instrumentation.

Andres provided detailed code review feedback on the patch series, identifying issues with fake LSN infrastructure, buffer management, and questioning whether the yielding mechanism provides sufficient benefit to justify its complexity. Key concerns include the yielding logic being too simplistic and potentially preventing proper IO concurrency. The review suggests breaking the large changes into smaller, more manageable commits and addressing various technical issues around memory ordering, visibility checks, and buffer pin management.

Participants:
andres@anarazel.de, byavuz81@gmail.com, dilipbalaut@gmail.com, gkokolatos@protonmail.com, knizhnik@garret.ru, melanieplageman@gmail.com, o.alexandre.felipe@gmail.com, pg@bowt.ie, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CA+TgmoYru-vxoTKfwjQby30r2OkTXfb18Km_=VLs6qk8Akr0-g@mail.gmail.com)**
Robert Haas has released version 18 of the pg_plan_advice patch with significant architectural changes. The main modification splits the collector interface into a separate extension called pg_collect_advice, making the core pg_plan_advice functionality independent. A third contrib module, pg_stash_advice, was added that creates query_id-to-advice_string hash tables for applying advice during query planning. This demonstrates the pluggable nature of the infrastructure, allowing custom advice application methods beyond query ID matching. The patch also includes numerous minor cleanups, typo fixes, comment improvements, and small code corrections. The modular approach provides better conceptual separation between core advice functionality and optional collection features.

Participants:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[Fix bug in multixact Oldest\*MXactId initialization and access](https://www.postgresql.org/message-id/3d7a2207-0e61-4d95-bc00-e5248956a32b@postgrespro.ru)**
The discussion focuses on fixing a multixact bug in Oldest*MXactId initialization and array access. Yura Sokolov argues strongly for adding more assertions to prevent array bounds issues, stating that proper assertions would have caught this bug during testing. Chao Li reviews Yura's technical solution involving separate functions for prepared transaction slots, praising the clever approach of removing NUM_AUXILIARY_PROCS from procno calculations, but suggests better variable naming. Heikki Linnakangas presents an alternative implementation using FIRST_PREPARED_XACT_PROC_NUMBER instead of multiple variables, and getter/setter functions that return pointers to slots. He notes the bug could cause prepared transactions to overwrite backend values in the OldestVisibleMXactId array. Sami Imseih provides a reproduction case showing two prepared transactions bypassing expected blocking behavior, demonstrating the practical impact of incorrect visibility determinations from reading garbage array values.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, samimseih@gmail.com, y.sokolov@postgrespro.ru

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAA4eK1JrqoPvrFxZEO2rB=-jXK1BQdJZz2_2oeZqCQR3GRWC2g@mail.gmail.com)**
The discussion focuses on a PostgreSQL patch adding EXCEPT clause support to publications, allowing exclusion of specific tables from FOR ALL TABLES publications. Amit Kapila suggests simplifying the API by creating separate wrapper functions for included and excluded relations, and recommends maintaining separate exception lists from the first patch for better code clarity. He also requests comments explaining why slot_advance is needed in tests.

Vignesh addresses most feedback in v51, noting that the puballtables argument is necessary for the common function used by both table types. Nisha Moond identifies several issues: a test bug where both executions incorrectly use the same publish_via_partition_root value, syntax inconsistencies between CREATE and ALTER PUBLICATION commands, and documentation formatting problems.

More critically, Nisha discovers partition and inheritance behavior inconsistencies. When partitions are detached, replication doesn't automatically resume without REFRESH PUBLICATION. For inherited tables, removing inheritance doesn't update the EXCEPT list properly, and SET EXCEPT TABLE operations don't consistently affect child table replication. These behavioral issues may require documentation or code fixes to ensure predictable replication behavior across table hierarchies.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, nisha.moond412@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[Reduce timing overhead of EXPLAIN ANALYZE using rdtsc?](https://www.postgresql.org/message-id/CANWCAZYPGKA1ZrA27sEcDu=A0HaCpiGY4w5ro476F9vmKHcUuQ@mail.gmail.com)**
John Naylor responds to Andres Freund's inquiry about potential conflicts between his runtime checks centralization work and Lukas Fittl's v9 patch for reducing EXPLAIN ANALYZE timing overhead using rdtsc. Naylor confirms he has pushed the main piece of his centralization work, which does conflict with the patch but can be easily fixed since it reduces the number of places that need changes in the 0001 cpuidex patch. He indicates his other patch should not conflict and plans to push it the following day if testing goes well. Naylor offers to help with other discussed items, suggesting collaborative coordination between the developers working on related performance optimization features.

Participants:
andres@anarazel.de, geidav.pg@gmail.com, hannuk@google.com, ibrar.ahmad@gmail.com, jakub.wartak@enterprisedb.com, johncnaylorls@gmail.com, lukas@fittl.com, m.sakrejda@gmail.com, michael@paquier.xyz, pavel.stehule@gmail.com, robertmhaas@gmail.com, vignesh21@gmail.com



## **Industry News**

### **[AI music generator Suno hits 2M paid subscribers and $300M in annual recurring revenue](https://techcrunch.com/2026/02/27/ai-music-generator-suno-hits-2-million-paid-subscribers-and-300m-in-annual-recurring-revenue)**
AI music generator Suno has achieved significant commercial success, reaching 2 million paid subscribers and generating $300 million in annual recurring revenue. Suno's platform enables users to create music using natural language prompts, making music generation accessible to people with little musical experience or technical expertise. This milestone demonstrates the growing market demand for AI-powered creative tools and the monetization potential of generative AI applications. The success of Suno illustrates how AI is democratizing creative processes, allowing users to produce professional-quality music content with minimal effort and expertise.

### **[ChatGPT reaches 900M weekly active users](https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users)**
OpenAI announced that ChatGPT has reached 900 million weekly active users, a significant milestone in AI adoption. This announcement coincided with OpenAI's disclosure of raising $110 billion in private funding, one of the largest funding rounds in history. The new funding consists of $50 billion from Amazon and $30 billion each from Nvidia and SoftBank, valuing the company at $730 billion. This massive user growth and funding demonstrates OpenAI's dominant position in the AI market and reflects the widespread adoption of AI tools across various sectors.

### **[OpenAI raises $110B in one of the largest private funding rounds in history](https://techcrunch.com/2026/02/27/openai-raises-110b-in-one-of-the-largest-private-funding-rounds-in-history)**
OpenAI has secured $110 billion in what represents one of the largest private funding rounds in history. The investment includes $50 billion from Amazon, with Nvidia and SoftBank each contributing $30 billion. This funding values OpenAI at $730 billion, cementing its position as one of the most valuable private companies globally. The massive investment reflects investor confidence in OpenAI's AI technology and market leadership, particularly following the announcement that ChatGPT has reached 900 million weekly active users. This funding will likely accelerate OpenAI's research and development efforts and expansion plans.