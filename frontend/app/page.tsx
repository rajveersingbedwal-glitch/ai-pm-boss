"use client";

import { useState, useEffect } from "react";
import StatsGrid from "@/components/StatsGrid";
import AIInputBox from "@/components/AIInputBox";
import RiskAlert from "@/components/RiskAlert";

const ACTIVITY = [
  { id: 1, icon: "🤖", text: "Task Creator Agent created 4 tasks from PRD", time: "2m ago", accent: "#00ffb4" },
  { id: 2, icon: "🔀", text: "PR #47 mapped to TASK-023 automatically", time: "14m ago", accent: "#00c8ff" },
  { id: 3, icon: "⚠️", text: "Risk detected: Auth Service sprint velocity down 38%", time: "1h ago", accent: "#ff6b6b" },
  { id: 4, icon: "📊", text: "Weekly report generated and sent to Slack", time: "3h ago", accent: "#a78bfa" },
  { id: 5, icon: "✅", text: "Sprint 12 closed — 78% completion rate", time: "5h ago", accent: "#34d399" },
  { id: 6, icon: "👤", text: "Dev Kumar assigned to Payment Gateway PR review", time: "6h ago", accent: "#fbbf24" },
];

interface ActivityItem {
  id: number;
  icon: string;
  text: string;
  time: string;
  accent: string;
}

interface SectionTitleProps {
  children: React.ReactNode;
  sub?: string;
}

interface QuickAction {
  label: string;
  icon: string;
  accent: string;
  onClick: () => void;
}

function ActivityFeed() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .activity-feed { font-family: 'DM Sans', sans-serif; }
        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          opacity: 0;
          transform: translateX(10px);
          animation: actSlide 0.4s ease forwards;
        }
        @keyframes actSlide {
          to { opacity: 1; transform: translateX(0); }
        }
        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .activity-text {
          font-size: 12.5px;
          color: rgba(255,255,255,0.6);
          line-height: 1.45;
          flex: 1;
        }
        .activity-time {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          font-family: 'Space Mono', monospace;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .activity-accent-line {
          width: 2px;
          border-radius: 2px;
          flex-shrink: 0;
          min-height: 32px;
          opacity: 0.5;
        }
      `}</style>
      <div className="activity-feed">
        {visible &&
          ACTIVITY.map((item: ActivityItem, i: number) => (
            <div
              className="activity-item"
              key={item.id}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className="activity-accent-line"
                style={{ background: item.accent }}
              />
              <div className="activity-icon">{item.icon}</div>
              <div className="activity-text">{item.text}</div>
              <span className="activity-time">{item.time}</span>
            </div>
          ))}
      </div>
    </>
  );
}

function SectionTitle({ children, sub }: SectionTitleProps) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.65)",
          margin: 0,
          letterSpacing: "0.3px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {children}
      </h2>
      {sub && (
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.2)",
            margin: "4px 0 0",
            letterSpacing: "0.5px",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <span>
      {time.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })}
      {" · "}
      {time.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </span>
  );
}

function QuickActions() {
  const actions: QuickAction[] = [
    {
      label: "Run Standup Bot",
      icon: "📅",
      accent: "#00ffb4",
      onClick: () => alert("Standup triggered!"),
    },
    {
      label: "Scan for Delays",
      icon: "🔍",
      accent: "#ff6b6b",
      onClick: () => alert("Risk scan started!"),
    },
    {
      label: "Generate Report",
      icon: "📊",
      accent: "#a78bfa",
      onClick: () => alert("Report queued!"),
    },
    {
      label: "Sync Jira Tasks",
      icon: "🔄",
      accent: "#00c8ff",
      onClick: () => alert("Jira sync started!"),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .quick-actions-panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 20px;
          font-family: 'DM Sans', sans-serif;
        }
        .qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .qa-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .qa-btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-1px);
        }
        .qa-btn-icon { font-size: 18px; line-height: 1; }
        .qa-btn-label {
          font-size: 11.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          line-height: 1.3;
        }
      `}</style>
      <div className="quick-actions-panel">
        <SectionTitle sub="One-click agent triggers">
          ⚡ Quick Actions
        </SectionTitle>
        <div className="qa-grid">
          {actions.map((a: QuickAction) => (
            <button
              key={a.label}
              className="qa-btn"
              onClick={a.onClick}
              style={{ borderColor: `${a.accent}18` }}
            >
              <span className="qa-btn-icon">{a.icon}</span>
              <span
                className="qa-btn-label"
                style={{ color: `${a.accent}cc` }}
              >
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const [greeting] = useState<string>(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .dash-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #06090f;
          color: #fff;
          padding: 32px 36px;
          position: relative;
        }

        .dash-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
          z-index: 0;
        }

        .dash-content { position: relative; z-index: 1; }

        .dash-header {
          margin-bottom: 32px;
          animation: fadeDown 0.6s ease;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dash-greeting {
          font-size: 11px;
          font-family: 'Space Mono', monospace;
          color: rgba(0,255,180,0.6);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .dash-title {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .dash-title span {
          background: linear-gradient(135deg, #00ffb4, #00c8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dash-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin-top: 6px;
        }

        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        @media (max-width: 1100px) {
          .dash-grid { grid-template-columns: 1fr; }
          .dash-page { padding: 24px 20px; }
        }

        .dash-main { display: flex; flex-direction: column; gap: 24px; }

        .dash-sidebar-col { display: flex; flex-direction: column; gap: 20px; }

        .dash-panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 20px;
        }

        .dash-datetime {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }

        .datetime-text {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          text-align: right;
          line-height: 1.4;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00ffb4;
          box-shadow: 0 0 8px rgba(0,255,180,0.6);
          animation: livePulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(0,255,180,0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 20px rgba(0,255,180,0.8); }
        }

        .header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
      `}</style>

      <div className="dash-page">
        <div className="dash-content">
          <div className="dash-header">
            <div className="header-row">
              <div>
                <div className="dash-greeting">{greeting}, Sofi 👋</div>
                <h1 className="dash-title">
                  Command <span>Center</span>
                </h1>
                <p className="dash-sub">
                  AI agents processed 134 actions today · 3 agents running
                </p>
              </div>
              <div className="dash-datetime">
                <span className="live-dot" />
                <div className="datetime-text">
                  <LiveClock />
                  <div>AI Boss · Online</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-grid">
            <div className="dash-main">
              <section>
                <SectionTitle sub="Real-time project intelligence">
                  📊 Overview
                </SectionTitle>
                <StatsGrid />
              </section>

              <section>
                <SectionTitle sub="Natural language · agent execution">
                  🤖 AI Boss Console
                </SectionTitle>
                <AIInputBox />
              </section>

              <section>
                <RiskAlert />
              </section>
            </div>

            <div className="dash-sidebar-col">
              <div className="dash-panel">
                <SectionTitle sub="Live agent actions & events">
                  ⚡ Activity Feed
                </SectionTitle>
                <ActivityFeed />
              </div>
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}