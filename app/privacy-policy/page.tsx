"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  return language === "zh" ? <ZhContent /> : <EnContent />;
}

/* ─── English ─────────────────────────────────────────────────────────────── */

function EnContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Last updated: March 4, 2026</p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          PGNexus (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use PGNexus. Please read this carefully — if you disagree with its terms, please discontinue use of the site.
        </p>
      </div>

      <Sec title="1. Information We Collect">
        <Sub>Information You Provide Directly</Sub>
        <P>When you create an account or interact with PGNexus, we may collect:</P>
        <UL items={[
          <><B>Account information</B> — your name and email address when you register.</>,
          <><B>Profile information</B> — any optional details you add to your user profile.</>,
          <><B>Submitted content</B> — article suggestions, URLs, and other content you submit through the platform.</>,
        ]} />
        <Sub>Information Collected Automatically</Sub>
        <P>When you use PGNexus, we automatically collect certain technical information:</P>
        <UL items={[
          <><B>Log data</B> — your IP address, browser type, pages visited, time spent, and referring URLs.</>,
          <><B>Device information</B> — device type, operating system, and unique device identifiers.</>,
          <><B>Usage data</B> — how you interact with features, search queries, and content viewed.</>,
          <><B>Cookies</B> — session cookies for authentication and preference cookies to remember your settings. See our <A href="/cookie-policy">Cookie Policy</A> for details.</>,
        ]} />
        <Sub>Information from Third Parties</Sub>
        <P>We do not purchase personal data from third-party data brokers. Aggregated PostgreSQL news and community content on PGNexus is sourced from publicly available mailing lists, RSS feeds, and social media platforms.</P>
      </Sec>

      <Sec title="2. How We Use Your Information">
        <P>We use the information we collect to:</P>
        <UL items={[
          "Create and manage your account, and authenticate your identity.",
          "Provide, operate, and improve the PGNexus platform and its features.",
          "Personalize your experience, including language and display preferences.",
          "Send transactional emails such as account verification and password resets.",
          "Monitor and analyze usage trends to improve content quality and platform performance.",
          "Detect, investigate, and prevent fraudulent activity and security incidents.",
          "Comply with legal obligations and enforce our Terms of Service.",
        ]} />
        <P>We do not sell your personal information to third parties, and we do not use your data for advertising profiling.</P>
      </Sec>

      <Sec title="3. Legal Basis for Processing (EEA/UK Users)">
        <P>If you are in the European Economic Area or United Kingdom, our legal bases for processing your data are:</P>
        <UL items={[
          <><B>Performance of a contract</B> — processing necessary to provide you with the service you requested.</>,
          <><B>Legitimate interests</B> — operating and improving our platform, where not overridden by your rights.</>,
          <><B>Legal obligation</B> — where processing is required by applicable law.</>,
          <><B>Consent</B> — where you have given explicit consent, such as for optional communications.</>,
        ]} />
      </Sec>

      <Sec title="4. Sharing of Information">
        <P>We do not sell, trade, or rent your personal information. We may share it only in these limited circumstances:</P>
        <UL items={[
          <><B>Service providers</B> — trusted vendors who help us operate PGNexus, bound by confidentiality agreements.</>,
          <><B>Legal requirements</B> — when required by law, court order, or to protect the rights and safety of PGNexus and its users.</>,
          <><B>Business transfers</B> — in connection with a merger, acquisition, or sale of assets, with prior notice to you.</>,
          <><B>With your consent</B> — for any other purpose, only with your explicit permission.</>,
        ]} />
      </Sec>

      <Sec title="5. Data Retention">
        <P>We retain your personal data for as long as your account is active or as needed to provide services. You may delete your account at any time; we will delete or anonymize your personal data within 30 days, except where retention is required for legal or compliance purposes.</P>
        <P>Aggregated or anonymized data that cannot identify you may be retained indefinitely for analytics purposes.</P>
      </Sec>

      <Sec title="6. Your Rights and Choices">
        <P>Depending on your location, you may have the following rights:</P>
        <UL items={[
          <><B>Access</B> — request a copy of the personal data we hold about you.</>,
          <><B>Correction</B> — request correction of inaccurate or incomplete data.</>,
          <><B>Deletion</B> — request deletion of your personal data (&ldquo;right to be forgotten&rdquo;).</>,
          <><B>Portability</B> — receive your data in a structured, machine-readable format.</>,
          <><B>Objection</B> — object to processing based on legitimate interests.</>,
          <><B>Restriction</B> — request we restrict processing of your data in certain circumstances.</>,
          <><B>Withdraw consent</B> — where processing is based on consent, withdraw it at any time.</>,
        ]} />
        <P>To exercise these rights, contact us at <A href="mailto:privacy@pgnexus.com">privacy@pgnexus.com</A>. We will respond within 30 days.</P>
      </Sec>

      <Sec title="7. Security">
        <P>We implement industry-standard measures to protect your personal data, including encrypted connections (TLS), hashed password storage, and access controls. No internet transmission is 100% secure, and we cannot guarantee absolute security.</P>
        <P>If you become aware of any security vulnerability, please notify us at <A href="mailto:security@pgnexus.com">security@pgnexus.com</A>.</P>
      </Sec>

      <Sec title="8. International Transfers">
        <P>PGNexus may be operated from servers located outside your country. If you are in the EEA, UK, or Switzerland, your data may be transferred to countries without equivalent data protection. Where required, we rely on safeguards such as Standard Contractual Clauses approved by the European Commission.</P>
      </Sec>

      <Sec title="9. Children's Privacy">
        <P>PGNexus is not directed at children under 13 (or 16 in some jurisdictions). We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.</P>
      </Sec>

      <Sec title="10. Third-Party Links">
        <P>PGNexus aggregates and links to content from external websites. Once you leave our site, this Privacy Policy no longer applies. We are not responsible for the privacy practices of external sites.</P>
      </Sec>

      <Sec title="11. Changes to This Policy">
        <P>We may update this Privacy Policy from time to time. We will notify you of material changes by updating the date at the top of this page and, where appropriate, by emailing you. Your continued use of PGNexus after changes are posted constitutes acceptance of the updated policy.</P>
      </Sec>

      <Sec title="12. Contact Us">
        <P>If you have questions regarding this Privacy Policy, please contact us:</P>
        <ContactBox email="privacy@pgnexus.com" />
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
          隐私政策
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">最后更新：2026年3月4日</p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          PGNexus（以下简称&ldquo;我们&rdquo;）高度重视用户的隐私保护。本隐私政策说明我们在您使用 PGNexus 时如何收集、使用、披露及保护您的信息。请您仔细阅读本政策。若您不同意本政策的条款，请停止使用本平台。
        </p>
      </div>

      <Sec title="一、我们收集的信息">
        <Sub>您主动提供的信息</Sub>
        <P>当您注册账户或使用 PGNexus 的相关功能时，我们可能收集：</P>
        <UL items={[
          <><B>账户信息</B>——注册时提供的姓名和电子邮箱地址。</>,
          <><B>个人资料信息</B>——您在个人主页中填写的可选信息。</>,
          <><B>提交内容</B>——您通过平台提交的文章建议、链接及其他内容。</>,
        ]} />
        <Sub>自动收集的信息</Sub>
        <P>您使用 PGNexus 时，我们会自动收集以下技术信息：</P>
        <UL items={[
          <><B>日志数据</B>——您的 IP 地址、浏览器类型、访问页面、停留时长及来源 URL。</>,
          <><B>设备信息</B>——设备类型、操作系统及唯一设备标识符。</>,
          <><B>使用数据</B>——您与功能的交互方式、搜索词及浏览内容。</>,
          <><B>Cookie</B>——用于身份验证的会话 Cookie 及记录偏好设置的功能性 Cookie。详情请参阅我们的 <A href="/cookie-policy">Cookie 政策</A>。</>,
        ]} />
        <Sub>来自第三方的信息</Sub>
        <P>我们不从第三方数据经纪商购买个人数据。PGNexus 展示的 PostgreSQL 新闻及社区内容均来源于公开可访问的邮件列表、RSS 订阅源及社交媒体平台。</P>
      </Sec>

      <Sec title="二、信息的使用方式">
        <P>我们将收集到的信息用于以下目的：</P>
        <UL items={[
          "创建和管理您的账户，验证您的身份。",
          "提供、运营并持续改善 PGNexus 平台及其功能。",
          "个性化您的使用体验，包括语言和显示偏好设置。",
          "发送账户验证邮件、密码重置等事务性通知。",
          "分析使用趋势，以提升内容质量和平台性能。",
          "检测、调查并防范欺诈行为及安全事故。",
          "履行法律义务，执行我们的服务条款。",
        ]} />
        <P>我们不会将您的个人信息出售给第三方，也不会将您的数据用于广告定向投放。</P>
      </Sec>

      <Sec title="三、处理信息的法律依据（适用于欧洲经济区/英国用户）">
        <P>若您位于欧洲经济区或英国，我们处理您个人数据的法律依据如下：</P>
        <UL items={[
          <><B>履行合同</B>——为向您提供所请求的服务而必须进行的处理。</>,
          <><B>合法利益</B>——在不凌驾于您的权利之上的前提下，运营和改善我们的平台。</>,
          <><B>法律义务</B>——适用法律要求的处理。</>,
          <><B>用户同意</B>——您明确同意的情形，例如接收可选通知。</>,
        ]} />
      </Sec>

      <Sec title="四、信息的共享">
        <P>我们不会出售、交换或出租您的个人信息。仅在以下有限情形下，我们可能共享您的信息：</P>
        <UL items={[
          <><B>服务提供商</B>——协助我们运营 PGNexus 的受信任供应商（如托管、数据库、分析服务），均受保密协议约束。</>,
          <><B>法律要求</B>——在法律法规、法院命令或政府机关要求时，或为保护 PGNexus 及其用户的权利和安全。</>,
          <><B>业务转让</B>——在合并、收购或资产出售时，我们将提前通知您。</>,
          <><B>您的同意</B>——其他任何情形，仅在获得您明确许可后进行。</>,
        ]} />
      </Sec>

      <Sec title="五、数据保留">
        <P>只要您的账户处于活跃状态或为向您提供服务所需，我们将保留您的个人数据。您可随时注销账户；我们将在 30 天内删除或匿名化您的个人数据，但法律、税务或合规要求保留的情形除外。</P>
        <P>无法识别您身份的聚合或匿名数据可能被无限期保留用于分析目的。</P>
      </Sec>

      <Sec title="六、您的权利与选择">
        <P>根据您所在地区，您可能对个人数据享有以下权利：</P>
        <UL items={[
          <><B>访问权</B>——请求获取我们持有的关于您的个人数据副本。</>,
          <><B>更正权</B>——请求更正不准确或不完整的数据。</>,
          <><B>删除权</B>——请求删除您的个人数据（&ldquo;被遗忘权&rdquo;）。</>,
          <><B>数据可携带权</B>——以结构化、机器可读的格式获取您的数据。</>,
          <><B>异议权</B>——对基于合法利益的处理提出异议。</>,
          <><B>限制处理权</B>——在特定情形下请求限制对您数据的处理。</>,
          <><B>撤回同意权</B>——在处理基于同意的情形下，可随时撤回同意，不影响此前的处理。</>,
        ]} />
        <P>如需行使上述任何权利，请联系我们：<A href="mailto:privacy@pgnexus.com">privacy@pgnexus.com</A>。我们将在 30 天内回复。</P>
      </Sec>

      <Sec title="七、数据安全">
        <P>我们采用行业标准的技术和组织措施保护您的个人数据，包括加密传输（TLS）、密码哈希存储及访问控制。但互联网传输或电子存储并非绝对安全，我们无法保证完全的数据安全。</P>
        <P>如您发现任何安全漏洞或疑似数据泄露，请立即联系我们：<A href="mailto:security@pgnexus.com">security@pgnexus.com</A>。</P>
      </Sec>

      <Sec title="八、跨境数据传输">
        <P>PGNexus 的服务器可能位于您所在国家或地区以外。若您位于欧洲经济区、英国或瑞士，您的数据可能被传输至数据保护水平较低的国家。在此类情形下，我们将依赖欧盟委员会批准的标准合同条款等适当保障措施。</P>
      </Sec>

      <Sec title="九、儿童隐私">
        <P>PGNexus 不面向 13 岁以下儿童（部分地区为 16 岁以下）。我们不会故意收集儿童的个人信息。如您认为某位儿童向我们提供了个人信息，请联系我们，我们将立即予以删除。</P>
      </Sec>

      <Sec title="十、第三方链接">
        <P>PGNexus 汇聚并链接来自外部网站（包括 PostgreSQL 邮件列表、技术博客及社交媒体平台）的内容。离开本站后，本隐私政策不再适用。我们不对外部网站的隐私实践承担责任。</P>
      </Sec>

      <Sec title="十一、政策变更">
        <P>我们可能不时更新本隐私政策。我们将通过更新页面顶部的日期，以及在必要时向您的注册邮箱发送通知，告知您重大变更。变更发布后继续使用 PGNexus，即视为您接受更新后的政策。</P>
      </Sec>

      <Sec title="十二、联系我们">
        <P>如您对本隐私政策有任何疑问、意见或请求，欢迎联系我们：</P>
        <ContactBox email="privacy@pgnexus.com" />
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

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-1">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{children}</p>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="text-slate-800 dark:text-slate-200">{children}</strong>;
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
