import React, { useState } from 'react';
import {
  Brain,
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Department, User } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  departments: Department[];
  availableUsers: User[];
  onRegisterUser: (newUser: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  departments,
  availableUsers,
  onRegisterUser,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDeptId, setRegDeptId] = useState<number>(departments[0]?.id || 1);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedEmail = loginEmail.trim().toLowerCase();
    const user = availableUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmedEmail ||
        u.username.toLowerCase() === trimmedEmail
    );

    if (!user) {
      setLoginError('Email hoặc tài khoản không tồn tại trong hệ thống doanh nghiệp.');
      return;
    }

    // Check password (allow default demo password123 or whatever is stored)
    if (user.password && loginPassword && user.password !== loginPassword) {
      setLoginError('Mật khẩu không chính xác. Mật khẩu mặc định là: password123');
      return;
    }

    onLoginSuccess(user);
  };

  // Quick fill demo user
  const handleSelectQuickDemo = (user: User) => {
    setLoginEmail(user.email);
    setLoginPassword(user.password || 'password123');
    setLoginError('');
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    const emailTrimmed = regEmail.trim().toLowerCase();
    if (availableUsers.some((u) => u.email.toLowerCase() === emailTrimmed)) {
      setRegError('Email này đã được đăng ký trong hệ thống.');
      return;
    }

    const selectedDept = departments.find((d) => d.id === regDeptId) || departments[0];

    const newUser: User = {
      id: Date.now(),
      email: emailTrimmed,
      username: emailTrimmed.split('@')[0],
      full_name: regFullName.trim(),
      role: 'EMPLOYEE',
      department_id: selectedDept.id,
      department_name: selectedDept.name,
      department_code: selectedDept.code,
      security_level: 'LEVEL_1_STAFF',
      token: `jwt-auth-token-${selectedDept.code.toLowerCase()}-${Date.now()}`,
      password: regPassword,
    };

    onRegisterUser(newUser);
    setRegSuccess('Đăng ký thành công! Hệ thống đang tự động đăng nhập theo phòng ban của bạn...');

    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 900);
  };

  return (
    <div className="min-h-screen w-screen flex bg-[#070b14] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">
      {/* Floating Ambient Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

      {/* Left Column: Brand & Security Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative z-10 border-r border-slate-800/80 bg-gradient-to-br from-[#0a0f1f]/80 to-[#070b14]/90 backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                DocuMind
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-bold">
                Enterprise v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Hệ Tri Thức Doanh Nghiệp &amp; AI Đối Chiếu Nguồn</p>
          </div>
        </div>

        {/* Center Presentation Pitch */}
        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Trust RBAC &amp; Automated Identity Routing</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Truy xuất tri thức nội bộ chính xác tuyệt đối, bảo mật đa phòng ban.
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Hệ thống tự động nhận diện danh tính và phân quyền truy xuất dữ liệu theo tài khoản đăng nhập.
            Mọi câu trả lời của AI đều được trích dẫn chính xác số trang, điều khoản từ văn bản có hiệu lực.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phân Quyền Tự Động</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Đăng nhập tự nhận biết vị trí, tự chuyển vào không gian làm việc tương ứng.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Trích Dẫn Có Kiểm Chứng</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Không ảo giác, 100% đối chiếu điều khoản văn bản gốc có chữ ký số.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 font-mono flex items-center justify-between">
          <span>© 2026 DocuMind Corporation</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>IAM Security Service Online</span>
          </span>
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-7 sm:p-8 space-y-6 backdrop-blur-xl">
          {/* Mobile Brand Title */}
          <div className="lg:hidden flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base text-white">DocuMind Enterprise</span>
              <p className="text-[11px] text-slate-400 font-mono">Hệ Thống Phân Quyền &amp; Tri Thức</p>
            </div>
          </div>

          {/* Tab Switcher: Đăng Nhập vs Đăng Ký */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
              }}
              className={`py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setRegError('');
                setRegSuccess('');
              }}
              className={`py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Đăng Ký Nhân Viên</span>
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Đăng Nhập Doanh Nghiệp</h2>
                <p className="text-xs text-slate-400">
                  Hệ thống tự nhận diện chức vụ và phân quyền truy xuất tương ứng.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                    EMAIL DOANH NGHIỆP / TÊN ĐĂNG NHẬP
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@documind.internal"
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-mono text-slate-300 font-semibold">
                      MẬT KHẨU
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">Mặc định: password123</span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-98 transition-all"
              >
                <span>Xác Thực &amp; Vào Không Gian Làm Việc</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Accounts Picker */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>TÀI KHOẢN MẪU ĐỂ TEST PHÂN QUYỀN:</span>
                  <span className="text-indigo-400">Nhấp để điền nhanh</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {availableUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectQuickDemo(u)}
                      className="p-2 rounded-lg bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left transition-all text-[11px] group"
                    >
                      <div className="font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                        {u.full_name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {u.role === 'ADMIN' ? '👑 Admin Toàn Quyền' : u.department_code}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER FORM FOR NEW EMPLOYEES */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Đăng Ký Nhân Viên Mới</h2>
                <p className="text-xs text-slate-400">
                  Tạo tài khoản theo phòng ban để hệ thống tự động cấp quyền truy xuất.
                </p>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                    HỌ VÀ TÊN NHÂN VIÊN
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Ví dụ: Hoàng Tuấn Kiệt"
                      className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                    EMAIL DOANH NGHIỆP
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="tuankiet@documind.internal"
                      className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                    PHÒNG BAN TRỰC THUỘC (TỰ ĐỘNG PHÂN QUYỀN RBAC)
                  </label>
                  <div className="relative flex items-center">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <select
                      value={regDeptId}
                      onChange={(e) => setRegDeptId(Number(e.target.value))}
                      className="w-full h-10 pl-10 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                      MẬT KHẨU
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1 font-semibold">
                      XÁC NHẬN MẬT KHẨU
                    </label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-98 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Đăng Ký &amp; Nhận Phân Quyền Phòng Ban</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
