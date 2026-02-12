# PostgreSQL Daily News#50 2026-02-12







## **Popular Hacker Email Discussions**

### **[pg\_upgrade: transfer pg\_largeobject\_metadata's files when possible](https://www.postgresql.org/message-id/aYzuAz_ITUpd9ZvH@nathan)**
Nathan Bossart is working on improving pg_upgrade to transfer pg_largeobject_metadata files when possible, rather than using slower SQL commands. The current implementation only works for upgrades from PostgreSQL v12 and newer because in older versions, pg_largeobject_metadata was created WITH OIDS, making the OID column hidden and not included in dumps. Andres Freund questioned this reasoning, noting that OID columns can be explicitly included in output. Nathan acknowledged that getTableAttrs() doesn't pick up OID columns on older versions but suggested this could be fixed by adjusting the query for binary upgrades from pre-v12 versions. Nathan has now implemented what appears to be a more complex solution than initially expected to allow COPY operations for pg_largeobject_metadata during binary upgrades from versions prior to v12.

Participants:
andres@anarazel.de, hannuk@google.com, michael@paquier.xyz, nathandbossart@gmail.com, nitinmotiani@google.com, tgl@sss.pgh.pa.us

### **[Pasword expiration warning](https://www.postgresql.org/message-id/79a7e931-d88f-420a-97e0-3c1e517a191e@darold.net)**
Nathan Bossart has committed a patch related to password expiration warnings in PostgreSQL. The discussion involved multiple participants who reviewed and provided feedback on the implementation. Gilles Darold expressed gratitude for Nathan's work on the feature. The commit appears to address functionality that warns users about upcoming password expiration, which is an important security feature for database administration. The patch went through the typical PostgreSQL development process of review and discussion before being committed to the codebase.

Participants:
andrew@dunslane.net, euler@eulerto.com, gilles@darold.net, japinli@hotmail.com, li.evan.chao@gmail.com, liuxh.zj.cn@gmail.com, nathandbossart@gmail.com, niushiji@gmail.com, peter@eisentraut.org, shiyuefei1004@gmail.com, tgl@sss.pgh.pa.us, tsinghualucky912@foxmail.com, zsolt.parragi@percona.com

### **[Little cleanup: Move ProcStructLock to the ProcGlobal struct](https://www.postgresql.org/message-id/D70D9385-7433-4BF6-AB1C-928E37C7F07E@gmail.com)**
Heikki Linnakangas proposed moving the ProcStructLock spinlock from its own shared memory area into the ProcGlobal struct for better cache locality, arguing that the separate allocation was for historical reasons. Chao Li reviewed the patch and identified a missing SpinLockInit call for the relocated spinlock. Ashutosh Bapat confirmed this was needed and noted the change aligns with other shared structures that embed spinlocks. Tom Lane explained the bug went unnoticed because modern platforms initialize spinlocks to zero and shared memory starts as zeros, but warned this creates a testing gap since older detection methods are gone. Heikki fixed the initialization issue and pushed the change. The discussion then shifted to whether accepting all-zeros as valid spinlock initialization is safe, with Tom expressing concerns about platform assumptions.

Participants:
ashutosh.bapat.oss@gmail.com, hlinnaka@iki.fi, li.evan.chao@gmail.com, tgl@sss.pgh.pa.us

### **[POC: enable logical decoding when wal\_level = 'replica' without a server restart](https://www.postgresql.org/message-id/CAA4eK1Kg5zO-BX_bTkfWJOoQ=z69mKbQbeFCVEwMaqNCP=wD7g@mail.gmail.com)**
The discussion centers on a proposal to allow PostgreSQL to dynamically change wal_level from 'replica' to 'logical' without requiring a server restart when logical replication slots are created. Matthias van de Meent raises concerns that users with REPLICATION privilege could effectively control wal_level, causing system-wide performance overhead through increased WAL volume and CPU consumption that affects all backends. Amit Kapila counters that REPLICATION privilege users already have significant destructive power, including the ability to cause denial of service through disk exhaustion and performance degradation via xmin horizon management. He argues that allowing these users to toggle logical logging is an incremental addition to their existing trusted role. The debate focuses on whether the performance impact of dynamic wal_level changes represents a fundamentally new type of system-wide risk versus an extension of existing REPLICATION privilege capabilities.

Participants:
amit.kapila16@gmail.com, ashutosh.bapat.oss@gmail.com, bertranddrouvot.pg@gmail.com, boekewurm+postgres@gmail.com, kuroda.hayato@fujitsu.com, sawada.mshk@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAJpy0uD5nVQ9vasP+UP=1ySdG_M64iBXVuzu1CT7b7b-KdbdPA@mail.gmail.com)**
The discussion focuses on handling publications with EXCEPT lists in PostgreSQL logical replication. The main debate centers around whether to allow subscribers to combine multiple publications that have conflicting EXCEPT clauses. Shveta and Vignesh argue for restricting this scenario to keep the implementation simple, particularly when dealing with complex partition hierarchies where different publications exclude different partitions with varying publish_via_partition_root settings. They propose emitting an error when multiple publications with different EXCEPT lists are combined, while still supporting cases where one publication excludes a table and another explicitly includes it. David Johnston suggests optimizations for the check_publications_except_list function, noting that DISTINCT is unnecessary since publication names are unique, and the check can be skipped entirely for single publications. The team agrees to implement these optimizations in the next patch version.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[generic plans and "initial" pruning](https://www.postgresql.org/message-id/CA+HiwqGn38DsKgMYKWZ6jyv3_oqCSB0j+XucTjNM0S+BFsQpVA@mail.gmail.com)**
Amit Langote posted v5 of a patch series addressing partition pruning in PostgreSQL's generic cached plans. The series introduces ExecutorPrep(), which extracts permission checks, range table initialization, and initial partition pruning from InitPlan() into a separate callable helper. This enables pruning-aware locking in GetCachedPlan(), where only surviving partitions are locked rather than all child partitions. Key changes from v4 include removing the ExecPrep struct, moving PARAM_EXEC setup, and adding comprehensive tests. The approach involves running pruning during plan cache validation rather than execution, raising concerns about snapshot semantics and EState memory lifetime management. The series includes six patches covering refactoring, ExecutorPrep introduction, testing, pruning-aware locking, SQL function support, and parallel worker optimization. Amit seeks review particularly on executor lifecycle and plan cache internals.

Participants:
alvherre@alvh.no-ip.org, amitlangote09@gmail.com, andres@anarazel.de, daniel@yesql.se, dgrowleyml@gmail.com, exclusion@gmail.com, li.evan.chao@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us, thom@linux.com, tndrwang@gmail.com, tomas@vondra.me



## **Industry News**

### **[Elon Musk suggests spate of xAI exits have been push, not pull](https://techcrunch.com/2026/02/11/senior-engineers-including-co-founders-exit-xai-amid-controversy?utm_campaign=daily_pm)**
At least nine engineers, including two co-founders, have announced their exits from xAI in the past week, fueling online speculation and raising questions about stability at Musk's AI company. The departures come amid mounting controversy surrounding the company. Musk has suggested that these exits were initiated by the company rather than voluntary departures by the employees. The timing and scale of the departures have drawn significant attention in the AI industry, as xAI had been positioning itself as a major competitor in the artificial intelligence space. The company has not provided detailed explanations for the personnel changes, leaving industry observers to speculate about internal dynamics and strategic shifts at the Musk-led venture.

### **[Former Founders Fund VC Sam Blond launches AI sales startup to upend Salesforce](https://techcrunch.com/2026/02/11/former-founders-fund-vc-sam-blond-launches-ai-sales-startup-to-upend-salesforce?utm_campaign=daily_pm)**
Former Founders Fund venture capitalist Sam Blond has launched Monaco, an AI-native all-in-one CRM system that aims to challenge Salesforce's dominance in the sales software market. The startup has emerged from stealth mode with backing from prominent investors including the Collison brothers and Garry Tan. Monaco positions itself as an integrated customer relationship management platform that leverages artificial intelligence capabilities to provide comprehensive sales tools and functionality. The company represents Blond's transition from venture capital investing to entrepreneurship, focusing on disrupting the established CRM market with AI-powered innovations. The startup's funding and high-profile investor backing suggest significant confidence in its potential to compete with incumbent players like Salesforce in the enterprise software space.

### **[OpenAI disbands mission alignment team, which focused on 'safe' and 'trustworthy' AI development](https://techcrunch.com/2026/02/11/openai-disbands-mission-alignment-team-which-focused-on-safe-and-trustworthy-ai-development?utm_campaign=daily_pm)**
OpenAI has dissolved its mission alignment team, which was responsible for ensuring the company's AI development efforts remained focused on safe and trustworthy artificial intelligence systems. The team's leader has been reassigned to a new role as OpenAI's chief futurist, while other team members have been redistributed throughout the organization. This organizational restructuring represents a significant shift in how OpenAI approaches AI safety and alignment concerns within its development processes. The disbanding of a dedicated safety-focused team raises questions about the company's ongoing commitment to responsible AI development practices. The move comes at a time when AI safety and alignment remain critical industry concerns, particularly as companies race to develop more powerful AI systems. The reassignment suggests a potential shift in OpenAI's internal priorities and operational structure.