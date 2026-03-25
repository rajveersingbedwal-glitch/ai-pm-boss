# frontend/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  {
    href: "/",
    label: "Command Center",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projects",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "Task Board",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    href: "/reports",
    label: "AI Reports",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
];

const AGENT_STATUS = [
  { name: "Task Creator", active: true },
  { name: "PR Mapper", active: true },
  { name: "Risk Detector", active: false },
  { name: "Report Gen", active: true },
  { name: "Standup Bot", active: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Cycle through agents pulsing
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => (p + 1) % AGENT_STATUS.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .sidebar {
          font-family: 'DM Sans', sans-serif;
          width: ${collapsed ? "72px" : "260px"};
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
          background: #080c14;
          border-right: 1px solid rgba(0,255,180,0.08);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          left: 0; top: 0;
          z-index: 50;
          overflow: hidden;
        }

        .sidebar-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,180,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,180,0.03) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(0,255,180,0.07);
          flex-shrink: 0;
          position: relative;
        }

        .brand-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #00ffb4 0%, #00c8ff 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          position: relative;
          box-shadow: 0 0 20px rgba(0,255,180,0.4);
          animation: iconGlow 3s ease-in-out infinite;
        }

        @keyframes iconGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,180,0.4); }
          50% { box-shadow: 0 0 35px rgba(0,255,180,0.7), 0 0 60px rgba(0,200,255,0.3); }
        }

        .brand-text {
          overflow: hidden;
          transition: opacity 0.25s, width 0.35s;
          opacity: ${collapsed ? 0 : 1};
          width: ${collapsed ? "0px" : "180px"};
          white-space: nowrap;
        }

        .brand-title {
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
          line-height: 1;
        }

        .brand-sub {
          font-size: 10px;
          color: rgba(0,255,180,0.6);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 2px;
          font-family: 'Space Mono', monospace;
        }

        .collapse-btn {
          position: absolute;
          right: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px; height: 24px;
          border-radius: 50%;
          background: #0d1420;
          border: 1px solid rgba(0,255,180,0.2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(0,255,180,0.7);
          transition: all 0.2s;
          z-index: 10;
        }
        .collapse-btn:hover {
          background: rgba(0,255,180,0.1);
          border-color: rgba(0,255,180,0.5);
          color: #00ffb4;
        }
        .collapse-btn svg {
          transform: rotate(${collapsed ? 0 : 180}deg);
          transition: transform 0.35s;
        }

        .nav-section {
          padding: 16px 12px;
          flex: 1;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .nav-section::-webkit-scrollbar { display: none; }

        .nav-label {
          font-size: 9px;
          font-family: 'Space Mono', monospace;
          color: rgba(255,255,255,0.2);
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 0 8px;
          margin-bottom: 6px;
          overflow: hidden;
          white-space: nowrap;
          transition: opacity 0.25s;
          opacity: ${collapsed ? 0 : 1};
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.45);
          transition: all 0.2s;
          margin-bottom: 2px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
        }

        .nav-item:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(0,255,180,0.06);
        }

        .nav-item.active {
          color: #00ffb4;
          background: rgba(0,255,180,0.1);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 3px;
          background: linear-gradient(180deg, #00ffb4, #00c8ff);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 10px rgba(0,255,180,0.5);
        }

        .nav-icon {
          flex-shrink: 0;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-text {
          font-size: 13.5px;
          font-weight: 500;
          transition: opacity 0.25s;
          opacity: ${collapsed ? 0 : 1};
        }

        .agents-section {
          padding: 12px;
          border-top: 1px solid rgba(0,255,180,0.07);
          flex-shrink: 0;
        }

        .agents-title {
          font-size: 9px;
          font-family: 'Space Mono', monospace;
          color: rgba(255,255,255,0.2);
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 0 8px;
          margin-bottom: 10px;
          transition: opacity 0.25s;
          opacity: ${collapsed ? 0 : 1};
          white-space: nowrap;
        }

        .agent-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 8px;
          border-radius: 6px;
          margin-bottom: 1px;
          transition: background 0.2s;
        }
        .agent-row:hover { background: rgba(255,255,255,0.03); }

        .agent-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          position: relative;
        }
        .agent-dot.on {
          background: #00ffb4;
          box-shadow: 0 0 8px rgba(0,255,180,0.6);
        }
        .agent-dot.off {
          background: rgba(255,255,255,0.15);
        }
        .agent-dot.pulsing::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,255,180,0.5);
          animation: agentPulse 1.2s ease-out infinite;
        }
        @keyframes agentPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .agent-name {
          font-size: 11.5px;
          color: rgba(255,255,255,0.4);
          white-space: nowrap;
          transition: opacity 0.25s;
          opacity: ${collapsed ? 0 : 1};
        }
        .agent-name.on { color: rgba(255,255,255,0.65); }

        .bottom-user {
          padding: 12px;
          border-top: 1px solid rgba(0,255,180,0.07);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .user-avatar {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1a2a3a, #0d2030);
          border: 1px solid rgba(0,255,180,0.25);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #00ffb4;
          flex-shrink: 0;
        }

        .user-info {
          overflow: hidden;
          transition: opacity 0.25s;
          opacity: ${collapsed ? 0 : 1};
          white-space: nowrap;
        }

        .user-name {
          font-size: 12.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        .user-role {
          font-size: 10px;
          color: rgba(0,255,180,0.55);
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.5px;
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-grid-bg" />

        {/* Brand */}
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#080c14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">AI PM BOSS</div>
            <div className="brand-sub">Autonomous</div>
          </div>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="nav-section">
          <div className="nav-label">Navigation</div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
              title={collapsed ? item.label : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Agent Status */}
        <div className="agents-section">
          <div className="agents-title">AI Agents</div>
          {AGENT_STATUS.map((agent, i) => (
            <div className="agent-row" key={agent.name}>
              <span
                className={`agent-dot ${agent.active ? "on" : "off"} ${
                  i === pulse && agent.active ? "pulsing" : ""
                }`}
              />
              <span className={`agent-name ${agent.active ? "on" : ""}`}>{agent.name}</span>
            </div>
          ))}
        </div>

        {/* User */}
        <div className="bottom-user">
          <div className="user-avatar">SF</div>
          <div className="user-info">
            <div className="user-name">Sofi Faiz</div>
            <div className="user-role">Team Lead · PM</div>
          </div>
        </div>
      </aside>
    </>
  );
}
