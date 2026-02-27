"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { User, Bell, Bot, LayoutDashboard, Save, Eye, EyeOff, Copy, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import Image from "next/image";

function UserProfileContent() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get tab from URL, default to dashboard
  const tabFromUrl = (searchParams.get("tab") as "dashboard" | "profile" | "subscriptions" | "bot") || "dashboard";
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "subscriptions" | "bot">(tabFromUrl);

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Profile completion states
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [country, setCountry] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Bot Access states
  const [telegramSecret, setTelegramSecret] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [isLoadingSecret, setIsLoadingSecret] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch telegram secret function - DEFINE BEFORE ANY RETURNS
  const fetchTelegramSecret = useCallback(async () => {
    setIsLoadingSecret(true);
    try {
      const response = await fetch("/api/user/telegram-secret");
      if (response.ok) {
        const data = await response.json();
        setTelegramSecret(data.telegram_secret);
      }
    } catch (error) {
      console.error("Error fetching telegram secret:", error);
    } finally {
      setIsLoadingSecret(false);
    }
  }, []);

  // ALL EFFECTS MUST BE BEFORE ANY CONDITIONAL RETURNS
  // Update active tab when URL changes
  useEffect(() => {
    const urlTab = searchParams.get("tab") as "dashboard" | "profile" | "subscriptions" | "bot";
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    } else if (!urlTab && activeTab !== "dashboard") {
      setActiveTab("dashboard");
    }
  }, [searchParams, activeTab]);

  // Update name when session loads
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  // Handle redirect if not authenticated
  useEffect(() => {
    if (status !== "loading" && !session?.user) {
      router.replace("/login");
    }
  }, [status, session, router]);

  // Set a timeout for loading state (5 seconds)
  useEffect(() => {
    if (status === "loading") {
      const timeout = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000);

      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [status]);

  // Fetch telegram secret when bot tab is active
  useEffect(() => {
    if (activeTab === "bot" && session?.user) {
      fetchTelegramSecret();
    }
  }, [activeTab, session, fetchTelegramSecret]);

  // NOW WE CAN HAVE CONDITIONAL RETURNS
  // Show loading state
  if (status === "loading" && !loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  // If loading timeout or session check failed, redirect to login
  if (loadingTimeout || (status !== "loading" && !session?.user)) {
    if (typeof window !== 'undefined') {
      router.replace("/login");
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Redirecting...</div>
      </div>
    );
  }

  // Don't render if no session
  if (!session?.user) {
    return null;
  }

  const userName = session.user.name || session.user.email || "User";

  const menuItems = [
    { id: "dashboard" as const, label: t(trans.userProfile.dashboard), icon: LayoutDashboard },
    { id: "profile" as const, label: t(trans.userProfile.profile), icon: User },
    { id: "subscriptions" as const, label: t(trans.userProfile.subscriptions), icon: Bell },
    { id: "bot" as const, label: t(trans.userProfile.botAccess), icon: Bot },
  ];

  // Handle tab change - update URL
  const handleTabChange = (tab: "dashboard" | "profile" | "subscriptions" | "bot") => {
    setActiveTab(tab);
    router.push(`/user/profile?tab=${tab}`, { scroll: false });
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    // TODO: Implement API call to update name
    setTimeout(() => {
      alert("Name update functionality will be implemented soon!");
      setIsUpdating(false);
    }, 1000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    setIsUpdating(true);
    // TODO: Implement API call to change password
    setTimeout(() => {
      alert("Password change functionality will be implemented soon!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsUpdating(false);
    }, 1000);
  };

  const handleGenerateSecret = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/user/telegram-secret", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setTelegramSecret(data.telegram_secret);
        setShowSecret(true);
      }
    } catch (error) {
      console.error("Error generating telegram secret:", error);
      alert("Failed to generate secret. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySecret = () => {
    if (telegramSecret) {
      navigator.clipboard.writeText(telegramSecret);
      alert(t(trans.userProfile.secretCopied));
    }
  };

  const maskSecret = (secret: string) => {
    return "*".repeat(secret.length);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    // TODO: Implement API call to save profile
    setTimeout(() => {
      setProfileSaved(true);
      setIsUpdating(false);
      setTimeout(() => setProfileSaved(false), 3000);
    }, 1000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement file upload
      // For now, just simulate a successful upload
      setAvatar(URL.createObjectURL(file));
    }
  };

  // ISO-3166 country codes and names
  const countries = [
    { code: "CN", name: "China" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "JP", name: "Japan" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "IN", name: "India" },
    { code: "BR", name: "Brazil" },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg p-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 px-3">
              {t(trans.userProfile.userMenu)}
            </h2>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg p-8">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {avatar ? (
                          <Image
                            src={avatar}
                            alt="User Avatar"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white dark:border-slate-800"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-2 border-white dark:border-slate-800">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                          {t(trans.userProfile.hello)} {userName}!
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        {isEditingProfile ? t(trans.common.cancel) : t(trans.userProfile.completeProfile)}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {profileSaved && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 font-medium">
                    {t(trans.userProfile.profileSaved)}
                  </div>
                )}
                
                {isEditingProfile ? (
                  <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                      {t(trans.userProfile.completeProfile)}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {t(trans.userProfile.completeProfileDescription)}
                    </p>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t(trans.userProfile.name)}
                          </label>
                          <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t(trans.userProfile.namePlaceholder)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t(trans.userProfile.jobTitle)}
                          </label>
                          <Input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder={t(trans.userProfile.jobTitlePlaceholder)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t(trans.userProfile.company)}
                          </label>
                          <Input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder={t(trans.userProfile.companyPlaceholder)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t(trans.userProfile.country)}
                          </label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                            placeholder={t(trans.userProfile.countryPlaceholder)}
                          >
                            <option value="">{t(trans.userProfile.countryPlaceholder)}</option>
                            {countries.map((countryOption) => (
                              <option key={countryOption.code} value={countryOption.code}>
                                {countryOption.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t(trans.userProfile.bio)}
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder={t(trans.userProfile.bioPlaceholder)}
                          rows={4}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t(trans.userProfile.avatar)}
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                            {avatar ? (
                              <Image
                                src={avatar}
                                alt="Avatar Preview"
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            ) : (
                              <User className="h-8 w-8 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                              id="avatar-upload"
                            />
                            <label
                              htmlFor="avatar-upload"
                              className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-all"
                            >
                              {t(trans.userProfile.uploadAvatar)}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          disabled={isUpdating}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isUpdating ? t(trans.userProfile.updating) : t(trans.userProfile.saveProfile)}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          variant="outline"
                          className="px-6"
                        >
                          {t(trans.common.cancel)}
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg p-6">
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                        {t(trans.userProfile.completeProfile)}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {t(trans.userProfile.completeProfileDescription)}
                      </p>
                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        {t(trans.userProfile.completeProfile)}
                      </Button>
                    </div>
                    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg p-6">
                      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                        {t(trans.userProfile.dashboard)}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {t(trans.userProfile.underConstruction)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                        <div className="animate-pulse flex gap-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="w-2 h-2 bg-indigo-600 rounded-full animation-delay-200"></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animation-delay-400"></div>
                        </div>
                        <span>{t(trans.userProfile.comingSoon)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                  {t(trans.userProfile.profileSettings)}
                </h2>

                {/* Update Info Form */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    {t(trans.userProfile.updateInfo)}
                  </h3>
                  <form onSubmit={handleUpdateName} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.name)}
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t(trans.userProfile.namePlaceholder)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.emailReadOnly)}
                      </label>
                      <Input
                        type="email"
                        value={session.user.email || ""}
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-800"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdating ? t(trans.userProfile.updating) : t(trans.userProfile.updateInfoButton)}
                    </Button>
                  </form>
                </div>

                {/* Change Password Form */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    {t(trans.userProfile.changePassword)}
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.currentPassword)}
                      </label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={t(trans.userProfile.currentPasswordPlaceholder)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.newPassword)}
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t(trans.userProfile.newPasswordPlaceholder)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t(trans.userProfile.confirmNewPassword)}
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t(trans.userProfile.confirmNewPasswordPlaceholder)}
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdating ? t(trans.userProfile.updating) : t(trans.userProfile.changePasswordButton)}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === "subscriptions" && (
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {t(trans.userProfile.subscriptionsTitle)}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  {t(trans.userProfile.subscriptionsDescription)}
                </p>

                <div className="space-y-6">
                  {/* Daily Digest */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {t(trans.userProfile.dailyDigest)}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {t(trans.userProfile.dailyDigestDescription)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <Button
                          onClick={() => window.open('https://lists.ivorysql.org/postorius/lists/pgtechdailycn.ivorysql.org/', 'manageSubscription', 'width=1000,height=800,scrollbars=yes,resizable=yes')}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t(trans.userProfile.manageSubscription)}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Digest */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {t(trans.userProfile.weeklyDigest)}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {t(trans.userProfile.weeklyDigestDescription)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <Button
                          onClick={() => window.open('https://lists.ivorysql.org/postorius/lists/pgtechweeklycn.ivorysql.org/', 'manageSubscription', 'width=1000,height=800,scrollbars=yes,resizable=yes')}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t(trans.userProfile.manageSubscription)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bot Access Tab */}
            {activeTab === "bot" && (
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {t(trans.userProfile.telegramBotTitle)}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  {t(trans.userProfile.telegramBotDescription)}
                </p>

                {/* Secret Key Section */}
                <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t(trans.userProfile.yourSecret)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {t(trans.userProfile.secretDescription)}
                  </p>

                  {isLoadingSecret ? (
                    <div className="text-center py-4">
                      <span className="text-slate-600 dark:text-slate-400">
                        {t(trans.userProfile.loading)}
                      </span>
                    </div>
                  ) : telegramSecret ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={showSecret ? telegramSecret : maskSecret(telegramSecret)}
                          readOnly
                          className="font-mono bg-white dark:bg-slate-900"
                        />
                        <Button
                          onClick={() => setShowSecret(!showSecret)}
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0"
                        >
                          {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          onClick={handleCopySecret}
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleGenerateSecret}
                        disabled={isGenerating}
                        variant="outline"
                        className="w-full"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                        {isGenerating ? t(trans.userProfile.generating) : t(trans.userProfile.regenerateSecret)}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {t(trans.userProfile.noSecretYet)}
                      </p>
                      <Button
                        onClick={handleGenerateSecret}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        <Bot className={`h-4 w-4 mr-2 ${isGenerating ? "animate-pulse" : ""}`} />
                        {isGenerating ? t(trans.userProfile.generating) : t(trans.userProfile.generateSecret)}
                      </Button>
                    </div>
                  )}
                </div>

                {/* How to Use Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                    {t(trans.userProfile.howToUse)}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">
                        1
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        {t(trans.userProfile.step1)} <span className="font-semibold">@pgnexus_bot</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">
                        2
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        {t(trans.userProfile.step2)} <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">{t(trans.userProfile.startCommand)}</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">
                        3
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        {t(trans.userProfile.step3)} <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">{t(trans.userProfile.step3Command)}</span> {t(trans.userProfile.step3Suffix)}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">
                        4
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        {t(trans.userProfile.step4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Telegram Link and QR Code */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Telegram Link */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Bot className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      PGNexus Bot
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      @pgnexus_bot
                    </p>
                    <Button
                      onClick={() => window.open("https://t.me/pgnexus_bot", "_blank")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t(trans.userProfile.openTelegram)}
                    </Button>
                  </div>

                  {/* QR Code */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                      {t(trans.userProfile.scanQrCode)}
                    </p>
                    <div className="relative w-48 h-48 bg-white dark:bg-slate-900 rounded-lg p-2 shadow-md">
                      <Image
                        src="/images/pgnexus-telegram.webp"
                        alt="PGNexus Telegram Bot QR Code"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    }>
      <UserProfileContent />
    </Suspense>
  );
}
