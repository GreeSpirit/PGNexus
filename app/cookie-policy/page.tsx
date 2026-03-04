"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function CookiePolicyPage() {
  const { language } = useLanguage();
  return language === "zh" ? <ZhContent /> : <EnContent />;
}

/* ─── English ─────────────────────────────────────────────────────────────── */

function EnContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
          Cookie Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Last updated: March 4, 2026</p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This Cookie Policy explains what cookies are, how PGNexus uses them, and your choices regarding their use. By continuing to use PGNexus, you consent to our use of cookies as described in this policy.
        </p>
      </div>

      <Sec title="1. What Are Cookies?">
        <P>Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide information to site owners about how users interact with their site.</P>
        <P>Cookies can be "session cookies" (deleted when you close your browser) or "persistent cookies" (remaining on your device for a set period). They can also be "first-party" (set by PGNexus) or "third-party" (set by external services).</P>
      </Sec>

      <Sec title="2. Cookies We Use">
        <P>PGNexus uses the following cookies:</P>
        <CookieTable cookies={[
          { name: "Session / Authentication", type: "Essential", duration: "Session", purpose: "Keeps you logged in during your browsing session. Without this cookie, you would need to re-enter your credentials on every page." },
          { name: "next-auth.session-token", type: "Essential", duration: "30 days", purpose: "Stores your authentication token for persistent login when you choose 'remember me'." },
          { name: "next-auth.csrf-token", type: "Essential", duration: "Session", purpose: "Cross-site request forgery protection token to ensure form submissions originate from PGNexus." },
          { name: "language", type: "Functional", duration: "1 year", purpose: "Remembers your language preference (English or Chinese) so you see the correct language on your next visit." },
          { name: "theme", type: "Functional", duration: "1 year", purpose: "Remembers your display preference (light or dark mode)." },
        ]} />
      </Sec>

      <Sec title="3. Cookie Categories">
        <P>We organize our cookies into the following categories:</P>
        <div className="space-y-4 mt-3">
          <CategoryCard title="Essential Cookies" color="blue" description="Strictly necessary for PGNexus to function. They are set in response to actions you take, such as logging in or setting your language. Blocking these cookies will prevent parts of the site from working." />
          <CategoryCard title="Functional Cookies" color="green" description="Enable enhanced functionality and personalization such as language and theme preferences. If you disable these, some features may not function correctly." />
          <CategoryCard title="Analytics Cookies" color="purple" description="Allow us to understand how visitors interact with PGNexus by collecting information anonymously. We do not currently use third-party analytics services that set persistent tracking cookies." />
        </div>
      </Sec>

      <Sec title="4. Third-Party Cookies">
        <P>PGNexus aggregates content from platforms such as LinkedIn, YouTube, WeChat, GitHub, and X (formerly Twitter). When content from these platforms is embedded or linked, those platforms may set their own cookies, subject to their own policies.</P>
        <P>We encourage you to review the cookie policies of these platforms:</P>
        <UL items={[
          <><A href="https://www.youtube.com/t/privacy" external>YouTube (Google) Privacy Policy</A></>,
          <><A href="https://www.linkedin.com/legal/privacy-policy" external>LinkedIn Privacy Policy</A></>,
          <><A href="https://twitter.com/privacy" external>X (Twitter) Privacy Policy</A></>,
          <><A href="https://github.com/privacy" external>GitHub Privacy Statement</A></>,
        ]} />
      </Sec>

      <Sec title="5. How to Control Cookies">
        <Sub>Browser Settings</Sub>
        <P>Most browsers let you control cookies through their settings. You can block cookies, be alerted when cookies are sent, or delete existing cookies. Refer to your browser's help documentation:</P>
        <UL items={[
          <><A href="https://support.google.com/chrome/answer/95647" external>Google Chrome</A></>,
          <><A href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" external>Mozilla Firefox</A></>,
          <><A href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" external>Safari</A></>,
          <><A href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" external>Microsoft Edge</A></>,
        ]} />
        <Sub>On PGNexus</Sub>
        <P>You can manage your language and theme preferences directly in your account settings. Authentication cookies are deleted automatically when you sign out.</P>
        <P className="mt-2"><strong className="text-slate-800 dark:text-slate-200">Please note:</strong> Disabling essential cookies will prevent you from logging in and accessing personalized features.</P>
      </Sec>

      <Sec title="6. Do Not Track">
        <P>Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. PGNexus respects DNT signals where technically feasible and does not use persistent cross-site tracking cookies.</P>
      </Sec>

      <Sec title="7. Changes to This Policy">
        <P>We may update this Cookie Policy from time to time. We will notify you of material changes by updating the date at the top of this page. Your continued use of PGNexus after changes are posted constitutes acceptance of the updated policy.</P>
      </Sec>

      <Sec title="8. Contact Us">
        <P>If you have questions about our use of cookies, please contact us:</P>
        <ContactBox email="privacy@pgnexus.com" />
        <P className="mt-3">For more information about how we handle your personal data, please see our <A href="/privacy-policy">Privacy Policy</A>.</P>
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
          Cookie 使用政策
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">最后更新：2026年3月4日</p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          本 Cookie 使用政策说明 Cookie 是什么、PGNexus 如何使用 Cookie，以及您对 Cookie 使用的选择权。继续使用 PGNexus，即表示您同意我们按本政策所述使用 Cookie。
        </p>
      </div>

      <Sec title="一、什么是 Cookie？">
        <P>Cookie 是当您访问网站时存储在您设备（电脑、平板或手机）上的小型文本文件。Cookie 被广泛用于提升网站运行效率、记住您的偏好设置，以及向网站所有者提供用户行为信息。</P>
        <P>Cookie 分为"会话 Cookie"（浏览器关闭时删除）和"持久 Cookie"（在设备上保存一段时间）两类，也可分为"第一方 Cookie"（由 PGNexus 设置）和"第三方 Cookie"（由外部服务设置）。</P>
      </Sec>

      <Sec title="二、我们使用的 Cookie">
        <P>PGNexus 使用以下 Cookie：</P>
        <CookieTable cookies={[
          { name: "Session / Authentication", type: "必要", duration: "会话期", purpose: "在您的浏览会话期间保持登录状态。若禁用此 Cookie，您需要在每个页面重新输入凭据。" },
          { name: "next-auth.session-token", type: "必要", duration: "30 天", purpose: "当您选择「记住我」时，存储您的身份验证令牌以实现持久登录。" },
          { name: "next-auth.csrf-token", type: "必要", duration: "会话期", purpose: "跨站请求伪造防护令牌，确保表单提交来自 PGNexus。" },
          { name: "language", type: "功能性", duration: "1 年", purpose: "记住您的语言偏好（中文或英文），以便下次访问时显示正确的语言。" },
          { name: "theme", type: "功能性", duration: "1 年", purpose: "记住您的显示偏好（浅色或深色模式）。" },
        ]} />
      </Sec>

      <Sec title="三、Cookie 类别">
        <P>我们将 Cookie 分为以下几类：</P>
        <div className="space-y-4 mt-3">
          <CategoryCard title="必要 Cookie" color="blue" description="这类 Cookie 是 PGNexus 正常运行的必备条件，无法关闭。它们通常在您执行登录、设置语言等操作时被设置。若在浏览器中禁用此类 Cookie，部分功能将无法正常使用。" />
          <CategoryCard title="功能性 Cookie" color="green" description="这类 Cookie 实现增强功能和个性化体验，例如语言偏好和主题设置。若禁用，部分功能可能无法正常运行。" />
          <CategoryCard title="分析性 Cookie" color="purple" description="这类 Cookie 帮助我们匿名收集和分析访客与 PGNexus 的交互情况，用于改善平台性能和内容质量。我们目前不使用设置持久跟踪 Cookie 的第三方分析服务。" />
        </div>
      </Sec>

      <Sec title="四、第三方 Cookie">
        <P>PGNexus 汇聚来自 LinkedIn、YouTube、微信、GitHub、X（原 Twitter）等平台的内容。当这些平台的内容被嵌入或链接至 PGNexus 时，这些平台可能会在您的设备上设置其自有 Cookie，相关处理受其各自的隐私政策约束。</P>
        <P>建议您查阅以下平台的 Cookie 相关政策：</P>
        <UL items={[
          <><A href="https://www.youtube.com/t/privacy" external>YouTube（Google）隐私政策</A></>,
          <><A href="https://www.linkedin.com/legal/privacy-policy" external>LinkedIn 隐私政策</A></>,
          <><A href="https://twitter.com/privacy" external>X（Twitter）隐私政策</A></>,
          <><A href="https://github.com/privacy" external>GitHub 隐私声明</A></>,
        ]} />
      </Sec>

      <Sec title="五、如何管理 Cookie">
        <Sub>浏览器设置</Sub>
        <P>大多数浏览器允许您通过设置管理 Cookie，包括屏蔽 Cookie、在 Cookie 发送时收到提醒或删除已设置的 Cookie。请参阅各浏览器的帮助文档：</P>
        <UL items={[
          <><A href="https://support.google.com/chrome/answer/95647" external>Google Chrome</A></>,
          <><A href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" external>Mozilla Firefox</A></>,
          <><A href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" external>Safari</A></>,
          <><A href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" external>Microsoft Edge</A></>,
        ]} />
        <Sub>在 PGNexus 上</Sub>
        <P>您可以在账户设置中直接管理语言和主题偏好。退出登录后，身份验证 Cookie 将自动删除。</P>
        <P className="mt-2"><strong className="text-slate-800 dark:text-slate-200">请注意：</strong>禁用必要 Cookie 将导致您无法登录并访问 PGNexus 的个性化功能。</P>
      </Sec>

      <Sec title="六、请勿追踪（Do Not Track）">
        <P>部分浏览器提供"请勿追踪"（DNT）功能，向网站发出您不希望被追踪的信号。在技术可行的范围内，PGNexus 尊重 DNT 信号，且不使用持久性跨站追踪 Cookie。</P>
      </Sec>

      <Sec title="七、政策变更">
        <P>我们可能不时更新本 Cookie 使用政策。重大变更将通过更新页面顶部的日期予以告知。变更发布后继续使用 PGNexus，即视为您接受更新后的政策。</P>
      </Sec>

      <Sec title="八、联系我们">
        <P>如您对我们使用 Cookie 有任何疑问，欢迎联系我们：</P>
        <ContactBox email="privacy@pgnexus.com" />
        <P className="mt-3">如需了解我们处理个人数据的更多信息，请查阅我们的<A href="/privacy-policy">隐私政策</A>。</P>
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

function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-slate-600 dark:text-slate-400 leading-relaxed ${className ?? ""}`}>{children}</p>;
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

function A({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
      className="text-blue-600 dark:text-blue-400 hover:underline">
      {children}
    </a>
  );
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

interface CookieRow { name: string; type: string; duration: string; purpose: string; }

function CookieTable({ cookies }: { cookies: CookieRow[] }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide w-44">Cookie</th>
            <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide w-24">类型 / Type</th>
            <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide w-20">有效期 / Duration</th>
            <th className="text-left py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">用途 / Purpose</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((c, i) => (
            <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
              <td className="py-3 pr-4 font-mono text-xs text-slate-800 dark:text-slate-200 align-top">{c.name}</td>
              <td className="py-3 pr-4 align-top">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.type === "Essential" || c.type === "必要"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : c.type === "Functional" || c.type === "功能性"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                }`}>{c.type}</span>
              </td>
              <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400 align-top">{c.duration}</td>
              <td className="py-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed align-top">{c.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoryCard({ title, color, description }: { title: string; color: "blue" | "green" | "purple"; description: string }) {
  const border = { blue: "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20", green: "border-l-green-500 bg-green-50/50 dark:bg-green-950/20", purple: "border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20" };
  const titleCls = { blue: "text-blue-800 dark:text-blue-300", green: "text-green-800 dark:text-green-300", purple: "text-purple-800 dark:text-purple-300" };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${border[color]}`}>
      <p className={`text-sm font-semibold mb-1 ${titleCls[color]}`}>{title}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
