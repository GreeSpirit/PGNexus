"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function TermsOfServicePage() {
  const { language } = useLanguage();
  return language === "zh" ? <ZhContent /> : <EnContent />;
}

/* ─── English ─────────────────────────────────────────────────────────────── */

function EnContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Last updated: March 4, 2026</p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          These Terms of Service ("Terms") govern your access to and use of PGNexus and its related services. By accessing or using PGNexus, you agree to be bound by these Terms. If you do not agree, please do not use our services.
        </p>
      </div>

      <Sec title="1. About PGNexus">
        <P>PGNexus is a community-driven intelligence platform for the PostgreSQL ecosystem. We aggregate news, mailing list discussions, patch analyses, tech blog posts, and social media updates from the global PostgreSQL community into a single, searchable, bilingual interface.</P>
      </Sec>

      <Sec title="2. Eligibility">
        <P>You must be at least 13 years of age (or 16 in jurisdictions where required) to use PGNexus. By using the platform, you represent that you meet this requirement and have the legal capacity to enter into these Terms. If you are using PGNexus on behalf of an organization, you represent that you have authority to bind that organization to these Terms.</P>
      </Sec>

      <Sec title="3. User Accounts">
        <P>Some features require a registered account. When you create an account, you agree to:</P>
        <UL items={[
          "Provide accurate, current, and complete information during registration.",
          "Maintain and promptly update your account information.",
          "Keep your password confidential and not share it with others.",
          <>Notify us immediately at <A href="mailto:support@pgnexus.com">support@pgnexus.com</A> if you suspect unauthorized access to your account.</>,
          "Accept responsibility for all activity that occurs under your account.",
        ]} />
        <P>We reserve the right to suspend or terminate accounts that violate these Terms or that have been inactive for an extended period.</P>
      </Sec>

      <Sec title="4. Acceptable Use">
        <P>You agree to use PGNexus only for lawful purposes and in accordance with these Terms. You must not:</P>
        <UL items={[
          "Use the platform in any way that violates applicable local, national, or international law or regulation.",
          "Transmit any unsolicited or unauthorized advertising or promotional material (spam).",
          "Impersonate any person or entity, or misrepresent your affiliation with any person or entity.",
          "Attempt to gain unauthorized access to any part of PGNexus, its servers, or any connected systems.",
          "Use automated tools (bots, scrapers, crawlers) to access PGNexus in a way that burdens our infrastructure, without prior written permission.",
          "Upload or transmit malware, viruses, or any other harmful code.",
          "Interfere with or disrupt the integrity or performance of PGNexus or the data contained therein.",
          "Circumvent any technical measures we use to protect the platform.",
          "Harvest or collect contact information of other users without their consent.",
        ]} />
      </Sec>

      <Sec title="5. User-Submitted Content">
        <P>PGNexus allows users to suggest articles, submit URLs, and provide other content ("User Content"). By submitting User Content, you:</P>
        <UL items={[
          "Represent that you have the right to submit the content and that it does not infringe any third-party rights.",
          "Grant PGNexus a non-exclusive, worldwide, royalty-free license to use, display, and process your submission in connection with operating the platform.",
          "Understand that submissions are subject to review and may be declined or removed at our discretion.",
        ]} />
        <P>You retain ownership of any intellectual property rights in your User Content. PGNexus does not claim ownership over content you submit.</P>
      </Sec>

      <Sec title="6. Aggregated Third-Party Content">
        <P>PGNexus displays aggregated content sourced from publicly available third-party sources, including the PostgreSQL mailing lists, RSS feeds, social media platforms, and news outlets. This content remains the property of its respective owners.</P>
        <P>If you believe content displayed on PGNexus infringes your intellectual property rights, please contact us at <A href="mailto:legal@pgnexus.com">legal@pgnexus.com</A>.</P>
      </Sec>

      <Sec title="7. Intellectual Property">
        <P>The PGNexus platform — including its design, logo, branding, original text, and software — is owned by PGNexus and protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or publicly exploit any part of PGNexus without our prior written permission.</P>
        <P>"PostgreSQL" is a trademark of the PostgreSQL Global Development Group. PGNexus is an independent community platform and is not affiliated with, endorsed by, or sponsored by the PostgreSQL Global Development Group.</P>
      </Sec>

      <Sec title="8. Privacy">
        <P>Your use of PGNexus is also governed by our <A href="/privacy-policy">Privacy Policy</A>, which is incorporated by reference into these Terms.</P>
      </Sec>

      <Sec title="9. Disclaimer of Warranties">
        <P>PGNexus is provided on an "as is" and "as available" basis, without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or uninterrupted, error-free service.</P>
        <P>We do not warrant that: (a) the platform will meet your requirements; (b) it will be available at any particular time; (c) any errors will be corrected; or (d) the platform is free of viruses or other harmful components. Content aggregated from third-party sources is provided for informational purposes only.</P>
      </Sec>

      <Sec title="10. Limitation of Liability">
        <P>To the fullest extent permitted by applicable law, PGNexus and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or other intangible losses, arising from:</P>
        <UL items={[
          "Your access to or use of (or inability to access or use) PGNexus.",
          "Any conduct or content of any third party on the platform.",
          "Any content obtained from PGNexus.",
          "Unauthorized access, use, or alteration of your transmissions or content.",
        ]} />
        <P>In no event shall our total liability exceed the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) USD $100.</P>
      </Sec>

      <Sec title="11. Indemnification">
        <P>You agree to indemnify and hold harmless PGNexus and its affiliates, officers, employees, and agents from any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising from: (a) your use of PGNexus; (b) your violation of these Terms; (c) your violation of any rights of another party; or (d) your User Content.</P>
      </Sec>

      <Sec title="12. Termination">
        <P>We may suspend or terminate your access to PGNexus at any time, with or without notice, for conduct that violates these Terms or that we believe is harmful to other users, us, or third parties.</P>
        <P>You may close your account at any time by contacting us. Upon termination, your right to use PGNexus ceases immediately. Provisions that by their nature should survive termination will do so.</P>
      </Sec>

      <Sec title="13. Governing Law and Disputes">
        <P>Any disputes arising out of or relating to these Terms or your use of PGNexus shall first be attempted to be resolved informally by contacting us at <A href="mailto:legal@pgnexus.com">legal@pgnexus.com</A>. If the dispute cannot be resolved informally, it shall be submitted to the courts of competent jurisdiction.</P>
      </Sec>

      <Sec title="14. Changes to These Terms">
        <P>We may modify these Terms at any time. We will notify you of material changes by updating the date at the top of this page and, where appropriate, by emailing you. Your continued use of PGNexus after changes are posted constitutes your acceptance of the revised Terms.</P>
      </Sec>

      <Sec title="15. Contact Us">
        <P>For questions about these Terms, please contact us:</P>
        <ContactBox email="legal@pgnexus.com" />
      </Sec>
    </div>
  );
}

/* ─── Chinese ─────────────────────────────────────────────────────────────── */

function ZhContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
          服务条款
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">最后更新：2026年3月4日</p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          本服务条款（以下简称"条款"）规范您对 PGNexus 及其相关服务的访问与使用。访问或使用 PGNexus，即表示您同意受本条款约束。若您不同意，请勿使用我们的服务。
        </p>
      </div>

      <Sec title="一、关于 PGNexus">
        <P>PGNexus 是一个面向 PostgreSQL 生态系统的社区驱动型信息平台。我们将来自全球 PostgreSQL 社区的新闻、邮件列表讨论、补丁分析、技术博客及社交媒体动态汇聚于一体，提供单一、可检索的双语界面。</P>
      </Sec>

      <Sec title="二、使用资格">
        <P>您须年满 13 岁（部分地区要求年满 16 岁）方可使用 PGNexus。使用本平台，即表示您声明满足上述年龄要求，且具备缔结本条款所必要的法律行为能力。若您代表某一组织使用 PGNexus，即表示您有权代表该组织接受本条款的约束。</P>
      </Sec>

      <Sec title="三、用户账户">
        <P>部分功能需要注册账户。创建账户时，您同意：</P>
        <UL items={[
          "在注册时提供准确、完整、最新的信息。",
          "及时维护和更新您的账户信息。",
          "对您的密码保密，不与他人共享。",
          <>若发现账户遭未经授权访问，立即通知我们：<A href="mailto:support@pgnexus.com">support@pgnexus.com</A>。</>,
          "对账户下发生的所有活动承担责任。",
        ]} />
        <P>我们保留对违反本条款或长期不活跃的账户暂停或终止服务的权利。</P>
      </Sec>

      <Sec title="四、可接受使用">
        <P>您同意仅以合法目的且遵照本条款使用 PGNexus。您不得：</P>
        <UL items={[
          "以任何违反适用的地方性、全国性或国际法律法规的方式使用本平台。",
          "发送任何未经请求或未经授权的广告或推广材料（垃圾信息）。",
          "冒充他人或组织，或虚假陈述您与任何人或组织的关系。",
          "试图未经授权访问 PGNexus 的任何部分、其服务器或任何连接系统。",
          "未经书面许可，使用自动化工具（机器人、爬虫等）以给我们基础设施造成负担的方式访问 PGNexus。",
          "上传或传播恶意软件、病毒或任何其他有害代码。",
          "干扰或破坏 PGNexus 的完整性、性能或其中所含数据。",
          "绕过我们用于保护平台的任何技术措施。",
          "未经用户同意，收集或采集其他用户的联系方式。",
        ]} />
      </Sec>

      <Sec title="五、用户提交内容">
        <P>PGNexus 允许用户推荐文章、提交链接及其他内容（以下简称"用户内容"）。提交用户内容，即表示您：</P>
        <UL items={[
          "声明您有权提交该内容，且其不侵犯任何第三方权利。",
          "授予 PGNexus 非独家、全球性、免版税的许可，以在运营平台的范围内使用、展示和处理您的提交内容。",
          "理解提交内容须经审核，可能被拒绝或删除。",
        ]} />
        <P>您保留对用户内容的知识产权。PGNexus 不主张对您提交内容的所有权。</P>
      </Sec>

      <Sec title="六、聚合第三方内容">
        <P>PGNexus 展示来自公开第三方来源的聚合内容，包括 PostgreSQL 邮件列表、RSS 订阅源、社交媒体平台及新闻媒体。这些内容归其各自所有者所有。</P>
        <P>若您认为 PGNexus 展示的内容侵犯了您的知识产权，请联系：<A href="mailto:legal@pgnexus.com">legal@pgnexus.com</A>，我们将及时处理。</P>
      </Sec>

      <Sec title="七、知识产权">
        <P>PGNexus 平台——包括其设计、标志、品牌形象、原创文字及软件——均归 PGNexus 所有，受适用知识产权法律保护。未经我们事先书面许可，您不得复制、分发、修改或公开利用 PGNexus 的任何部分。</P>
        <P>"PostgreSQL" 是 PostgreSQL 全球开发组的注册商标。PGNexus 是独立的社区平台，与 PostgreSQL 全球开发组无任何隶属、背书或赞助关系。</P>
      </Sec>

      <Sec title="八、隐私">
        <P>您对 PGNexus 的使用同样受我们的<A href="/privacy-policy">隐私政策</A>约束，该政策通过引用并入本条款。</P>
      </Sec>

      <Sec title="九、免责声明">
        <P>PGNexus 以"现状"和"可用状态"提供，不作任何明示或默示的保证，包括但不限于适销性、特定用途适用性或服务不中断、无错误的保证。</P>
        <P>我们不保证：（a）平台将满足您的需求；（b）服务在任何特定时间均可用；（c）任何错误均将得到纠正；（d）平台不含病毒或其他有害组件。来自第三方来源的聚合内容仅供参考。</P>
      </Sec>

      <Sec title="十、责任限制">
        <P>在适用法律允许的最大范围内，PGNexus 及其关联方、管理人员、员工和代理人不对任何间接性、附带性、特殊性、后果性或惩罚性损害承担责任，包括利润损失、数据损失、商誉损失或其他无形损失，无论其因以下原因产生：</P>
        <UL items={[
          "您访问或使用（或无法访问或使用）PGNexus。",
          "平台上任何第三方的行为或内容。",
          "从 PGNexus 获取的任何内容。",
          "对您的传输或内容的未经授权访问、使用或篡改。",
        ]} />
        <P>在任何情况下，我们的总责任不超过以下两者中的较高值：（a）您在索赔前 12 个月内向我们支付的金额；（b）100 美元。</P>
      </Sec>

      <Sec title="十一、赔偿">
        <P>您同意赔偿并使 PGNexus 及其关联方、管理人员、员工和代理人免受任何因以下原因产生的索赔、责任、损害、损失及费用（包括合理律师费）的损害：（a）您对 PGNexus 的使用；（b）您违反本条款；（c）您侵犯他方权利；（d）您的用户内容。</P>
      </Sec>

      <Sec title="十二、终止">
        <P>我们可随时以有通知或无通知的方式暂停或终止您对 PGNexus 的访问权限，适用于违反本条款或我们认为对其他用户、我们或第三方有害的行为。</P>
        <P>您可随时联系我们注销账户。终止后，您使用 PGNexus 的权利立即停止。按其性质应在终止后继续有效的条款将继续有效。</P>
      </Sec>

      <Sec title="十三、管辖法律与争议解决">
        <P>因本条款或您使用 PGNexus 引起的任何争议，应首先尝试通过联系 <A href="mailto:legal@pgnexus.com">legal@pgnexus.com</A> 以非正式方式解决。若无法非正式解决，应提交至有管辖权的法院处理。</P>
      </Sec>

      <Sec title="十四、条款变更">
        <P>我们可随时修改本条款。重大变更将通过更新页面顶部的日期，以及在适当情况下通过邮件通知您。变更发布后继续使用 PGNexus，即视为您接受修订后的条款。</P>
      </Sec>

      <Sec title="十五、联系我们">
        <P>如您对本条款有任何疑问，欢迎联系我们：</P>
        <ContactBox email="legal@pgnexus.com" />
      </Sec>
    </div>
  );
}

/* ─── Shared helpers ──────────────────────────────────────────────────────── */

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-8 space-y-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{children}</p>;
}

function UL({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="list-disc list-outside pl-5 space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item}</li>
      ))}
    </ul>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline">{children}</a>;
}

function ContactBox({ email }: { email: string }) {
  return (
    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">PGNexus</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Email: <A href={`mailto:${email}`}>{email}</A>
      </p>
    </div>
  );
}
