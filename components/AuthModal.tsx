'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { X, Mail, Lock, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal, setUser } = useStore();

  const [isLogin, setIsLogin] = useState<boolean>(authModalTab !== 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  // Sync tab state when opened
  React.useEffect(() => {
    setIsLogin(authModalTab !== 'register');
    setError(null);
    setSuccessMsg(null);
    setShowForgot(false);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (showForgot) {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
        setSuccessMsg(data.message);
        setLoading(false);
        return;
      }

      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, rememberMe }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Неверный логин или пароль');

        setUser(data.user);
        setSuccessMsg('Вы успешно вошли в аккаунт!');
        setTimeout(() => {
          closeAuthModal();
        }, 800);
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, phone }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');

        setUser(data.user);
        setSuccessMsg('Регистрация прошла успешно!');
        setTimeout(() => {
          closeAuthModal();
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Произошла непредвиденная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = (provider: string) => {
    setError(
      `Вход через ${provider} требует настройки OAuth credentials в Google Cloud Console и .env файле.`
    );
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-2 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <form className="form w-full" onSubmit={handleSubmit}>
          <div className="text-center mb-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {showForgot
                ? 'Восстановление пароля'
                : isLogin
                ? 'Вход в UPGRADE'
                : 'Создать аккаунт'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {showForgot
                ? 'Введите ваш email для получения ссылки'
                : isLogin
                ? 'Введите данные для входа в личный кабинет'
                : 'Заполните форму для регистрации нового пользователя'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-xs text-green-700 font-medium">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!isLogin && !showForgot && (
            <>
              <div className="flex-column">
                <label>Ваше Имя</label>
              </div>
              <div className="inputForm">
                <User className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>

              <div className="flex-column">
                <label>Телефон</label>
              </div>
              <div className="inputForm">
                <Phone className="w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+998 90 123-45-67"
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex-column">
            <label>Email</label>
          </div>
          <div className="inputForm">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!showForgot && (
            <>
              <div className="flex-column">
                <label>Password</label>
              </div>
              <div className="inputForm">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex-row">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#e5007d] rounded border-gray-300 focus:ring-[#e5007d]"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-gray-600 cursor-pointer">
                    Remember me
                  </label>
                </div>
                {isLogin && (
                  <span
                    className="span text-xs hover:underline"
                    onClick={() => {
                      setShowForgot(true);
                      setError(null);
                      setSuccessMsg(null);
                    }}
                  >
                    Forgot password?
                  </span>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="button-submit flex items-center justify-center gap-2 font-bold"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : showForgot ? (
              'Отправить ссылку'
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Sign Up'
            )}
          </button>

          {showForgot ? (
            <p className="p">
              Вспомнили пароль?{' '}
              <span
                className="span font-bold"
                onClick={() => {
                  setShowForgot(false);
                  setIsLogin(true);
                  setError(null);
                  setSuccessMsg(null);
                }}
              >
                Вернуться ко входу
              </span>
            </p>
          ) : (
            <p className="p">
              {isLogin ? "Don't have an account? " : 'Уже есть аккаунт? '}
              <span
                className="span font-bold"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccessMsg(null);
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </span>
            </p>
          )}

          {!showForgot && (
            <>
              <p className="p text-xs text-gray-400 uppercase tracking-widest my-1">
                Or With
              </p>

              <div className="flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthClick('Google')}
                  className="btn google"
                >
                  <svg
                    viewBox="0 0 512 512"
                    width="20"
                    height="20"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z"
                      fill="#fbbb00"
                    />
                    <path
                      d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176z"
                      fill="#518ef8"
                    />
                    <path
                      d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                      fill="#28b446"
                    />
                    <path
                      d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z"
                      fill="#f14336"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthClick('Apple')}
                  className="btn apple"
                >
                  <svg
                    viewBox="0 0 22.773 22.773"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="flex-shrink-0"
                  >
                    <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                    <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
                  </svg>
                  Apple
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
